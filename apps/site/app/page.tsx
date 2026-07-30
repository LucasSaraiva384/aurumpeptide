import type { Metadata } from "next";
import { Container } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Produto } from "@/lib/types";
import { groupByCategoria } from "@/lib/produtos";
import { absoluteUrl } from "@/lib/seo";
import { collectionPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/Hero";
import { Sobre } from "@/components/Sobre";
import { Pilares } from "@/components/Pilares";
import { ProductCatalog } from "@/components/ProductCatalog";
import { EmptyState } from "@/components/EmptyState";
import { QualidadeInternacional } from "@/components/QualidadeInternacional";
import { ExperienciaPremium } from "@/components/ExperienciaPremium";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { CTAFinal } from "@/components/CTAFinal";
import { ScrollReveal } from "@/components/ScrollReveal";

// Catálogo depende de dados que mudam (estoque, produtos ativos) e do
// Supabase real estar configurado — renderizar sob demanda em vez de
// estático evita tentar buscar dados (ou falhar) durante `next build`.
export const dynamic = "force-dynamic";

const TITLE = "Comprar peptídeos no Brasil | Peptídeos premium importados";
const DESCRIPTION =
  "Catálogo oficial Aurum Peptide: peptídeos premium importados para performance física e emagrecimento/metabolismo, com rigor científico e atendimento pessoal pelo WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/"),
  },
};

async function getProdutosAtivos(): Promise<{ produtos: Produto[]; erro: string | null }> {
  if (!isSupabaseConfigured) {
    return { produtos: [], erro: "config" };
  }

  const { data, error } = await supabase
    .from("produtos")
    .select(
      "id, nome, descricao, preco, categoria, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots",
    )
    .eq("ativo", true)
    .eq("publicado", true)
    .order("nome");

  if (error) {
    return { produtos: [], erro: error.message };
  }

  return { produtos: data ?? [], erro: null };
}

/** Filtra por nome/categoria/descricao — usado pela busca controlada por `?q=`. */
function filtrarProdutos(produtos: Produto[], termo: string): Produto[] {
  const alvo = termo.trim().toLowerCase();
  if (!alvo) return produtos;

  return produtos.filter((produto) => {
    const campos = [produto.nome, produto.categoria, produto.descricao];
    return campos.some((campo) => campo?.toLowerCase().includes(alvo));
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  const { produtos: todosProdutos, erro } = await getProdutosAtivos();
  const produtos = filtrarProdutos(todosProdutos, query);
  const grupos = groupByCategoria(produtos);

  return (
    <>
      <JsonLd data={collectionPageSchema(todosProdutos, absoluteUrl("/"))} />

      <Hero />
      <Sobre />
      <Pilares />

      <section id="catalogo" className="py-24 sm:py-32">
        <Container className="flex flex-col gap-14">
          <ScrollReveal className="flex flex-col items-center gap-4 text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
              Catálogo
            </span>
            <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
              A seleção oficial Aurum Peptide
            </h2>
          </ScrollReveal>

          {!erro && todosProdutos.length > 0 && (
            <form action="/" className="mx-auto flex w-full max-w-md items-center gap-2">
              <label htmlFor="busca-produtos" className="sr-only">
                Buscar por nome ou categoria
              </label>
              <input
                id="busca-produtos"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar por nome ou categoria..."
                className="w-full rounded-full border border-aurum-gold/20 bg-aurum-green-deep/60 px-4 py-2 text-sm text-aurum-ice placeholder:text-aurum-ice/40 backdrop-blur-sm outline-none transition-colors focus:border-aurum-gold/50"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full border border-aurum-gold/30 px-4 py-2 text-xs uppercase tracking-[0.15em] text-aurum-gold transition-colors hover:border-aurum-gold/60"
              >
                Buscar
              </button>
            </form>
          )}

          {erro === "config" && (
            <p className="mx-auto max-w-md text-center text-sm text-aurum-gold">
              Catálogo ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
              NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/site/.env.local.
            </p>
          )}
          {erro && erro !== "config" && (
            <p className="mx-auto max-w-md text-center text-sm text-aurum-gold">
              Não foi possível carregar o catálogo agora. Tente novamente em instantes.
            </p>
          )}
          {!erro && todosProdutos.length === 0 && <EmptyState />}
          {!erro && todosProdutos.length > 0 && produtos.length === 0 && (
            <p className="mx-auto max-w-md text-center text-sm text-aurum-ice/70">
              Nenhum produto encontrado para &ldquo;{query}&rdquo;.
            </p>
          )}
          {!erro && produtos.length > 0 && <ProductCatalog groups={grupos} />}
        </Container>
      </section>

      <QualidadeInternacional />
      <ExperienciaPremium />
      <SocialProof />
      <FAQ />
      <CTAFinal />
    </>
  );
}
