// Variantes de produto (supabase/variantes.sql) no painel admin.
//
// Cada variante (ex.: Retagen 120mg / 160mg) é uma linha própria em
// `produtos` — escolher a variante num seletor de produto é simplesmente
// escolher o produto_id daquela linha, então compras/pedidos e os triggers
// de estoque/custo médio/transações continuam exatamente iguais. Este
// arquivo só cuida de (1) buscar as colunas novas sem quebrar antes da
// migração ser aplicada e (2) exibir/ordenar as opções de forma explícita.

type CamposVariante = { grupo_variante?: string | null; variante_rotulo?: string | null };
type ResultadoSelect<T> = { data: T[] | null; error: { code?: string; message: string } | null };

/** Trecho a concatenar no fim da string de `select(...)` de produtos. */
const COLUNAS_VARIANTE = ", grupo_variante, variante_rotulo";

/**
 * Executa um select de `produtos` incluindo as colunas de variante; se a
 * migração ainda não foi aplicada (PostgREST devolve 42703, coluna
 * inexistente), repete sem elas e devolve os produtos sem variante — mesmo
 * comportamento de antes. Outros erros são devolvidos intactos.
 */
export async function selectProdutosComVariantes<T extends CamposVariante>(
  consultar: (colunasVariante: string) => PromiseLike<ResultadoSelect<T>>,
): Promise<ResultadoSelect<T>> {
  const comVariantes = await consultar(COLUNAS_VARIANTE);
  if (!comVariantes.error || comVariantes.error.code !== "42703") return comVariantes;

  const semVariantes = await consultar("");
  if (semVariantes.error) return semVariantes;
  return {
    data: (semVariantes.data ?? []).map((produto) => ({ ...produto, grupo_variante: null, variante_rotulo: null })),
    error: null,
  };
}

function compararRotulos(a: string | null | undefined, b: string | null | undefined): number {
  return (a ?? "").localeCompare(b ?? "", "pt-BR", { numeric: true, sensitivity: "base" });
}

/** Nome sem o rótulo da variante no fim ("… Retatrutida 120mg" → "… Retatrutida"). */
export function nomeBaseVariante(produto: { nome: string } & CamposVariante): string {
  const rotulo = produto.variante_rotulo?.trim();
  if (!produto.grupo_variante || !rotulo) return produto.nome;
  return produto.nome.toLowerCase().endsWith(rotulo.toLowerCase())
    ? produto.nome.slice(0, -rotulo.length).trim()
    : produto.nome;
}

/**
 * Texto da opção num seletor de produto: variante aparece como
 * "Nome base — 120mg" (deixa a dosagem explícita); produto comum, só o nome.
 */
export function rotuloOpcaoProduto(produto: { nome: string } & CamposVariante): string {
  const rotulo = produto.variante_rotulo?.trim();
  if (!produto.grupo_variante || !rotulo) return produto.nome;
  return `${nomeBaseVariante(produto)} — ${rotulo}`;
}

/**
 * Ordena opções de produto por nome exibido, mantendo as variantes de um
 * mesmo grupo juntas e em ordem numérica (120mg antes de 160mg).
 */
export function ordenarOpcoesProduto<T extends { id: string; nome: string } & CamposVariante>(produtos: T[]): T[] {
  return [...produtos].sort(
    (a, b) =>
      nomeBaseVariante(a).localeCompare(nomeBaseVariante(b), "pt-BR", { sensitivity: "base" }) ||
      (a.grupo_variante ?? "").localeCompare(b.grupo_variante ?? "") ||
      compararRotulos(a.variante_rotulo, b.variante_rotulo) ||
      a.id.localeCompare(b.id),
  );
}
