import { Container } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Produto } from "@/lib/types";
import { groupByCategoria } from "@/lib/produtos";
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

async function getProdutosAtivos(): Promise<{ produtos: Produto[]; erro: string | null }> {
  if (!isSupabaseConfigured) {
    return { produtos: [], erro: "config" };
  }

  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, categoria, imagem_url, estoque_atual, ativo")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    return { produtos: [], erro: error.message };
  }

  return { produtos: data ?? [], erro: null };
}

export default async function HomePage() {
  const { produtos, erro } = await getProdutosAtivos();
  const grupos = groupByCategoria(produtos);

  return (
    <>
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
