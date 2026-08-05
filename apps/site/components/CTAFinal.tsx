import { Container, ButtonLink } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WhatsappButtonLink } from "@/components/WhatsappButtonLink";

export function CTAFinal() {
  return (
    <section className="border-t border-aurum-gold/10 py-24 sm:py-32">
      <Container className="flex flex-col items-center gap-8 text-center">
        <ScrollReveal className="flex flex-col items-center gap-6">
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            A excelência nunca é acidental.
          </h2>
          <p className="max-w-2xl text-balance leading-relaxed text-aurum-ice/75">
            Quando ciência, precisão e qualidade caminham juntas, o resultado é uma nova
            experiência em otimização biológica.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12} className="flex flex-col items-center gap-4 sm:flex-row">
          <WhatsappButtonLink
            origem="cta-final"
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            Falar com um Especialista
          </WhatsappButtonLink>
          <ButtonLink
            href="https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb"
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="secondary"
          >
            Entre no nosso grupo de promoções
          </ButtonLink>
        </ScrollReveal>
      </Container>
    </section>
  );
}
