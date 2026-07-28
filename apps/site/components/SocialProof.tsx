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

        <div className="flex justify-center">
          <ScrollReveal className="w-full max-w-md">
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
        </div>
      </Container>
    </section>
  );
}
