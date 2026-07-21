// Espelha supabase/schema.sql — tipos usados pelo painel admin.
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
  estoque_atual: number;
  estoque_minimo: number;
  ativo: boolean;
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
  tipo: "receita" | "despesa";
  categoria: string | null;
  valor: number;
  pedido_id: string | null;
  descricao: string | null;
  created_at: string;
};

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
            "id" | "descricao" | "categoria" | "imagem_url" | "estoque_atual" | "estoque_minimo" | "ativo" | "created_at" | "updated_at"
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
        Insert: Partial<Pick<PedidoItem, "id">> &
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
        Insert: Partial<Pick<Transacao, "id" | "data" | "categoria" | "pedido_id" | "descricao" | "created_at">> &
          Pick<Transacao, "tipo" | "valor">;
        Update: Partial<Transacao>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
