import type { Produto } from "@/lib/types";

const SEM_CATEGORIA = "Outros produtos";

/**
 * Agrupa por valor distinto da coluna `categoria` (dado real do banco, sem
 * forçar a taxonomia de linhas de negócio documentada em docs/marca.md —
 * ver briefing). Produtos sem categoria caem em "Outros produtos", sempre
 * ao final; os demais grupos ficam em ordem alfabética (pt-BR).
 */
export function groupByCategoria(produtos: Produto[]): Array<[string, Produto[]]> {
  const grupos = new Map<string, Produto[]>();

  for (const produto of produtos) {
    const chave = produto.categoria?.trim() || SEM_CATEGORIA;
    const lista = grupos.get(chave) ?? [];
    lista.push(produto);
    grupos.set(chave, lista);
  }

  return Array.from(grupos.entries()).sort(([a], [b]) => {
    if (a === SEM_CATEGORIA) return 1;
    if (b === SEM_CATEGORIA) return -1;
    return a.localeCompare(b, "pt-BR");
  });
}
