// Espelha supabase/schema.sql + supabase/erp.sql — tipos usados pelo painel admin.
//
// `type`, não `interface`: o supabase-js/postgrest-js valida os tipos de
// tabela contra `Record<string, unknown>` em posições de tipo condicional
// (`extends`), e um `interface` nomeado nunca satisfaz esse check mesmo
// tendo o mesmo formato de um `type` — isso faz `Row`/`Insert` colapsarem
// silenciosamente para `never` em todas as queries tipadas.

export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: string | null;
  imagem_url: string | null;
  imagens: string[];
  estoque_atual: number;
  estoque_minimo: number;
  ativo: boolean;
  // custo_medio: só escrito pelo trigger handle_new_compra (supabase/erp.sql),
  // nunca pelo ProdutoForm — é o custo médio ponderado do estoque atual.
  custo_medio: number;
  // publicado/destaque: gates do módulo Marketing (não vivem no ProdutoForm).
  publicado: boolean;
  destaque: boolean;
  // seo_*: campos opcionais de SEO técnico (supabase/seo.sql), editáveis na
  // seção "SEO" do ProdutoForm. Em branco = geração automática no site
  // (apps/site/lib/seo.ts) a partir de nome/descricao/categoria.
  seo_title: string | null;
  seo_description: string | null;
  seo_slug: string | null;
  seo_canonical: string | null;
  seo_og_image: string | null;
  seo_robots: string | null;
  created_at: string;
  updated_at: string;
};

export type Cliente = {
  id: string;
  nome: string;
  whatsapp: string | null;
  cidade: string | null;
  primeira_compra_em: string | null;
  ultima_compra_em: string | null;
  valor_total_gasto: number;
  tags: string[];
  created_at: string;
};

export type Pedido = {
  id: string;
  cliente_id: string | null;
  data: string;
  valor_total: number;
  forma_pagamento: string | null;
  canal: string;
  observacao: string | null;
  created_at: string;
};

export type PedidoItem = {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  // custo_unitario: snapshot do custo_medio do produto no momento da venda,
  // gravado pelo trigger BEFORE INSERT pedido_itens_before_insert_custo
  // (supabase/erp.sql) — nunca informado manualmente pelo PedidoForm.
  custo_unitario: number;
};

export type EstoqueMovimento = {
  id: string;
  produto_id: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  motivo: string | null;
  created_at: string;
};

export type Transacao = {
  id: string;
  data: string;
  // Ledger único: 'venda' (era 'receita') e 'compra'/'retirada'/'investimento'
  // chegaram com o módulo financeiro/ERP (supabase/erp.sql).
  tipo: "venda" | "compra" | "despesa" | "retirada" | "investimento";
  categoria: string | null;
  valor: number;
  pedido_id: string | null;
  // compra_id: vínculo com a compra que gerou esta transação (supabase/edicoes.sql)
  // — permite localizar e sincronizar a transação certa quando uma compra é editada.
  compra_id: string | null;
  descricao: string | null;
  created_at: string;
};

export type Compra = {
  id: string;
  produto_id: string;
  quantidade: number;
  custo_unitario: number;
  // valor_total: coluna gerada (generated always as stored) — nunca inserida
  // manualmente, só lida.
  valor_total: number;
  data: string;
  observacao: string | null;
  created_at: string;
};

export type Retirada = {
  id: string;
  // Conta fixa dos dois sócios do negócio, não ligada ao usuário autenticado.
  socio: "lucas" | "vinicius";
  valor: number;
  data: string;
  observacao: string | null;
  created_at: string;
};

export type MarketingMidia = {
  id: string;
  tipo: "banner_principal" | "destaque" | "promocional";
  titulo: string | null;
  imagem_url: string;
  link: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Tipagem do client Supabase (createServerClient<Database>/createBrowserClient<Database>).
// Só Row/Insert são usados no scaffold — Update fica igual a Insert em Partial
// por não haver telas de update parcial fora dos formulários de produto/cliente.
// `Relationships`/`Views`/`Functions` são exigidos pelo tipo GenericTable/
// GenericSchema interno do postgrest-js — sem eles a inferência de `Row`
// quebra silenciosamente (vira `never`) em vez de dar erro de tipo claro.
export type Database = {
  public: {
    Tables: {
      produtos: {
        Row: Produto;
        Insert: Partial<
          Pick<
            Produto,
            | "id"
            | "descricao"
            | "categoria"
            | "imagem_url"
            | "imagens"
            | "estoque_atual"
            | "estoque_minimo"
            | "ativo"
            | "custo_medio"
            | "publicado"
            | "destaque"
            | "seo_title"
            | "seo_description"
            | "seo_slug"
            | "seo_canonical"
            | "seo_og_image"
            | "seo_robots"
            | "created_at"
            | "updated_at"
          >
        > &
          Pick<Produto, "nome" | "preco">;
        Update: Partial<Produto>;
        Relationships: [];
      };
      clientes: {
        Row: Cliente;
        Insert: Partial<
          Pick<
            Cliente,
            "id" | "whatsapp" | "cidade" | "primeira_compra_em" | "ultima_compra_em" | "valor_total_gasto" | "tags" | "created_at"
          >
        > &
          Pick<Cliente, "nome">;
        Update: Partial<Cliente>;
        Relationships: [];
      };
      pedidos: {
        Row: Pedido;
        Insert: Partial<
          Pick<Pedido, "id" | "cliente_id" | "data" | "forma_pagamento" | "canal" | "observacao" | "created_at">
        > &
          Pick<Pedido, "valor_total">;
        Update: Partial<Pedido>;
        Relationships: [];
      };
      pedido_itens: {
        Row: PedidoItem;
        Insert: Partial<Pick<PedidoItem, "id" | "custo_unitario">> &
          Pick<PedidoItem, "pedido_id" | "produto_id" | "quantidade" | "preco_unitario">;
        Update: Partial<PedidoItem>;
        Relationships: [];
      };
      estoque_movimentos: {
        Row: EstoqueMovimento;
        Insert: Partial<Pick<EstoqueMovimento, "id" | "data" | "motivo" | "created_at">> &
          Pick<EstoqueMovimento, "produto_id" | "tipo" | "quantidade">;
        Update: Partial<EstoqueMovimento>;
        Relationships: [];
      };
      transacoes: {
        Row: Transacao;
        Insert: Partial<
          Pick<Transacao, "id" | "data" | "categoria" | "pedido_id" | "compra_id" | "descricao" | "created_at">
        > &
          Pick<Transacao, "tipo" | "valor">;
        Update: Partial<Transacao>;
        Relationships: [];
      };
      compras: {
        Row: Compra;
        // valor_total não entra no Insert: é coluna gerada pelo Postgres.
        Insert: Partial<Pick<Compra, "id" | "data" | "observacao" | "created_at">> &
          Pick<Compra, "produto_id" | "quantidade" | "custo_unitario">;
        Update: Partial<Compra>;
        Relationships: [];
      };
      retiradas: {
        Row: Retirada;
        Insert: Partial<Pick<Retirada, "id" | "data" | "observacao" | "created_at">> &
          Pick<Retirada, "socio" | "valor">;
        Update: Partial<Retirada>;
        Relationships: [];
      };
      marketing_midias: {
        Row: MarketingMidia;
        Insert: Partial<Pick<MarketingMidia, "id" | "titulo" | "link" | "ordem" | "ativo" | "created_at">> &
          Pick<MarketingMidia, "tipo" | "imagem_url">;
        Update: Partial<MarketingMidia>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    // Funções RPC de supabase/edicoes.sql — edição direta de pedido/compra
    // que recalcula estoque/custo médio/financeiro/estatísticas do cliente
    // dentro de uma transação no Postgres em vez de vários statements
    // soltos no client.
    Functions: {
      atualizar_pedido: {
        Args: {
          p_pedido_id: string;
          p_cliente_id: string | null;
          p_forma_pagamento: string | null;
          p_observacao: string | null;
          // Array de { produtoId, quantidade, precoUnitario } — mesmo
          // formato do estado `itens` do PedidoForm.
          p_itens: Json;
        };
        Returns: undefined;
      };
      atualizar_compra: {
        Args: {
          p_compra_id: string;
          p_produto_id: string;
          p_quantidade: number;
          p_custo_unitario: number;
          p_data: string;
          p_observacao: string | null;
        };
        Returns: undefined;
      };
    };
  };
};
