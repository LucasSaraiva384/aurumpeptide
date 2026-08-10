-- Aurum Peptide — frete em compras + ajuste de caixa (saldo anterior ao
-- fluxo de caixa).
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para schema.sql, erp.sql e
-- edicoes.sql). Só ALTER TABLE ADD COLUMN / DROP+CREATE aditivos e um
-- INSERT idempotente — nenhuma tabela existente é removida e nenhuma
-- compra histórica muda de valor.

-- =========================================================
-- compras.frete: quanto foi pago de frete naquela compra, separado do
-- custo_unitario do produto. Aditiva, default 0 — linhas já existentes
-- continuam com frete = 0 e não mudam de valor_total.
-- =========================================================
alter table compras add column if not exists frete numeric(10,2) not null default 0 check (frete >= 0);

-- =========================================================
-- compras.valor_total: coluna gerada (generated always as stored). Postgres
-- não permite alterar a expressão de uma coluna gerada existente in-place
-- (ALTER COLUMN ... SET EXPRESSION não existe), então precisa dropar e
-- recriar. Isso não apaga dado histórico: quantidade e custo_unitario
-- continuam intactos, frete é 0 em toda linha antiga (default acima), então
-- o valor recalculado de qualquer compra já existente fica idêntico ao que
-- já era (quantidade * custo_unitario + 0). Precisa vir DEPOIS do ALTER
-- ADD COLUMN frete acima — a expressão gerada referencia essa coluna.
--
-- handle_new_compra (supabase/edicoes.sql) grava new.valor_total como a
-- transação 'compra' no ledger (dinheiro que efetivamente saiu do caixa,
-- incluindo frete) mas usa só new.custo_unitario — não valor_total — para
-- recalcular o custo médio ponderado do produto. Ou seja, o frete passa a
-- impactar corretamente o caixa sem distorcer o custo médio por unidade.
-- Não precisa mexer no corpo dessa trigger.
-- =========================================================
alter table compras drop column if exists valor_total;
alter table compras add column valor_total numeric(10,2) generated always as (quantidade * custo_unitario + frete) stored;

-- =========================================================
-- atualizar_compra: ganha o parâmetro p_frete, o que muda a assinatura da
-- função — Postgres não permite mudar a lista de parâmetros com
-- create or replace, então precisa dropar pela assinatura exata (a de
-- supabase/edicoes.sql) e recriar. Mesmo comportamento de antes, só
-- passando a também atualizar/validar o frete.
-- =========================================================
drop function if exists atualizar_compra(uuid, uuid, integer, numeric, date, text);

create function atualizar_compra(
  p_compra_id uuid,
  p_produto_id uuid,
  p_quantidade integer,
  p_custo_unitario numeric,
  p_frete numeric,
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
  if p_frete < 0 then
    raise exception 'O frete não pode ser negativo.';
  end if;

  update compras set
    produto_id = p_produto_id,
    quantidade = p_quantidade,
    custo_unitario = p_custo_unitario,
    frete = p_frete,
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

grant execute on function atualizar_compra(uuid, uuid, integer, numeric, numeric, date, text) to authenticated;

-- =========================================================
-- Ajuste de caixa único: saldo de vendas feitas antes de existir este
-- sistema de fluxo de caixa (R$ 2.700,00 já na conta da empresa hoje).
-- tipo = 'investimento' de propósito (não 'venda'): lib/finance.ts soma
-- 'investimento' como entrada de caixa com o mesmo peso de 'venda', então o
-- valor entra corretamente como dinheiro disponível — mas sem contaminar os
-- totais de "Vendas"/faturamento em Relatórios e gráficos, já que não é uma
-- venda nova. Mesmo padrão idempotente do seed 'aporte_inicial' em
-- supabase/erp.sql — não duplica se este arquivo for rodado de novo.
-- =========================================================
insert into transacoes (tipo, categoria, valor, descricao)
  select 'investimento', 'ajuste_caixa_anterior', 2700.00,
    'Ajuste de caixa — saldo de vendas anteriores à criação do fluxo de caixa'
  where not exists (select 1 from transacoes where categoria = 'ajuste_caixa_anterior');
