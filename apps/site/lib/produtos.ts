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
