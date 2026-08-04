import type { Metadata } from "next";
import { Container, ButtonLink } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Aplicacao, Produto } from "@/lib/types";
import { absoluteUrl } from "@/lib/seo";
import { webPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/Hero";
import { Pilares } from "@/components/Pilares";
import { ProductGrid } from "@/components/ProductGrid";
import { ExploreObjetivos } from "@/components/ExploreObjetivos";
import { EmptyState } from "@/components/EmptyState";
import { QualidadeInternacional } from "@/components/QualidadeInternacional";
import { ExperienciaPremium } from "@/components/ExperienciaPremium";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { CTAFinal } from "@/components/CTAFinal";
import { ScrollReveal } from "@/components/ScrollReveal";

// Vitrine depende de dados que mudam (estoque, produtos ativos) e do
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

async function getProdutosVitrine(): Promise<{ produtos: Produto[]; erro: string | null }> {
  if (!isSupabaseConfigured) {
    return { produtos: [], erro: "config" };
  }

  const { data, error } = await supabase
    .from("produtos")
    .select(
      "id, nome, descricao, preco, categoria, categoria_id, marca_id, keywords, destaque, mais_vendido, lancamento, promocao, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots",
    )
    .eq("ativo", true)
    .eq("publicado", true)
    .order("nome")
    .returns<Produto[]>();

  if (error) {
    return { produtos: [], erro: error.message };
  }

  return { produtos: data ?? [], erro: null };
}

async function getAplicacoesAtivas(): Promise<Aplicacao[]> {
  if (!isSupabaseConfigured) return [];

  const { data } = await supabase
    .from("aplicacoes")
    .select(
      "id, nome, slug, descricao, imagem_url, ordem, ativo, seo_title, seo_description, seo_canonical, seo_og_image, seo_robots",
    )
    .eq("ativo", true)
    .order("ordem")
    .returns<Aplicacao[]>();

  return data ?? [];
}

export default async function HomePage() {
  const [{ produtos, erro }, aplicacoes] = await Promise.all([getProdutosVitrine(), getAplicacoesAtivas()]);

  const destaques = produtos.filter((produto) => produto.destaque);
  const maisVendidos = produtos.filter((produto) => produto.mais_vendido);
  const novidades = produtos.filter((produto) => produto.lancamento);
  const promocoes = produtos.filter((produto) => produto.promocao);

  return (
    <>
      <JsonLd data={webPageSchema({ name: TITLE, description: DESCRIPTION, url: absoluteUrl("/") })} />

      <Hero />
      <Pilares />

      <section className="py-24 sm:py-32">
        <Container className="flex flex-col gap-20">
          <ScrollReveal className="flex flex-col items-center gap-4 text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">Catálogo</span>
            <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
              A seleção oficial Aurum Peptide
            </h2>
          </ScrollReveal>

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
          {!erro && produtos.length === 0 && <EmptyState />}

          {!erro && destaques.length > 0 && (
            <VitrineGrupo eyebrow="Seleção" titulo="Destaques Aurum" produtos={destaques} />
          )}
          {!erro && maisVendidos.length > 0 && (
            <VitrineGrupo eyebrow="Preferidos" titulo="Mais vendidos" produtos={maisVendidos} />
          )}
          {!erro && novidades.length > 0 && (
            <VitrineGrupo eyebrow="Chegou agora" titulo="Novidades" produtos={novidades} />
          )}
          {!erro && promocoes.length > 0 && (
            <VitrineGrupo eyebrow="Por tempo limitado" titulo="Promoções" produtos={promocoes} />
          )}

          {!erro && produtos.length > 0 && (
            <div className="flex justify-center">
              <ButtonLink href="/produtos" variant="secondary">
                Ver catálogo completo
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      <ExploreObjetivos aplicacoes={aplicacoes} />

      <QualidadeInternacional />
      <ExperienciaPremium />
      <SocialProof />
      <FAQ />
      <CTAFinal />
    </>
  );
}

/** Uma vitrine da Home (Destaques/Mais vendidos/Novidades/Promoções) — só
 * chamada quando `produtos.length > 0`, então sempre renderiza algo. */
function VitrineGrupo({ eyebrow, titulo, produtos }: { eyebrow: string; titulo: string; produtos: Produto[] }) {
  return (
    <ScrollReveal className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-aurum-gold">{eyebrow}</span>
        <h3 className="font-heading text-2xl text-aurum-ice">{titulo}</h3>
      </div>
      <ProductGrid produtos={produtos} />
    </ScrollReveal>
  );
}
