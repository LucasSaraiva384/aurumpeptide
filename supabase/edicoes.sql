-- Aurum Peptide — edição de pedidos, compras e clientes.
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para schema.sql, erp.sql e
-- storage.sql). Só ALTER TABLE ADD COLUMN / CREATE (OR REPLACE) aditivos —
-- nenhuma tabela ou trigger existente é removida ou tem seu comportamento
-- de INSERT alterado:
--   - handle_new_pedido_item (baixa de estoque na venda) — intocado.
--   - pedido_itens_before_insert_custo (snapshot de custo_medio) — intocado.
--   - handle_new_retirada — intocado.
--   - handle_new_compra — recriado (create or replace) só para também
--     gravar compra_id na transação gerada; o cálculo de estoque/custo
--     médio é idêntico ao de supabase/erp.sql.
--
-- Modelo de edição adotado (decisão confirmada com o usuário): "edição
-- direta" — editar um pedido/compra recalcula automaticamente
-- estoque/custo médio/financeiro/estatísticas do cliente para refletir o
-- valor corrigido, sem manter um registro de estorno visível na UI
-- (diferente do padrão contábil de estorno + relançamento). Ver
-- docs/plataforma/edicao-pedidos-compras-clientes.md para o desenho
-- completo.

-- =========================================================
-- transacoes: vínculo com compras (mesmo padrão do pedido_id já existente),
-- necessário para localizar e sincronizar a transação de uma compra
-- editada sem duplicar linha no ledger.
-- =========================================================
alter table transacoes add column if not exists compra_id uuid references compras(id);

-- Backfill: vincula compra_id nas transações de compra que já existiam
-- antes desta migration (criadas por handle_new_compra sem essa coluna).
-- Casamento por produto (extraído da descrição) + valor + created_at
-- idêntico — dentro da mesma transação de banco, now() é constante, então
-- a compra e a transação que ela gerou (handle_new_compra insere as duas
-- no mesmo INSERT/trigger) sempre têm o created_at exatamente igual.
-- Idempotente (só afeta linhas com compra_id ainda nulo) e best-effort: se
-- não achar par exato, a linha antiga simplesmente fica sem compra_id, e
-- só passa a ficar dessincronizada se aquela compra específica for editada
-- (o resto do sistema não depende de compra_id estar preenchido).
update transacoes t
  set compra_id = c.id
  from compras c
  where t.tipo = 'compra'
    and t.compra_id is null
    and t.valor = c.valor_total
    and t.created_at = c.created_at
    and t.descricao = 'Compra — produto ' || c.produto_id;

-- handle_new_compra: mesmo corpo de supabase/erp.sql, só populando
-- compra_id na transação gerada.
create or replace function handle_new_compra() returns trigger as $$
declare
  estoque_anterior integer;
  custo_anterior numeric(10,2);
begin
  select estoque_atual, custo_medio into estoque_anterior, custo_anterior
    from produtos where id = new.produto_id;

  update produtos set
    estoque_atual = estoque_anterior + new.quantidade,
    custo_medio = case when (estoque_anterior + new.quantidade) = 0 then 0
      else ((estoque_anterior * custo_anterior) + (new.quantidade * new.custo_unitario))
           / (estoque_anterior + new.quantidade)
    end
    where id = new.produto_id;

  insert into estoque_movimentos (produto_id, tipo, quantidade, motivo)
    values (new.produto_id, 'entrada', new.quantidade, 'Compra ' || new.id);

  insert into transacoes (tipo, categoria, valor, compra_id, descricao)
    values ('compra', 'compra_estoque', new.valor_total, new.id, 'Compra — produto ' || new.produto_id);

  return new;
end;
$$ language plpgsql;

-- =========================================================
-- recompute_produto_estoque_custo: recalcula do zero estoque_atual e
-- custo_medio de um produto, reproduzindo cronologicamente o mesmo efeito
-- que os triggers de INSERT já produzem — compras somam estoque e
-- recalculam a média ponderada (mesma fórmula de handle_new_compra),
-- vendas (pedido_itens) só reduzem estoque e nunca alteram custo médio.
--
-- Chamado depois de editar ou apagar uma compra: reverter a média
-- ponderada por delta não é seguro quando outras compras aconteceram
-- depois, então em vez disso todo o histórico (compras + vendas daquele
-- produto) é reprocessado em ordem cronológica. Precisa intercalar compras
-- e vendas (não só somar totais separados) porque a fórmula de média
-- ponderada de handle_new_compra usa o estoque_atual no momento de CADA
-- compra como base — um estoque que já reflete vendas anteriores.
-- =========================================================
create function recompute_produto_estoque_custo(p_produto_id uuid)
returns void as $$
declare
  evento record;
  v_estoque integer := 0;
  v_estoque_anterior integer;
  v_custo numeric(10,2) := 0;
begin
  for evento in (
    select c.data, c.created_at, c.quantidade as delta, c.custo_unitario, true as is_entrada
      from compras c
      where c.produto_id = p_produto_id
    union all
    select p.data, p.created_at, -pi.quantidade as delta, null::numeric(10,2) as custo_unitario, false as is_entrada
      from pedido_itens pi
      join pedidos p on p.id = pi.pedido_id
      where pi.produto_id = p_produto_id
    order by 1, 2
  )
  loop
    if evento.is_entrada then
      v_estoque_anterior := v_estoque;
      v_estoque := v_estoque + evento.delta;
      v_custo := case when v_estoque = 0 then 0
        else ((v_estoque_anterior * v_custo) + (evento.delta * evento.custo_unitario)) / v_estoque
        end;
    else
      v_estoque := v_estoque + evento.delta; -- delta já negativo
    end if;
  end loop;

  update produtos set estoque_atual = v_estoque, custo_medio = v_custo where id = p_produto_id;
end;
$$ language plpgsql;

-- Trigger novo: qualquer UPDATE ou DELETE em compras dispara o recompute
-- do(s) produto(s) afetado(s) — cobre o caso de produto_id mudar na edição.
create function handle_compra_alterada() returns trigger as $$
begin
  if tg_op = 'DELETE' then
    perform recompute_produto_estoque_custo(old.produto_id);
    return old;
  end if;

  perform recompute_produto_estoque_custo(new.produto_id);
  if old.produto_id is distinct from new.produto_id then
    perform recompute_produto_estoque_custo(old.produto_id);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger compras_after_update_delete
  after update or delete on compras
  for each row execute function handle_compra_alterada();

-- =========================================================
-- pedido_itens: estorno automático de estoque ao apagar um item — usado
-- pela RPC atualizar_pedido (apaga os itens antigos e insere os novos). A
-- trigger AFTER INSERT existente (handle_new_pedido_item) já cuida de
-- aplicar a baixa dos itens novos, não precisa mexer nela.
-- =========================================================
create function handle_pedido_item_delete() returns trigger as $$
begin
  update produtos
    set estoque_atual = estoque_atual + old.quantidade
    where id = old.produto_id;

  insert into estoque_movimentos (produto_id, tipo, quantidade, motivo)
    values (old.produto_id, 'entrada', old.quantidade, 'Estorno — edição do pedido ' || old.pedido_id);

  return old;
end;
$$ language plpgsql;

create trigger pedido_itens_before_delete
  before delete on pedido_itens
  for each row execute function handle_pedido_item_delete();

-- =========================================================
-- recompute_cliente_estatisticas: recalcula do zero (agregação real sobre
-- todos os pedidos do cliente) em vez de patchear por delta — o volume de
-- dados é baixo o suficiente pra isso ser barato, e é robusto a qualquer
-- edição anterior.
-- =========================================================
create function recompute_cliente_estatisticas(p_cliente_id uuid) returns void as $$
begin
  if p_cliente_id is null then
    return;
  end if;

  update clientes set
    valor_total_gasto = coalesce((select sum(valor_total) from pedidos where cliente_id = p_cliente_id), 0),
    primeira_compra_em = (select min(data) from pedidos where cliente_id = p_cliente_id),
    ultima_compra_em = (select max(data) from pedidos where cliente_id = p_cliente_id)
    where id = p_cliente_id;
end;
$$ language plpgsql;

-- =========================================================
-- atualizar_pedido: RPC transacional para edição direta de um pedido com
-- múltiplos itens. Apaga os pedido_itens antigos (dispara o estorno de
-- estoque via trigger acima), atualiza a linha de pedidos, insere os itens
-- novos (dispara a baixa de estoque + snapshot de custo via triggers já
-- existentes), sincroniza a transação de venda vinculada (UPDATE, nunca um
-- segundo INSERT) e recalcula as estatísticas do cliente — do cliente novo
-- e, se mudou, também do cliente antigo.
--
-- p_itens: array jsonb de objetos {"produtoId": uuid, "quantidade": int,
-- "precoUnitario": numeric} — mesmo formato do estado `itens` do
-- PedidoForm no frontend.
-- =========================================================
create function atualizar_pedido(
  p_pedido_id uuid,
  p_cliente_id uuid,
  p_forma_pagamento text,
  p_observacao text,
  p_itens jsonb
) returns void as $$
declare
  v_cliente_antigo uuid;
  v_valor_total numeric(10,2);
  item jsonb;
begin
  select cliente_id into v_cliente_antigo from pedidos where id = p_pedido_id;

  if not found then
    raise exception 'Pedido % não encontrado', p_pedido_id;
  end if;

  select coalesce(sum((item->>'quantidade')::integer * (item->>'precoUnitario')::numeric), 0)
    into v_valor_total
    from jsonb_array_elements(p_itens) as item;

  if p_itens is null or jsonb_array_length(p_itens) = 0 or v_valor_total <= 0 then
    raise exception 'O pedido precisa de ao menos um item válido.';
  end if;

  -- dispara handle_pedido_item_delete (estorno de estoque) item a item
  delete from pedido_itens where pedido_id = p_pedido_id;

  update pedidos set
    cliente_id = p_cliente_id,
    valor_total = v_valor_total,
    forma_pagamento = p_forma_pagamento,
    observacao = p_observacao
    where id = p_pedido_id;

  -- dispara pedido_itens_before_insert_custo (snapshot de custo_medio
  -- atual) e handle_new_pedido_item (baixa de estoque) já existentes
  for item in select * from jsonb_array_elements(p_itens)
  loop
    insert into pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
      values (
        p_pedido_id,
        (item->>'produtoId')::uuid,
        (item->>'quantidade')::integer,
        (item->>'precoUnitario')::numeric
      );
  end loop;

  update transacoes set valor = v_valor_total
    where pedido_id = p_pedido_id and tipo = 'venda';

  perform recompute_cliente_estatisticas(p_cliente_id);
  if v_cliente_antigo is distinct from p_cliente_id then
    perform recompute_cliente_estatisticas(v_cliente_antigo);
  end if;
end;
$$ language plpgsql;

-- =========================================================
-- atualizar_compra: RPC para edição direta de uma compra. Faz o UPDATE da
-- linha (a trigger compras_after_update_delete cuida do recompute de
-- estoque/custo médio do produto) e sincroniza a transação de compra
-- vinculada por compra_id.
-- =========================================================
create function atualizar_compra(
  p_compra_id uuid,
  p_produto_id uuid,
  p_quantidade integer,
  p_custo_unitario numeric,
  p_data date,
  p_observacao text
) returns void as $$
begin
  if p_quantidade <= 0 then
    raise exception 'A quantidade deve ser maior que zero.';
  end if;
  if p_custo_unitario < 0 then
    raise exception 'O custo unitário não pode ser negativo.';
  end if;

  update compras set
    produto_id = p_produto_id,
    quantidade = p_quantidade,
    custo_unitario = p_custo_unitario,
    data = p_data,
    observacao = p_observacao
    where id = p_compra_id;

  if not found then
    raise exception 'Compra % não encontrada', p_compra_id;
  end if;

  update transacoes set valor = (select valor_total from compras where id = p_compra_id)
    where compra_id = p_compra_id and tipo = 'compra';
end;
$$ language plpgsql;

-- =========================================================
-- Permissões de execução — mesmo padrão authenticated-only das policies de
-- RLS existentes. Sem isso, o PostgREST pode recusar a chamada via
-- supabase.rpc(...) para o role authenticated dependendo dos privilégios
-- default do projeto.
-- =========================================================
grant execute on function recompute_produto_estoque_custo(uuid) to authenticated;
grant execute on function recompute_cliente_estatisticas(uuid) to authenticated;
grant execute on function atualizar_pedido(uuid, uuid, text, text, jsonb) to authenticated;
grant execute on function atualizar_compra(uuid, uuid, integer, numeric, date, text) to authenticated;
