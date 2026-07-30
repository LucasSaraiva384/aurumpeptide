import type { Produto } from "@/lib/types";

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

function parseRobots(valor: string | null | undefined): { index: boolean; follow: boolean } {
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
