-- Aurum Peptide — catálogo administrável (categorias, marcas, aplicações)
-- + colunas novas de vitrine em produtos (keywords, badges de destaque)
--
-- O que este arquivo adiciona:
--   * tabelas novas categorias / marcas / aplicacoes (cada uma com nome,
--     slug, imagem, ordem de exibição e ativo/inativo — administráveis
--     pelo painel);
--   * tabela de junção produto_aplicacoes (N:N entre produtos e aplicacoes);
--   * colunas novas em produtos: categoria_id / marca_id (FKs para as
--     tabelas novas), keywords (busca), mais_vendido / lancamento /
--     promocao (badges de vitrine no site);
--   * índices, RLS e um bucket de Storage ('catalogo') para as imagens de
--     categoria/marca/aplicação, seguindo exatamente os padrões já usados
--     em schema.sql, erp.sql e storage.sql;
--   * seed idempotente de categorias e aplicações com os nomes já
--     definidos pelo negócio;
--   * migração não destrutiva do texto livre produtos.categoria para o
--     produtos.categoria_id novo.
--
-- 100% ADITIVO: nenhuma tabela, coluna, trigger ou policy existente é
-- removida, renomeada ou tem comportamento alterado.
--   * produtos.categoria (texto livre) NÃO é tocada — continua existindo
--     como legado, só deixa de ser a única fonte da categoria do produto.
--   * produtos.destaque já existe (criada em erp.sql) — não é recriada
--     aqui, é uma coluna diferente de mais_vendido/lancamento/promocao.
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para schema.sql, erp.sql,
-- storage.sql, edicoes.sql e seo.sql).

create extension if not exists "unaccent";

-- =========================================================
-- catalogo_slugify — mesma lógica de apps/site/lib/seo.ts::slugify()
-- (minúsculo, sem acento, não-alfanumérico vira hífen, sem hífen nas
-- pontas). Função auxiliar só deste arquivo, reaproveitada em todos os
-- seeds e na migração abaixo para não repetir a expressão várias vezes.
--
-- Nota: a lógica precisa aplicar lower() ANTES do regexp_replace — se a
-- string ainda estiver com maiúsculas quando o regexp roda, a classe
-- [^a-z0-9] (só minúsculas) trata as maiúsculas como "não-alfanumérico"
-- e as substitui por hífen incorretamente (ex.: "Performance" viraria
-- "-erformance"). Por isso a ordem aqui é lower(unaccent(texto)) e só
-- depois o regexp_replace, replicando o comportamento real do slugify()
-- em TS (normalize -> toLowerCase -> replace).
-- =========================================================
create or replace function catalogo_slugify(texto text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(unaccent(texto)), '[^a-z0-9]+', '-', 'g'));
$$;

-- =========================================================
-- categorias / marcas / aplicacoes — catálogo administrável
-- =========================================================
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  imagem_url text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table marcas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  logo_url text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table aplicacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  imagem_url text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- campos de SEO, mesmo padrão opcional de produtos (ver supabase/seo.sql)
  seo_title text,
  seo_description text,
  seo_canonical text,
  seo_og_image text,
  seo_robots text
);

-- reaproveita a função set_updated_at() já criada em schema.sql
create trigger categorias_set_updated_at
before update on categorias
for each row execute function set_updated_at();

create trigger marcas_set_updated_at
before update on marcas
for each row execute function set_updated_at();

create trigger aplicacoes_set_updated_at
before update on aplicacoes
for each row execute function set_updated_at();

-- =========================================================
-- produto_aplicacoes — junção N:N entre produtos e aplicacoes
-- =========================================================
create table produto_aplicacoes (
  produto_id uuid not null references produtos(id) on delete cascade,
  aplicacao_id uuid not null references aplicacoes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (produto_id, aplicacao_id)
);

-- =========================================================
-- produtos: colunas novas de vitrine (categoria_id/marca_id convivem com
-- a coluna categoria texto-livre já existente, que não é alterada)
-- =========================================================
alter table produtos add column if not exists categoria_id uuid references categorias(id) on delete set null;
alter table produtos add column if not exists marca_id uuid references marcas(id) on delete set null;
alter table produtos add column if not exists keywords text[] not null default '{}';
alter table produtos add column if not exists mais_vendido boolean not null default false;
alter table produtos add column if not exists lancamento boolean not null default false;
alter table produtos add column if not exists promocao boolean not null default false;
-- produtos.destaque já existe (criada em erp.sql) — não recriada aqui.

-- =========================================================
-- Índices
-- =========================================================
create index if not exists produtos_categoria_id_idx on produtos (categoria_id);
create index if not exists produtos_marca_id_idx on produtos (marca_id);
-- a PK composta (produto_id, aplicacao_id) já cobre buscas por produto_id;
-- falta a direção reversa (todos os produtos de uma aplicação).
create index if not exists produto_aplicacoes_aplicacao_id_idx on produto_aplicacoes (aplicacao_id);

-- =========================================================
-- Row Level Security — mesmo padrão de produtos em schema.sql: leitura
-- pública só de itens ativos para anon, acesso completo para authenticated
-- =========================================================
alter table categorias enable row level security;
alter table marcas enable row level security;
alter table aplicacoes enable row level security;
alter table produto_aplicacoes enable row level security;

create policy categorias_select_public on categorias
  for select to anon using (ativo = true);
create policy categorias_all_authenticated on categorias
  for all to authenticated using (true) with check (true);

create policy marcas_select_public on marcas
  for select to anon using (ativo = true);
create policy marcas_all_authenticated on marcas
  for all to authenticated using (true) with check (true);

create policy aplicacoes_select_public on aplicacoes
  for select to anon using (ativo = true);
create policy aplicacoes_all_authenticated on aplicacoes
  for all to authenticated using (true) with check (true);

-- produto_aplicacoes não tem coluna ativo própria e só guarda dois uuids
-- (sem dado sensível) — leitura pública sem filtro, igual à galeria de
-- imagens de produtos.
create policy produto_aplicacoes_select_public on produto_aplicacoes
  for select to anon using (true);
create policy produto_aplicacoes_all_authenticated on produto_aplicacoes
  for all to authenticated using (true) with check (true);

-- =========================================================
-- Storage — bucket novo 'catalogo' para imagens de categoria/marca/
-- aplicação (buckets 'produtos' e 'marketing' não são tocados)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('catalogo', 'catalogo', true)
on conflict (id) do nothing;

create policy catalogo_storage_select_public on storage.objects
  for select to anon, authenticated using (bucket_id = 'catalogo');

create policy catalogo_storage_insert_authenticated on storage.objects
  for insert to authenticated with check (bucket_id = 'catalogo');

create policy catalogo_storage_update_authenticated on storage.objects
  for update to authenticated using (bucket_id = 'catalogo');

create policy catalogo_storage_delete_authenticated on storage.objects
  for delete to authenticated using (bucket_id = 'catalogo');

-- =========================================================
-- Seed idempotente — categorias (ordem preserva a lista definida pelo
-- negócio). Um único insert...select...where not exists por linha da
-- lista via VALUES, mesma garantia de idempotência do padrão usado em
-- erp.sql (insert...select...where not exists), só compactado num
-- statement em vez de repetir 13 inserts quase idênticos.
-- =========================================================
insert into categorias (nome, slug, ordem)
select v.nome, catalogo_slugify(v.nome), v.ordem
from (values
  ('Emagrecimento', 0),
  ('Performance', 1),
  ('Recuperação', 2),
  ('Longevidade', 3),
  ('Saúde Metabólica', 4),
  ('Cognição', 5),
  ('Bem-estar', 6),
  ('Regeneração', 7),
  ('Hormônio do Crescimento', 8),
  ('Sono', 9),
  ('Libido', 10),
  ('Anti-aging', 11),
  ('Outros', 12)
) as v(nome, ordem)
where not exists (
  select 1 from categorias existing where lower(existing.nome) = lower(v.nome)
);

-- =========================================================
-- Seed idempotente — aplicacoes
-- =========================================================
insert into aplicacoes (nome, slug, ordem)
select v.nome, catalogo_slugify(v.nome), v.ordem
from (values
  ('Emagrecimento', 0),
  ('Recuperação', 1),
  ('Performance', 2),
  ('Longevidade', 3),
  ('Saúde Metabólica', 4),
  ('Cognição', 5),
  ('Anti-aging', 6),
  ('Sono', 7),
  ('Libido', 8),
  ('Pele', 9),
  ('Regeneração', 10),
  ('Outros', 11)
) as v(nome, ordem)
where not exists (
  select 1 from aplicacoes existing where lower(existing.nome) = lower(v.nome)
);

-- =========================================================
-- Migração não destrutiva: produtos.categoria (texto livre) ->
-- produtos.categoria_id. A coluna categoria continua existindo e não é
-- tocada; isto só preenche categoria_id quando dá para casar o texto.
-- =========================================================

-- Passo 1: garante que todo valor distinto hoje em uso em
-- produtos.categoria também exista em categorias — pode haver digitação
-- livre no admin que não bate com nenhum nome do seed acima. `distinct`
-- na subquery evita tentar inserir o mesmo nome novo duas vezes na mesma
-- execução (ex.: vários produtos com a mesma categoria digitada à mão);
-- row_number() garante uma ordem sequencial única para cada categoria
-- nova, em vez de todas caírem no mesmo valor de ordem.
insert into categorias (nome, slug, ordem)
select
  d.nome,
  catalogo_slugify(d.nome),
  base.max_ordem + row_number() over (order by d.nome)
from (
  select distinct trim(p.categoria) as nome
  from produtos p
  where p.categoria is not null
    and trim(p.categoria) <> ''
) d
cross join (select coalesce(max(ordem), 0) as max_ordem from categorias) base
where not exists (
  select 1 from categorias existing where lower(existing.nome) = lower(d.nome)
);

-- Passo 2: backfill de categoria_id a partir do texto livre, só onde
-- ainda está nulo (não sobrescreve categoria_id já setado manualmente
-- pelo admin depois desta migração).
update produtos p
set categoria_id = c.id
from categorias c
where p.categoria_id is null
  and p.categoria is not null
  and lower(trim(p.categoria)) = lower(trim(c.nome));

-- Nota: se algum produto tiver categoria com digitação muito inconsistente
-- (espaços duplicados no meio, acentos/caracteres estranhos que não batem
-- mesmo após trim) e por algum motivo não tiver sido coberto pelo Passo 1
-- acima, ele fica com categoria_id nulo. Isso é esperado, não é bug desta
-- migração — o admin pode corrigir manualmente associando a categoria
-- correta depois, via painel.
