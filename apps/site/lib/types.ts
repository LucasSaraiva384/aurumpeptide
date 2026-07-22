// Espelha a tabela `produtos` de supabase/schema.sql (apenas as colunas
// relevantes para o catálogo público).
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
  categoria: string | null;
  imagem_url: string | null;
  imagens: string[];
  estoque_atual: number;
  ativo: boolean;
  publicado: boolean;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
