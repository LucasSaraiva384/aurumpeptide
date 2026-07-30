-- Aurum Peptide — SEO técnico do catálogo público (apps/site).
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para schema.sql, erp.sql,
-- storage.sql e edicoes.sql). Só ALTER TABLE ADD COLUMN IF NOT EXISTS
-- (todas opcionais/nullable) + um índice novo — nenhuma tabela, trigger,
-- policy ou coluna existente é removida, renomeada ou tem seu
-- comportamento alterado.
--
-- Todas as colunas abaixo são opcionais: quando ficam em branco, o site
-- gera title/description/slug automaticamente a partir de nome/descricao/
-- categoria (ver apps/site/lib/seo.ts). RLS de `produtos` já cobre leitura
-- pública dos produtos `ativo = true` — as colunas novas herdam a mesma
-- policy automaticamente, sem policy adicional.

-- =========================================================
-- produtos: campos de SEO por produto, todos preenchíveis no admin
-- (componentes/ProdutoForm.tsx, seção "SEO").
-- =========================================================
alter table produtos add column if not exists seo_title text;
alter table produtos add column if not exists seo_description text;
alter table produtos add column if not exists seo_slug text;
alter table produtos add column if not exists seo_canonical text;
alter table produtos add column if not exists seo_og_image text;
-- seo_robots: ex. "index,follow" / "noindex,nofollow". Vazio/null = padrão
-- indexável (index,follow), aplicado no fallback de apps/site/lib/seo.ts.
alter table produtos add column if not exists seo_robots text;

-- Índice único parcial: evita colisão se o admin preencher seo_slug manual
-- duplicado em dois produtos, sem impedir múltiplos produtos com
-- seo_slug ainda nulo (fallback automático via slugify(nome) + id).
create unique index if not exists produtos_seo_slug_key
  on produtos (seo_slug)
  where seo_slug is not null;
