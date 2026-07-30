import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Badge, Container, ButtonLink } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { currencyFormatter } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildProductMetadata, buildProductSlug } from "@/lib/seo";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Catálogo pequeno, sem paginação (mesmo estilo da home): busca todos os
// produtos ativos/publicados de uma vez e resolve o slug em memória —
// `cache()` do React garante que generateMetadata e a página compartilham
// o mesmo round-trip ao Supabase dentro da mesma requisição.
const getProdutosAtivos = cache(async (): Promise<Produto[]> => {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("produtos")
    .select(
      "id, nome, descricao, preco, categoria, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots",
    )
    .eq("ativo", true)
    .eq("publicado", true)
    .returns<Produto[]>();

  if (error) return [];
  return data ?? [];
});

/**
 * Resolve o param da rota contra a lista de produtos: compara
 * `buildProductSlug` de cada um com o slug pedido. Se nenhum bater mas o
 * param for um UUID válido de algum produto (link antigo `/produtos/<id>`),
 * devolve o slug canônico para redirecionar em vez de 404.
 */
async function resolveProduto(
  slugParam: string,
): Promise<{ produto: Produto | null; redirectSlug: string | null }> {
  const produtos = await getProdutosAtivos();

  const produto = produtos.find((item) => buildProductSlug(item) === slugParam);
  if (produto) return { produto, redirectSlug: null };

  if (UUID_RE.test(slugParam)) {
    const porId = produtos.find((item) => item.id === slugParam);
    if (porId) return { produto: null, redirectSlug: buildProductSlug(porId) };
  }

  return { produto: null, redirectSlug: null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { produto, redirectSlug } = await resolveProduto(slug);

  if (!produto || redirectSlug) {
    return {};
  }

  const meta = buildProductMetadata(produto);
  const imagens = produto.imagens.length > 0 ? produto.imagens : produto.imagem_url ? [produto.imagem_url] : [];
  const ogImage = produto.seo_og_image?.trim() || imagens[0];

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: meta.robots,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured) {
    return (
      <Container className="py-16 text-center">
        <p className="text-sm text-aurum-gold">
          Catálogo ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
          NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/site/.env.local.
        </p>
      </Container>
    );
  }

  const { produto, redirectSlug } = await resolveProduto(slug);

  if (redirectSlug) {
    permanentRedirect(`/produtos/${redirectSlug}`);
  }

  if (!produto) {
    notFound();
  }

  const urlCanonica = buildProductMetadata(produto).canonical;
  const breadcrumbItems = [
    { name: "Início", url: absoluteUrl("/") },
    ...(produto.categoria ? [{ name: produto.categoria, url: absoluteUrl("/#catalogo") }] : []),
    { name: produto.nome, url: urlCanonica },
  ];

  return (
    <Container className="py-16">
      <JsonLd data={productSchema(produto, urlCanonica)} />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />

      <Link
        href="/#catalogo"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-aurum-ice/60 transition-colors hover:text-aurum-gold"
      >
        <span aria-hidden>←</span>
        Voltar ao catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery imagens={produto.imagens} imagemLegada={produto.imagem_url} nome={produto.nome} />

        <div className="flex flex-col gap-5">
          {produto.categoria && <Badge className="w-fit">{produto.categoria}</Badge>}
          <h1 className="font-heading text-3xl leading-tight text-aurum-ice sm:text-4xl">
            {produto.nome}
          </h1>
          {produto.descricao && (
            <p className="whitespace-pre-line leading-relaxed text-aurum-ice/80">
              {produto.descricao}
            </p>
          )}
          <p className="font-heading text-2xl text-aurum-gold">
            {currencyFormatter.format(produto.preco)}
          </p>
          <ButtonLink
            href={buildWhatsappLink(produto.nome)}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="mt-2 w-fit"
          >
            Comprar no WhatsApp
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
