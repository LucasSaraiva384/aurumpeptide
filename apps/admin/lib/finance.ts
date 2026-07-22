// Agregações financeiras/operacionais do ERP (supabase/erp.sql).
//
// Tudo aqui é derivado de somas sobre `transacoes` (o ledger único) e
// `produtos`/`pedido_itens` — nenhum contador é gravado em disco separado.
// Reaproveitado por Dashboard, Financeiro, Estoque e Relatórios para não
// duplicar a mesma SQL/lógica em cada página.
//
// `supabase` aqui é sempre o client de Server Component (`lib/supabase/server`),
// tipado via `Database` em lib/types.ts.

import type { createClient } from "@/lib/supabase/server";
import type { Pedido, PedidoItem, Produto, Retirada, Transacao } from "@/lib/types";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

function somaPorTipo(transacoes: Pick<Transacao, "tipo" | "valor">[], tipo: Transacao["tipo"]): number {
  return transacoes.filter((t) => t.tipo === tipo).reduce((soma, t) => soma + Number(t.valor), 0);
}

/** Sinal do tipo de transação no caixa: entra (+1), sai (-1) ou não afeta caixa (0). */
function sinalCaixa(tipo: Transacao["tipo"]): number {
  if (tipo === "venda" || tipo === "investimento") return 1;
  if (tipo === "compra" || tipo === "despesa" || tipo === "retirada") return -1;
  return 0;
}

async function fetchProdutosComCapital(supabase: SupabaseServer) {
  const { data, error } = await supabase.from("produtos").select("*").order("nome").returns<Produto[]>();
  const produtos = (data ?? []).map((produto) => ({
    ...produto,
    capitalInvestido: produto.estoque_atual * Number(produto.custo_medio),
  }));
  const capitalEstoque = produtos.reduce((soma, produto) => soma + produto.capitalInvestido, 0);
  return { produtos, capitalEstoque, error };
}

export type ProdutoComCapital = Produto & { capitalInvestido: number };

export type ResumoEstoque = {
  capitalEstoque: number;
  produtos: ProdutoComCapital[];
};

/** Estoque atual, custo médio e capital investido por produto (tela Estoque). */
export async function getResumoEstoque(supabase: SupabaseServer): Promise<ResumoEstoque> {
  const { produtos, capitalEstoque } = await fetchProdutosComCapital(supabase);
  return { capitalEstoque, produtos };
}

export type ResumoFinanceiro = {
  caixaDisponivel: number;
  capitalEstoque: number;
  patrimonioOperacional: number;
  investimentoTotal: number;
  faturamentoTotal: number;
  custoProdutosVendidos: number;
  despesasTotal: number;
  comprasTotal: number;
  retiradasTotal: number;
  lucroLiquido: number;
};

/** Resumo financeiro global (all-time) — cards de Dashboard e Financeiro. */
export async function getResumoFinanceiro(supabase: SupabaseServer): Promise<ResumoFinanceiro> {
  const [{ data: transacoes }, { data: pedidoItens }, { capitalEstoque }] = await Promise.all([
    supabase.from("transacoes").select("tipo, valor").returns<Pick<Transacao, "tipo" | "valor">[]>(),
    supabase.from("pedido_itens").select("quantidade, custo_unitario").returns<Pick<PedidoItem, "quantidade" | "custo_unitario">[]>(),
    fetchProdutosComCapital(supabase),
  ]);

  const lista = transacoes ?? [];
  const vendas = somaPorTipo(lista, "venda");
  const compras = somaPorTipo(lista, "compra");
  const despesas = somaPorTipo(lista, "despesa");
  const retiradas = somaPorTipo(lista, "retirada");
  const investimento = somaPorTipo(lista, "investimento");

  const custoProdutosVendidos = (pedidoItens ?? []).reduce(
    (soma, item) => soma + item.quantidade * Number(item.custo_unitario),
    0,
  );

  const caixaDisponivel = vendas + investimento - compras - despesas - retiradas;

  return {
    caixaDisponivel,
    capitalEstoque,
    patrimonioOperacional: caixaDisponivel + capitalEstoque,
    investimentoTotal: investimento + compras,
    faturamentoTotal: vendas,
    custoProdutosVendidos,
    despesasTotal: despesas,
    comprasTotal: compras,
    retiradasTotal: retiradas,
    lucroLiquido: vendas - custoProdutosVendidos - despesas,
  };
}

export type ResumoPeriodo = {
  vendas: number;
  compras: number;
  despesas: number;
  retiradas: number;
  investimento: number;
  custoProdutosVendidos: number;
  lucroLiquido: number;
  caixaPeriodo: number;
  pedidosCount: number;
};

/** Mesmas métricas de getResumoFinanceiro, restritas a um período [de, ate] (tela Relatórios). */
export async function getResumoPeriodo(supabase: SupabaseServer, de: string, ate: string): Promise<ResumoPeriodo> {
  const [{ data: transacoes }, { data: pedidos }] = await Promise.all([
    supabase
      .from("transacoes")
      .select("tipo, valor")
      .gte("data", de)
      .lte("data", ate)
      .returns<Pick<Transacao, "tipo" | "valor">[]>(),
    supabase.from("pedidos").select("id").gte("data", de).lte("data", ate).returns<Pick<Pedido, "id">[]>(),
  ]);

  const pedidoIds = (pedidos ?? []).map((pedido) => pedido.id);
  const { data: itens } =
    pedidoIds.length > 0
      ? await supabase
          .from("pedido_itens")
          .select("quantidade, custo_unitario")
          .in("pedido_id", pedidoIds)
          .returns<Pick<PedidoItem, "quantidade" | "custo_unitario">[]>()
      : { data: [] as Pick<PedidoItem, "quantidade" | "custo_unitario">[] };

  const lista = transacoes ?? [];
  const vendas = somaPorTipo(lista, "venda");
  const compras = somaPorTipo(lista, "compra");
  const despesas = somaPorTipo(lista, "despesa");
  const retiradas = somaPorTipo(lista, "retirada");
  const investimento = somaPorTipo(lista, "investimento");
  const custoProdutosVendidos = (itens ?? []).reduce((soma, item) => soma + item.quantidade * Number(item.custo_unitario), 0);

  return {
    vendas,
    compras,
    despesas,
    retiradas,
    investimento,
    custoProdutosVendidos,
    lucroLiquido: vendas - custoProdutosVendidos - despesas,
    caixaPeriodo: vendas + investimento - compras - despesas - retiradas,
    pedidosCount: pedidoIds.length,
  };
}

export type EvolucaoMensal = {
  mes: string;
  mesISO: string;
  vendas: number;
  compras: number;
  despesas: number;
  retiradas: number;
  investimento: number;
  custoProdutosVendidos: number;
  lucroLiquido: number;
  caixaMes: number;
  // Caixa acumulado até o fim do mês — usado como proxy do gráfico
  // patrimonial. O capital em estoque não tem histórico armazenado (só o
  // custo médio *atual* é conhecido), então a série patrimonial completa
  // (caixa + estoque) só existe no presente — ver getResumoFinanceiro.
  caixaAcumulado: number;
};

function mesLabel(data: Date): string {
  const label = data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
  return label.replace(".", "");
}

/** Série mensal (últimos `meses`) para os 4 gráficos do Dashboard. */
export async function getEvolucaoMensal(supabase: SupabaseServer, meses = 6): Promise<EvolucaoMensal[]> {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - (meses - 1), 1);
  const inicioISO = inicio.toISOString().slice(0, 10);

  const [{ data: transacoes }, { data: pedidos }, { data: transacoesAnteriores }] = await Promise.all([
    supabase
      .from("transacoes")
      .select("data, tipo, valor")
      .gte("data", inicioISO)
      .returns<Pick<Transacao, "data" | "tipo" | "valor">[]>(),
    supabase.from("pedidos").select("id, data").gte("data", inicioISO).returns<Pick<Pedido, "id" | "data">[]>(),
    supabase.from("transacoes").select("tipo, valor").lt("data", inicioISO).returns<Pick<Transacao, "tipo" | "valor">[]>(),
  ]);

  const pedidoIds = (pedidos ?? []).map((pedido) => pedido.id);
  const { data: itens } =
    pedidoIds.length > 0
      ? await supabase
          .from("pedido_itens")
          .select("pedido_id, quantidade, custo_unitario")
          .in("pedido_id", pedidoIds)
          .returns<Pick<PedidoItem, "pedido_id" | "quantidade" | "custo_unitario">[]>()
      : { data: [] as Pick<PedidoItem, "pedido_id" | "quantidade" | "custo_unitario">[] };

  const mesDoPedido = new Map((pedidos ?? []).map((pedido) => [pedido.id, pedido.data.slice(0, 7)]));

  const caixaAntes = (transacoesAnteriores ?? []).reduce(
    (saldo, t) => saldo + sinalCaixa(t.tipo) * Number(t.valor),
    0,
  );

  const buckets = new Map<string, EvolucaoMensal>();
  for (let i = 0; i < meses; i++) {
    const data = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
    const mesISO = data.toISOString().slice(0, 7);
    buckets.set(mesISO, {
      mes: mesLabel(data),
      mesISO,
      vendas: 0,
      compras: 0,
      despesas: 0,
      retiradas: 0,
      investimento: 0,
      custoProdutosVendidos: 0,
      lucroLiquido: 0,
      caixaMes: 0,
      caixaAcumulado: 0,
    });
  }

  for (const t of transacoes ?? []) {
    const bucket = buckets.get(t.data.slice(0, 7));
    if (!bucket) continue;
    const valor = Number(t.valor);
    if (t.tipo === "venda") bucket.vendas += valor;
    else if (t.tipo === "compra") bucket.compras += valor;
    else if (t.tipo === "despesa") bucket.despesas += valor;
    else if (t.tipo === "retirada") bucket.retiradas += valor;
    else if (t.tipo === "investimento") bucket.investimento += valor;
  }

  for (const item of itens ?? []) {
    const mesISO = mesDoPedido.get(item.pedido_id);
    const bucket = mesISO ? buckets.get(mesISO) : undefined;
    if (!bucket) continue;
    bucket.custoProdutosVendidos += item.quantidade * Number(item.custo_unitario);
  }

  let acumulado = caixaAntes;
  const resultado = Array.from(buckets.values());
  for (const bucket of resultado) {
    bucket.lucroLiquido = bucket.vendas - bucket.custoProdutosVendidos - bucket.despesas;
    bucket.caixaMes = bucket.vendas + bucket.investimento - bucket.compras - bucket.despesas - bucket.retiradas;
    acumulado += bucket.caixaMes;
    bucket.caixaAcumulado = acumulado;
  }

  return resultado;
}

export type RetiradasPorSocio = {
  socio: Retirada["socio"];
  total: number;
  historico: Retirada[];
};

/** Total e histórico de retiradas por sócio — NUNCA somados entre si (tela Retiradas). */
export async function getRetiradasPorSocio(supabase: SupabaseServer): Promise<RetiradasPorSocio[]> {
  const { data } = await supabase.from("retiradas").select("*").order("data", { ascending: false }).returns<Retirada[]>();
  const retiradas = data ?? [];

  return (["lucas", "vinicius"] as const).map((socio) => {
    const historico = retiradas.filter((retirada) => retirada.socio === socio);
    const total = historico.reduce((soma, retirada) => soma + Number(retirada.valor), 0);
    return { socio, total, historico };
  });
}

export type ProdutoMaisVendido = {
  produtoId: string;
  nome: string;
  quantidadeVendida: number;
  faturamento: number;
};

/** Ranking de produtos por quantidade vendida (all-time). */
export async function getProdutosMaisVendidos(supabase: SupabaseServer, limite = 5): Promise<ProdutoMaisVendido[]> {
  const [{ data: itens }, { data: produtos }] = await Promise.all([
    supabase.from("pedido_itens").select("produto_id, quantidade, preco_unitario").returns<Pick<PedidoItem, "produto_id" | "quantidade" | "preco_unitario">[]>(),
    supabase.from("produtos").select("id, nome").returns<Pick<Produto, "id" | "nome">[]>(),
  ]);

  const nomePorId = new Map((produtos ?? []).map((produto) => [produto.id, produto.nome]));
  const agregados = new Map<string, { quantidadeVendida: number; faturamento: number }>();

  for (const item of itens ?? []) {
    const atual = agregados.get(item.produto_id) ?? { quantidadeVendida: 0, faturamento: 0 };
    atual.quantidadeVendida += item.quantidade;
    atual.faturamento += item.quantidade * Number(item.preco_unitario);
    agregados.set(item.produto_id, atual);
  }

  return Array.from(agregados.entries())
    .map(([produtoId, valores]) => ({
      produtoId,
      nome: nomePorId.get(produtoId) ?? "Produto removido",
      ...valores,
    }))
    .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
    .slice(0, limite);
}

/** Produtos com estoque atual no mínimo ou abaixo dele. */
export async function getProdutosEstoqueBaixo(supabase: SupabaseServer): Promise<Produto[]> {
  const { data } = await supabase.from("produtos").select("*").order("nome").returns<Produto[]>();
  return (data ?? []).filter((produto) => produto.estoque_atual <= produto.estoque_minimo);
}
