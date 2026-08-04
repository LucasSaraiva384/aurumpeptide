import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Aplicacao, Produto } from "@/lib/types";
import { absoluteUrl, buildAplicacaoMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductGrid";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

// Mesmo esqueleto de app/produtos/[slug]/page.tsx: `cache()` garante que
// generateMetadata e a página compartilham o mesmo round-trip ao Supabase
// dentro da mesma requisição. Diferente do produto (slug computado), o
// slug de aplicação é uma coluna real — resolve direto via `.eq("slug", …)`.
const getAplicacaoComProdutos = cache(
  async (slug: string): Promise<{ aplicacao: Aplicacao | null; produtos: Produto[] }> => {
    if (!isSupabaseConfigured) return { aplicacao: null, produtos: [] };

    const { data: aplicacao } = await supabase
      .from("aplicacoes")
      .select(
        "id, nome, slug, descricao, imagem_url, ordem, ativo, seo_title, seo_description, seo_canonical, seo_og_image, seo_robots",
      )
      .eq("slug", slug)
      .eq("ativo", true)
      .maybeSingle();

    if (!aplicacao) return { aplicacao: null, produtos: [] };

    const { data: vinculos } = await supabase
      .from("produto_aplicacoes")
      .select("produto_id")
      .eq("aplicacao_id", aplicacao.id)
      .returns<Array<{ produto_id: string }>>();

    const produtoIds = (vinculos ?? []).map((vinculo) => vinculo.produto_id);
    if (produtoIds.length === 0) return { aplicacao, produtos: [] };

    const { data: produtos } = await supabase
      .from("produtos")
      .select(
        "id, nome, descricao, preco, categoria, categoria_id, marca_id, keywords, destaque, mais_vendido, lancamento, promocao, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots",
      )
      .in("id", produtoIds)
      .eq("ativo", true)
      .eq("publicado", true)
      .returns<Produto[]>();

    return { aplicacao, produtos: produtos ?? [] };
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { aplicacao } = await getAplicacaoComProdutos(slug);

  if (!aplicacao) return {};

  const meta = buildAplicacaoMetadata(aplicacao);
  const ogImage = aplicacao.seo_og_image?.trim() || aplicacao.imagem_url || undefined;

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

export default async function AplicacaoPage({
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

  const { aplicacao, produtos } = await getAplicacaoComProdutos(slug);

  if (!aplicacao) {
    notFound();
  }

  const meta = buildAplicacaoMetadata(aplicacao);
  const breadcrumbItems = [
    { name: "Início", url: absoluteUrl("/") },
    { name: "Produtos", url: absoluteUrl("/produtos") },
    { name: aplicacao.nome, url: meta.canonical },
  ];

  return (
    <Container className="py-16">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={collectionPageSchema(produtos, meta.canonical)} />

      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">Objetivo</span>
        <h1 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
          {aplicacao.nome}
        </h1>
        {aplicacao.descricao && (
          <p className="max-w-xl text-sm leading-relaxed text-aurum-ice/70">{aplicacao.descricao}</p>
        )}
      </div>

      {produtos.length === 0 ? <EmptyState /> : <ProductGrid produtos={produtos} />}
    </Container>
  );
}
