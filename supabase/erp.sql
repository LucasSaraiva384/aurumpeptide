-- Aurum Peptide — expansão ERP financeiro/operacional (compras, retiradas,
-- marketing, ledger financeiro único)
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para schema.sql e storage.sql).
-- Só ALTER TABLE ADD COLUMN / CREATE aditivos — nenhuma tabela ou coluna
-- existente é removida ou renomeada, e o trigger handle_new_pedido_item
-- (baixa de estoque na venda) não é tocado.

-- =========================================================
-- produtos: custo médio (só escrito pelo trigger de compra) + gates do
-- módulo Marketing (publicado/destaque no site)
-- =========================================================
alter table produtos add column if not exists custo_medio numeric(10,2) not null default 0;
alter table produtos add column if not exists publicado boolean not null default true;
alter table produtos add column if not exists destaque boolean not null default false;

-- =========================================================
-- pedido_itens: snapshot do custo no momento da venda (permite calcular
-- lucro por venda e Custo dos Produtos Vendidos histórico)
-- =========================================================
alter table pedido_itens add column if not exists custo_unitario numeric(10,2) not null default 0;

-- =========================================================
-- compras — entrada de estoque com custo: alimenta o custo médio
-- ponderado do produto e o total de investimento em mercadoria
-- =========================================================
create table compras (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id),
  quantidade integer not null check (quantidade > 0),
  custo_unitario numeric(10,2) not null check (custo_unitario >= 0),
  valor_total numeric(10,2) generated always as (quantidade * custo_unitario) stored,
  data date not null default current_date,
  observacao text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- retiradas — histórico de retirada de caixa por sócio (conta fixa
-- 'lucas' | 'vinicius', não ligada ao usuário autenticado no painel)
-- =========================================================
create table retiradas (
  id uuid primary key default gen_random_uuid(),
  socio text not null check (socio in ('lucas', 'vinicius')),
  valor numeric(10,2) not null check (valor > 0),
  data date not null default current_date,
  observacao text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- marketing_midias — banners/destaques/promocionais geridos pelo admin.
-- Tabela nova, não consumida pelo site ainda (fora de escopo desta leva).
-- =========================================================
create table marketing_midias (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('banner_principal', 'destaque', 'promocional')),
  titulo text,
  imagem_url text not null,
  link text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- transacoes: o ledger único vira a fonte de verdade de todas as
-- métricas financeiras (antes só distinguia receita/despesa)
-- =========================================================
alter table transacoes drop constraint if exists transacoes_tipo_check;
alter table transacoes add constraint transacoes_tipo_check
  check (tipo in ('venda', 'compra', 'despesa', 'retirada', 'investimento'));
update transacoes set tipo = 'venda' where tipo = 'receita';

-- =========================================================
-- Automação
-- =========================================================

-- handle_new_pedido: mesmo corpo de supabase/schema.sql, só troca o tipo
-- inserido de 'receita' para 'venda' agora que o ledger tem 5 tipos.
create or replace function handle_new_pedido()
returns trigger as $$
begin
  insert into transacoes (tipo, categoria, valor, pedido_id, descricao)
    values ('venda', 'venda', new.valor_total, new.id, 'Venda ' || new.id);

  if new.cliente_id is not null then
    update clientes
      set
        ultima_compra_em = new.data,
        primeira_compra_em = coalesce(primeira_compra_em, new.data),
        valor_total_gasto = valor_total_gasto + new.valor_total
      where id = new.cliente_id;
  end if;

  return new;
end;
$$ language plpgsql;

-- Trigger NOVO e separado do handle_new_pedido_item existente (que
-- continua 100% intocado, cuidando só da baixa de estoque): snapshot do
-- custo médio do produto no momento da venda, para permitir calcular
-- lucro por venda mais tarde sem depender do custo médio atual.
create function handle_pedido_item_custo() returns trigger as $$
begin
  new.custo_unitario := coalesce((select custo_medio from produtos where id = new.produto_id), 0);
  return new;
end;
$$ language plpgsql;

create trigger pedido_itens_before_insert_custo
  before insert on pedido_itens
  for each row execute function handle_pedido_item_custo();

-- Trigger NOVO: compra -> soma estoque, recalcula custo médio ponderado,
-- registra o movimento de entrada e a transação de compra no ledger.
create function handle_new_compra() returns trigger as $$
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

  insert into transacoes (tipo, categoria, valor, descricao)
    values ('compra', 'compra_estoque', new.valor_total, 'Compra — produto ' || new.produto_id);

  return new;
end;
$$ language plpgsql;

create trigger compras_after_insert after insert on compras
  for each row execute function handle_new_compra();

-- Trigger NOVO: retirada -> lança a transação de caixa correspondente,
-- categorizada por sócio.
create function handle_new_retirada() returns trigger as $$
begin
  insert into transacoes (tipo, categoria, valor, descricao)
    values ('retirada', 'retirada_' || new.socio, new.valor, 'Retirada — ' || new.socio);
  return new;
end;
$$ language plpgsql;

create trigger retiradas_after_insert after insert on retiradas
  for each row execute function handle_new_retirada();

-- =========================================================
-- Row Level Security — mesmo padrão authenticated-only das tabelas
-- existentes em schema.sql
-- =========================================================
alter table compras enable row level security;
alter table retiradas enable row level security;
alter table marketing_midias enable row level security;

create policy compras_all_authenticated on compras for all to authenticated using (true) with check (true);
create policy retiradas_all_authenticated on retiradas for all to authenticated using (true) with check (true);
create policy marketing_midias_all_authenticated on marketing_midias for all to authenticated using (true) with check (true);

-- =========================================================
-- Storage — bucket novo pro Marketing (o bucket 'produtos' e
-- supabase/storage.sql não são tocados)
-- =========================================================
insert into storage.buckets (id, name, public) values ('marketing', 'marketing', true)
  on conflict (id) do nothing;

create policy marketing_storage_select_public on storage.objects for select to anon, authenticated using (bucket_id = 'marketing');
create policy marketing_storage_write_authenticated on storage.objects for insert to authenticated with check (bucket_id = 'marketing');
create policy marketing_storage_delete_authenticated on storage.objects for delete to authenticated using (bucket_id = 'marketing');

-- =========================================================
-- Seed: investimento inicial (idempotente — não duplica se rodar de novo)
-- =========================================================
insert into transacoes (tipo, categoria, valor, descricao)
  select 'investimento', 'aporte_inicial', 3620.00, 'Investimento inicial da empresa'
  where not exists (select 1 from transacoes where categoria = 'aporte_inicial');
