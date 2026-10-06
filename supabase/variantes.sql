-- Aurum Peptide — Variantes de produto (ex.: Retagen 120mg / 160mg).
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo de schema.sql, erp.sql, seo.sql etc.).
-- Idempotente: pode rodar mais de uma vez sem efeito colateral.
--
-- Modelo: cada variante CONTINUA sendo uma linha própria em `produtos`
-- (preço, estoque_atual, custo_medio, imagens, seo_slug próprios). Nada de
-- estoque/custo/ERP muda — os triggers de compras/pedidos → estoque/
-- custo_medio/transacoes seguem funcionando exatamente como antes, porque
-- o produto_id gravado continua sendo o da linha da variante.
--
-- As duas colunas novas só AGRUPAM linhas já existentes:
--   grupo_variante  — chave compartilhada entre as variantes (ex.: 'retagen').
--                     Null = produto sem variantes (comportamento de hoje).
--   variante_rotulo — rótulo curto exibido no seletor do site e no seletor
--                     de produto do admin (ex.: '120mg').
--
-- RLS: a policy pública de leitura de `produtos` (schema.sql,
-- produtos_select_public) é por linha, não por coluna — as colunas novas
-- herdam a mesma policy automaticamente, sem grant/policy adicional.

alter table produtos add column if not exists grupo_variante text;
alter table produtos add column if not exists variante_rotulo text;

create index if not exists produtos_grupo_variante_idx
  on produtos (grupo_variante)
  where grupo_variante is not null;

-- =========================================================
-- Dados: Retagen (OXYGEN LABS®) 120mg / 160mg
-- =========================================================
update produtos
   set grupo_variante = 'retagen', variante_rotulo = '120mg'
 where id = '8f22b01a-0b3f-4486-94f9-1372b747bfd6';

update produtos
   set grupo_variante = 'retagen', variante_rotulo = '160mg'
 where id = '464f5a72-e0fa-44b2-9040-165ee3e2bc74';
