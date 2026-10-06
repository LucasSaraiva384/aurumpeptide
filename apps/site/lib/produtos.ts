import type {
  Aplicacao,
  Categoria,
  EntidadeRef,
  Marca,
  Produto,
  ProdutoAplicacao,
  ProdutoComRelacoes,
} from "@/lib/types";

function toRef(entidade: { id: string; nome: string; slug: string }): EntidadeRef {
  return { id: entidade.id, nome: entidade.nome, slug: entidade.slug };
}

/**
 * Combina produtos com categoria/marca/aplicações em memória — três queries
 * simples (produtos, categorias/marcas/aplicações ativas, junção
 * produto_aplicacoes) em vez de embedded resources do PostgREST. Catálogo
 * pequeno, então o custo é irrelevante; a vantagem é não depender da
 * detecção automática de relacionamento do Supabase para o build.
 *
 * Produtos com `categoria_id`/`marca_id` nulos (ainda não migrados no
 * admin, ver cabeçalho de supabase/catalogo.sql) ou apontando para uma
 * categoria/marca/aplicação inativa ficam com a referência nula — filtro
 * e busca por ela simplesmente não os encontram, o que é esperado.
 */
export function anexarRelacoes(
  produtos: Produto[],
  categorias: Categoria[],
  marcas: Marca[],
  aplicacoes: Aplicacao[],
  produtoAplicacoes: ProdutoAplicacao[],
): ProdutoComRelacoes[] {
  const categoriaPorId = new Map(categorias.map((c) => [c.id, toRef(c)]));
  const marcaPorId = new Map(marcas.map((m) => [m.id, toRef(m)]));
  const aplicacaoPorId = new Map(aplicacoes.map((a) => [a.id, toRef(a)]));

  const aplicacoesPorProduto = new Map<string, EntidadeRef[]>();
  for (const vinculo of produtoAplicacoes) {
    const aplicacao = aplicacaoPorId.get(vinculo.aplicacao_id);
    if (!aplicacao) continue;
    const lista = aplicacoesPorProduto.get(vinculo.produto_id) ?? [];
    lista.push(aplicacao);
    aplicacoesPorProduto.set(vinculo.produto_id, lista);
  }

  return produtos.map((produto) => ({
    ...produto,
    categoriaRef: (produto.categoria_id && categoriaPorId.get(produto.categoria_id)) || null,
    marcaRef: (produto.marca_id && marcaPorId.get(produto.marca_id)) || null,
    aplicacoesRef: aplicacoesPorProduto.get(produto.id) ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Variantes (supabase/variantes.sql)
// ---------------------------------------------------------------------------

type CamposVariante = { grupo_variante: string | null; variante_rotulo: string | null };
type ResultadoSelect<T> = { data: T[] | null; error: { code?: string; message: string } | null };

/** Trecho a concatenar no fim da string de `select(...)` de produtos. */
const COLUNAS_VARIANTE = ", grupo_variante, variante_rotulo";

/**
 * Executa um select de `produtos` incluindo as colunas de variante. Se a
 * migração supabase/variantes.sql ainda não foi aplicada, o PostgREST
 * responde com erro 42703 (coluna inexistente) — nesse caso repete a mesma
 * consulta sem as colunas novas e devolve os produtos com
 * grupo_variante/variante_rotulo nulos, ou seja, exatamente o comportamento
 * de antes das variantes existirem. Qualquer outro erro é devolvido intacto.
 *
 * `consultar` recebe o trecho de colunas extras (", grupo_variante, …" ou
 * "") e deve devolver a query pronta (o builder do supabase-js é thenable).
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

/** Ordena rótulos de variante de forma numérica ("120mg" antes de "160mg", "5mg" antes de "10mg"). */
export function compararRotulos(a: string | null, b: string | null): number {
  return (a ?? "").localeCompare(b ?? "", "pt-BR", { numeric: true, sensitivity: "base" });
}

/** Variantes do mesmo grupo de `produto` (inclui ele mesmo), ordenadas por rótulo. Vazio se não tiver grupo. */
export function variantesDoGrupo<T extends Produto>(produto: Produto, todos: T[]): T[] {
  if (!produto.grupo_variante) return [];
  return todos
    .filter((item) => item.grupo_variante === produto.grupo_variante)
    .sort((a, b) => compararRotulos(a.variante_rotulo, b.variante_rotulo) || a.id.localeCompare(b.id));
}

/**
 * Colapsa variantes do mesmo `grupo_variante` num único card: dentre as
 * variantes presentes em `produtos`, mantém a de menor preço (desempate pelo
 * rótulo e depois pelo id — determinístico), na posição em que o grupo
 * aparece pela primeira vez. `todos` (padrão: `produtos`) é a lista
 * completa usada para montar `variantesRotulos` — assim o card mostra todas
 * as dosagens do grupo mesmo quando um filtro deixou só uma delas visível.
 * Produtos sem grupo passam intactos.
 */
export function agruparVariantes<T extends Produto>(
  produtos: T[],
  todos: Produto[] = produtos,
): Array<T & { variantesRotulos?: string[] }> {
  const rotulosPorGrupo = new Map<string, string[]>();
  for (const produto of todos) {
    if (!produto.grupo_variante || !produto.variante_rotulo) continue;
    const lista = rotulosPorGrupo.get(produto.grupo_variante) ?? [];
    if (!lista.includes(produto.variante_rotulo)) lista.push(produto.variante_rotulo);
    rotulosPorGrupo.set(produto.grupo_variante, lista);
  }
  for (const lista of rotulosPorGrupo.values()) lista.sort(compararRotulos);

  const representantePorGrupo = new Map<string, T>();
  for (const produto of produtos) {
    if (!produto.grupo_variante) continue;
    const atual = representantePorGrupo.get(produto.grupo_variante);
    const melhor =
      !atual ||
      produto.preco < atual.preco ||
      (produto.preco === atual.preco &&
        (compararRotulos(produto.variante_rotulo, atual.variante_rotulo) ||
          produto.id.localeCompare(atual.id)) < 0);
    if (melhor) representantePorGrupo.set(produto.grupo_variante, produto);
  }

  const resultado: Array<T & { variantesRotulos?: string[] }> = [];
  const gruposEmitidos = new Set<string>();
  for (const produto of produtos) {
    const grupo = produto.grupo_variante;
    if (!grupo) {
      resultado.push(produto);
      continue;
    }
    if (gruposEmitidos.has(grupo)) continue;
    gruposEmitidos.add(grupo);
    const representante = representantePorGrupo.get(grupo) ?? produto;
    const rotulos = rotulosPorGrupo.get(grupo) ?? [];
    resultado.push(rotulos.length > 1 ? { ...representante, variantesRotulos: rotulos } : representante);
  }
  return resultado;
}
