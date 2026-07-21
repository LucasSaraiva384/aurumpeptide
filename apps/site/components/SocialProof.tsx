import { Container, Card, ButtonLink } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";

const INSTAGRAM_URL = "https://www.instagram.com/aurumpeptide/";

export function SocialProof() {
  return (
    <section id="comunidade" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Comunidade Aurum
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Acompanhe de perto o que a Aurum tem a dizer
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ScrollReveal>
            <Card className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-aurum-gold">Instagram</p>
              <p className="max-w-sm text-sm leading-relaxed text-aurum-ice/75">
                Conteúdo, bastidores e novidades da Aurum Peptide, direto no perfil oficial.
              </p>
              <ButtonLink
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                @aurumpeptide
              </ButtonLink>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {/*
              Depoimentos reais ainda não foram fornecidos pelo cliente — em vez
              de fabricar citações fictícias, este bloco assume um estado
              "em breve" explícito até haver conteúdo real para publicar.
            */}
            <Card className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-aurum-gold">Depoimentos</p>
              <p className="max-w-sm text-sm leading-relaxed text-aurum-ice/60">
                Em breve, experiências reais de clientes Aurum Peptide serão apresentadas
                nesta seção.
              </p>
            </Card>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
