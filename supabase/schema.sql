-- Aurum Peptide — schema inicial (Supabase / Postgres)
-- Ver docs/plataforma/arquitetura.md para o desenho completo.
--
-- Como aplicar: crie o projeto no Supabase, abra o SQL Editor
-- (Project > SQL Editor > New query) e rode este arquivo inteiro.

create extension if not exists "pgcrypto";

-- =========================================================
-- produtos — catálogo público (leitura) + estoque (admin)
-- =========================================================
create table produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10,2) not null,
  categoria text,
  imagem_url text,
  estoque_atual integer not null default 0,
  estoque_minimo integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger produtos_set_updated_at
before update on produtos
for each row execute function set_updated_at();

-- =========================================================
-- clientes — dados para prospecção e histórico de recompra
-- =========================================================
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text,
  cidade text,
  primeira_compra_em date,
  ultima_compra_em date,
  valor_total_gasto numeric(10,2) not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- =========================================================
-- pedidos — venda fechada no WhatsApp, registrada no painel
-- =========================================================
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id),
  data date not null default current_date,
  valor_total numeric(10,2) not null,
  forma_pagamento text,
  canal text not null default 'whatsapp',
  observacao text,
  created_at timestamptz not null default now()
);

create table pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  produto_id uuid not null references produtos(id),
  quantidade integer not null check (quantidade > 0),
  preco_unitario numeric(10,2) not null
);

-- =========================================================
-- estoque_movimentos — histórico de entradas/saídas
-- =========================================================
create table estoque_movimentos (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id),
  tipo text not null check (tipo in ('entrada', 'saida')),
  quantidade integer not null check (quantidade > 0),
  data date not null default current_date,
  motivo text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- transacoes — fluxo de caixa
-- =========================================================
create table transacoes (
  id uuid primary key default gen_random_uuid(),
  data date not null default current_date,
  tipo text not null check (tipo in ('receita', 'despesa')),
  categoria text,
  valor numeric(10,2) not null,
  pedido_id uuid references pedidos(id),
  descricao text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Automação: registrar um pedido já baixa estoque, gera a
-- transação de receita e atualiza o histórico do cliente —
-- evita reentrada manual da mesma informação em 3 lugares.
-- =========================================================

-- Ao inserir um item de pedido: baixa o estoque do produto e
-- registra o movimento de saída correspondente.
create function handle_new_pedido_item()
returns trigger as $$
begin
  update produtos
    set estoque_atual = estoque_atual - new.quantidade
    where id = new.produto_id;

  insert into estoque_movimentos (produto_id, tipo, quantidade, motivo)
    values (new.produto_id, 'saida', new.quantidade, 'Venda — pedido ' || new.pedido_id);

  return new;
end;
$$ language plpgsql;

create trigger pedido_itens_after_insert
after insert on pedido_itens
for each row execute function handle_new_pedido_item();

-- Ao inserir um pedido: gera a transação de receita e atualiza
-- o cliente (primeira/última compra, valor total gasto).
create function handle_new_pedido()
returns trigger as $$
begin
  insert into transacoes (tipo, categoria, valor, pedido_id, descricao)
    values ('receita', 'venda', new.valor_total, new.id, 'Pedido ' || new.id);

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

create trigger pedidos_after_insert
after insert on pedidos
for each row execute function handle_new_pedido();

-- =========================================================
-- Row Level Security
--
-- produtos: leitura pública (só produtos ativos) para o
-- catálogo; leitura/escrita completa exige sessão autenticada
-- (painel admin). As demais tabelas (financeiro/clientes) não
-- têm NENHUMA política pública — só authenticated.
-- =========================================================

alter table produtos enable row level security;
alter table clientes enable row level security;
alter table pedidos enable row level security;
alter table pedido_itens enable row level security;
alter table estoque_movimentos enable row level security;
alter table transacoes enable row level security;

-- produtos: leitura pública dos itens ativos
create policy produtos_select_public on produtos
  for select
  to anon
  using (ativo = true);

-- produtos: acesso completo para o painel admin autenticado
create policy produtos_all_authenticated on produtos
  for all
  to authenticated
  using (true)
  with check (true);

-- demais tabelas: acesso completo, só para authenticated
create policy clientes_all_authenticated on clientes
  for all to authenticated using (true) with check (true);

create policy pedidos_all_authenticated on pedidos
  for all to authenticated using (true) with check (true);

create policy pedido_itens_all_authenticated on pedido_itens
  for all to authenticated using (true) with check (true);

create policy estoque_movimentos_all_authenticated on estoque_movimentos
  for all to authenticated using (true) with check (true);

create policy transacoes_all_authenticated on transacoes
  for all to authenticated using (true) with check (true);
