// Espelha a tabela `produtos` de supabase/schema.sql + supabase/erp.sql +
// supabase/catalogo.sql (apenas as colunas relevantes para o catálogo
// público), além das tabelas novas de catálogo administrável.
//
// `type`, não `interface`: o supabase-js/postgrest-js valida os tipos de
// tabela contra `Record<string, unknown>` em posições de tipo condicional
// (`extends`), e um `interface` nomeado nunca satisfaz esse check mesmo
// tendo o mesmo formato de um `type` — isso faz `Row`/`Insert` colapsarem
// silenciosamente para `never` em todas as queries tipadas. Ver também
// apps/admin/lib/types.ts, mesma armadilha.
export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  // categoria: texto livre legado (supabase/schema.sql), ainda lida como
  // fallback. categoria_id é a fonte nova (FK para categorias, supabase/
  // catalogo.sql) — pode ser nulo em produtos ainda não migrados no admin,
  // ver cabeçalho de supabase/catalogo.sql.
  categoria: string | null;
  categoria_id: string | null;
  marca_id: string | null;
  keywords: string[];
  destaque: boolean;
  mais_vendido: boolean;
  lancamento: boolean;
  promocao: boolean;
  imagem_url: string | null;
  imagens: string[];
  estoque_atual: number;
  ativo: boolean;
  publicado: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_slug: string | null;
  seo_canonical: string | null;
  seo_og_image: string | null;
  seo_robots: string | null;
};

/** Formato comum das 3 tabelas de catálogo administrável (categorias/marcas/aplicacoes). */
type EntidadeCatalogoBase = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
};

export type Categoria = EntidadeCatalogoBase & {
  imagem_url: string | null;
};

export type Marca = EntidadeCatalogoBase & {
  logo_url: string | null;
};

// Aplicacao tem página própria (/aplicacoes/[slug]) — por isso, ao contrário
// de Categoria/Marca, carrega também os campos seo_* (mesmo padrão opcional
// de Produto: em branco = geração automática via lib/seo.ts).
export type Aplicacao = EntidadeCatalogoBase & {
  imagem_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_canonical: string | null;
  seo_og_image: string | null;
  seo_robots: string | null;
};

export type ProdutoAplicacao = {
  produto_id: string;
  aplicacao_id: string;
};

/** Formato mínimo de categoria/marca/aplicação quando anexado a um produto. */
export type EntidadeRef = { id: string; nome: string; slug: string };

/**
 * `Produto` com os relacionamentos resolvidos (categoria/marca/aplicações)
 * — montado em memória por `anexarRelacoes` (lib/produtos.ts) a partir de
 * queries separadas, não de embedded resources do PostgREST (catálogo
 * pequeno, mais simples e previsível). Estende `Produto` (não substitui),
 * então continua compatível com `ProductCard`/`ProductGrid`, que só leem
 * os campos base.
 */
export type ProdutoComRelacoes = Produto & {
  categoriaRef: EntidadeRef | null;
  marcaRef: EntidadeRef | null;
  aplicacoesRef: EntidadeRef[];
};

export type Database = {
  public: {
    Tables: {
      // O site é somente leitura (usa só a chave anon, ver
      // docs/plataforma/arquitetura.md) — Insert/Update aqui existem só
      // para satisfazer o generic do supabase-js, nunca são usados.
      // `Relationships` também é exigido pelo tipo GenericTable interno do
      // postgrest-js — sem ele a inferência de `Row` quebra silenciosamente.
      produtos: {
        Row: Produto;
        Insert: Partial<Produto>;
        Update: Partial<Produto>;
        Relationships: [];
      };
      categorias: {
        Row: Categoria;
        Insert: Partial<Categoria>;
        Update: Partial<Categoria>;
        Relationships: [];
      };
      marcas: {
        Row: Marca;
        Insert: Partial<Marca>;
        Update: Partial<Marca>;
        Relationships: [];
      };
      aplicacoes: {
        Row: Aplicacao;
        Insert: Partial<Aplicacao>;
        Update: Partial<Aplicacao>;
        Relationships: [];
      };
      produto_aplicacoes: {
        Row: ProdutoAplicacao;
        Insert: Partial<ProdutoAplicacao>;
        Update: Partial<ProdutoAplicacao>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
