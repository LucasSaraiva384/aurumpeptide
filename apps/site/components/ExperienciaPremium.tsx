import { Container } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";

const ETAPAS = ["Seleção", "Qualidade", "Performance", "Excelência", "Inovação", "Evolução contínua"];

export function ExperienciaPremium() {
  return (
    <section id="experiencia" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Experiência Premium
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Uma trajetória, não apenas uma compra
          </h2>
        </ScrollReveal>

        <div className="relative flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div
            aria-hidden
            className="absolute left-[1.15rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-aurum-gold/50 via-aurum-gold/20 to-transparent sm:hidden"
          />
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[0.6rem] hidden bg-gradient-to-r from-transparent via-aurum-gold/40 to-transparent sm:block"
            style={{ height: "1px" }}
          />

          {ETAPAS.map((etapa, index) => (
            <ScrollReveal
              key={etapa}
              delay={index * 0.1}
              className="relative flex flex-1 flex-row items-center gap-4 sm:flex-col sm:items-center sm:gap-4 sm:text-center"
            >
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-aurum-gold/40 bg-aurum-green-deep text-xs text-aurum-gold">
                {index + 1}
              </span>
              <span className="font-heading text-base text-aurum-ice sm:text-lg">{etapa}</span>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
