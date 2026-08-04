import Link from "next/link";
import { Container, Card } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Aplicacao } from "@/lib/types";

/** Nova seção da Home: cards por objetivo/aplicação ativa, cada um linkando
 * para o catálogo já filtrado (`/produtos?aplicacao=<slug>`). Só renderiza
 * quando há pelo menos uma aplicação ativa. */
export function ExploreObjetivos({ aplicacoes }: { aplicacoes: Aplicacao[] }) {
  if (aplicacoes.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Explore por objetivo
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Encontre o peptídeo certo para o seu objetivo
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {aplicacoes.map((aplicacao, index) => (
            <ScrollReveal key={aplicacao.id} delay={(index % 4) * 0.08}>
              <Link href={`/produtos?aplicacao=${aplicacao.slug}`} className="block h-full">
                <Card
                  interactive
                  className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center"
                >
                  <h3 className="font-heading text-base text-aurum-ice">{aplicacao.nome}</h3>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
