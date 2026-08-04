/**
 * Minúsculas, sem acento (via NFD) — usado para comparar termos de busca de
 * forma tolerante a acentuação (ex.: "recuperacao" encontra "Recuperação").
 * Mesma ideia de normalização de `slugify` (lib/seo.ts), sem o passo de
 * troca de não-alfanuméricos por hífen. `\p{Diacritic}` (Unicode property
 * escape, precisa da flag `u`) evita qualquer ambiguidade de caracteres de
 * combinação digitados literalmente na regex.
 */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Item de produto no índice leve retornado por /api/busca. */
export type BuscaProdutoItem = {
  id: string;
  nome: string;
  slug: string;
  categoria: string | null;
  marca: string | null;
  aplicacoes: string[];
  keywords: string[];
  descricao: string | null;
  imagem: string | null;
  preco: number;
  mais_vendido: boolean;
  destaque: boolean;
};

export type BuscaEntidadeItem = { nome: string; slug: string };

/** Corpo de resposta de GET /api/busca — índice único consumido pelo SearchBox. */
export type BuscaIndice = {
  produtos: BuscaProdutoItem[];
  categorias: BuscaEntidadeItem[];
  marcas: BuscaEntidadeItem[];
  aplicacoes: BuscaEntidadeItem[];
};
