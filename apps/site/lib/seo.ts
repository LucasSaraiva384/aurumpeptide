import type { Aplicacao, Produto } from "@/lib/types";

/** Fallback quando NEXT_PUBLIC_SITE_URL não está configurada (dev/preview). */
const DEFAULT_SITE_URL = "https://aurumpeptide.com.br";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

/** Minúsculas, sem acento (via NFD), não-alfanumérico vira hífen, sem hífens duplicados/nas pontas. */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slug canônico do produto: usa `seo_slug` se o admin preencheu, senão
 * gera a partir do nome + um sufixo do id (garante unicidade sem depender
 * de constraint — dois produtos com nomes iguais nunca colidem).
 */
export function buildProductSlug(produto: Pick<Produto, "id" | "nome" | "seo_slug">): string {
  const manual = produto.seo_slug?.trim();
  if (manual) return manual;
  return `${slugify(produto.nome)}-${produto.id.slice(0, 8)}`;
}

/** Monta uma URL absoluta a partir de um path relativo (`/produtos/x` → `https://.../produtos/x`). */
export function absoluteUrl(path: string): string {
  const normalizado = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizado}`;
}

function truncateDescription(texto: string, maxLen = 155): string {
  const limpo = texto.trim().replace(/\s+/g, " ");
  if (limpo.length <= maxLen) return limpo;
  return `${limpo.slice(0, maxLen - 1).trimEnd()}…`;
}

/** Robots padrão quando `seo_robots` não está preenchido: indexável. */
const DEFAULT_ROBOTS = "index,follow";

/** Exportado para reuso por `buildCatalogoMetadata` (robots calculado fora de um registro seo_* de banco). */
export function parseRobots(valor: string | null | undefined): { index: boolean; follow: boolean } {
  const texto = (valor?.trim() || DEFAULT_ROBOTS).toLowerCase();
  return {
    index: !texto.includes("noindex"),
    follow: !texto.includes("nofollow"),
  };
}

/**
 * title/description/canonical/robots de um produto, com fallback
 * automático a partir de nome/descricao/categoria quando os campos
 * `seo_*` não estiverem preenchidos no admin.
 */
export function buildProductMetadata(
  produto: Pick<
    Produto,
    "id" | "nome" | "descricao" | "categoria" | "seo_title" | "seo_description" | "seo_slug" | "seo_canonical" | "seo_robots"
  >,
) {
  const title = produto.seo_title?.trim() || produto.nome;

  const descricaoFallback = produto.descricao?.trim()
    ? produto.descricao
    : produto.categoria
      ? `${produto.nome} — ${produto.categoria} Aurum Peptide. Qualidade premium, atendimento pessoal pelo WhatsApp.`
      : `${produto.nome} — Aurum Peptide. Qualidade premium, atendimento pessoal pelo WhatsApp.`;
  const description = truncateDescription(produto.seo_description?.trim() || descricaoFallback);

  const slug = buildProductSlug(produto);
  const canonical = produto.seo_canonical?.trim() || absoluteUrl(`/produtos/${slug}`);

  const robots = parseRobots(produto.seo_robots);

  return { title, description, canonical, robots, slug };
}

/**
 * title/description/canonical/robots de uma Aplicação (/aplicacoes/[slug]),
 * mesmo formato de `buildProductMetadata`: fallback automático a partir de
 * nome/descrição quando os campos `seo_*` não estiverem preenchidos.
 */
export function buildAplicacaoMetadata(
  aplicacao: Pick<
    Aplicacao,
    "nome" | "descricao" | "slug" | "seo_title" | "seo_description" | "seo_canonical" | "seo_robots"
  >,
) {
  const title = aplicacao.seo_title?.trim() || aplicacao.nome;

  const descricaoFallback = aplicacao.descricao?.trim()
    ? aplicacao.descricao
    : `${aplicacao.nome} — Aurum Peptide. Peptídeos premium importados selecionados para este objetivo, com atendimento pessoal pelo WhatsApp.`;
  const description = truncateDescription(aplicacao.seo_description?.trim() || descricaoFallback);

  const canonical = aplicacao.seo_canonical?.trim() || absoluteUrl(`/aplicacoes/${aplicacao.slug}`);

  const robots = parseRobots(aplicacao.seo_robots);

  return { title, description, canonical, robots };
}

/** Filtros ativos lidos (já normalizados para string única) da URL de `/produtos`. */
export type CatalogoFiltrosAtivos = {
  categoria?: string;
  marca?: string;
  aplicacao?: string;
  precoMin?: string;
  precoMax?: string;
  ordenar?: string;
  disponibilidade?: string;
  q?: string;
};

/**
 * title/description/canonical/robots de `/produtos` conforme os filtros
 * ativos na URL — regra da seção 4 do plano de catálogo (canonical/robots
 * por combinação de filtro):
 *
 *   sem filtro (ou só `categoria`)     -> self,               index,follow
 *   só `aplicacao` (um único slug)     -> /aplicacoes/<slug>,  noindex,follow
 *   qualquer outra combinação          -> /produtos (base),    noindex,follow
 *
 * `categoria` não tem página própria — a própria URL filtrada é indexável.
 * `aplicacao` já tem página dedicada (`/aplicacoes/[slug]`), então a URL
 * filtrada por ela aponta o canonical pra lá em vez de competir por
 * indexação com a página dedicada. title/description sempre refletem os
 * filtros ativos, mesmo sob noindex (a URL ainda pode ser compartilhada).
 */
export function buildCatalogoMetadata({
  categoria,
  marca,
  aplicacao,
  precoMin,
  precoMax,
  ordenar,
  disponibilidade,
  q,
  categoriaNomes,
  aplicacaoNome,
}: CatalogoFiltrosAtivos & {
  /** Nomes das categorias selecionadas (mesmo conjunto do CSV `categoria`), para o title/description. */
  categoriaNomes?: string[];
  /** Nome da aplicação — só usado quando `aplicacao` é o único filtro ativo (caso do canonical dedicado). */
  aplicacaoNome?: string | null;
}) {
  const outroFiltro = Boolean(marca || precoMin || precoMax || ordenar || disponibilidade || q?.trim());
  const aplicacaoUnica = Boolean(aplicacao && !aplicacao.includes(","));

  let canonical: string;
  let robots: { index: boolean; follow: boolean };

  if (!categoria && !aplicacao && !outroFiltro) {
    canonical = absoluteUrl("/produtos");
    robots = { index: true, follow: true };
  } else if (categoria && !aplicacao && !outroFiltro) {
    canonical = absoluteUrl(`/produtos?categoria=${encodeURIComponent(categoria)}`);
    robots = { index: true, follow: true };
  } else if (aplicacao && aplicacaoUnica && !categoria && !outroFiltro) {
    canonical = absoluteUrl(`/aplicacoes/${aplicacao}`);
    robots = { index: false, follow: true };
  } else {
    canonical = absoluteUrl("/produtos");
    robots = { index: false, follow: true };
  }

  const partes: string[] = [];
  if (categoriaNomes?.length) partes.push(categoriaNomes.join(", "));
  if (aplicacaoNome) partes.push(aplicacaoNome);
  if (q?.trim()) partes.push(`"${q.trim()}"`);

  const title =
    partes.length > 0
      ? `${partes.join(" — ")} | Catálogo Aurum Peptide`
      : "Catálogo completo | Peptídeos premium importados";

  const description =
    partes.length > 0
      ? `Produtos Aurum Peptide filtrados por ${partes.join(", ")}. Peptídeos premium importados, rigor científico e atendimento pessoal pelo WhatsApp.`
      : "Explore o catálogo completo Aurum Peptide: filtre por categoria, marca, objetivo, preço e disponibilidade. Peptídeos premium importados, atendimento pessoal pelo WhatsApp.";

  return { title, description: truncateDescription(description), canonical, robots };
}
