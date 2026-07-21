import { Container, Divider } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";

const PRINCIPIOS = [
  "Cada escolha é guiada por critérios rigorosos de qualidade.",
  "Performance e longevidade exigem precisão.",
  "Excelência não é um diferencial. É o nosso ponto de partida.",
];

export function Sobre() {
  return (
    <section id="sobre" className="py-24 sm:py-32">
      <Container className="flex flex-col items-center gap-12 text-center">
        <ScrollReveal className="flex flex-col items-center gap-6">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Sobre a Aurum
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Uma seleção guiada por rigor científico e exclusividade
          </h2>
          <p className="max-w-2xl text-balance leading-relaxed text-aurum-ice/75">
            A Aurum Peptide existe para oferecer, ao mercado brasileiro, uma curadoria de
            peptídeos orientada por critérios internacionais de qualidade — não a
            quantidade de opções, mas a certeza de cada escolha. Cada etapa da nossa
            seleção busca a mesma coisa: a excelência científica que sustenta performance,
            regeneração e longevidade reais.
          </p>
        </ScrollReveal>

        <Divider className="w-24" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PRINCIPIOS.map((frase, index) => (
            <ScrollReveal key={frase} delay={index * 0.12}>
              <p className="font-heading text-lg leading-snug text-aurum-ice/90">
                {frase}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
