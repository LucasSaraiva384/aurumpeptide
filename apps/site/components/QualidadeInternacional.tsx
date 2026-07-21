import { Container, Divider } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";

const CRITERIOS = [
  {
    titulo: "Seleção criteriosa",
    texto: "Cada produto que compõe o catálogo passa por uma triagem orientada por critérios rigorosos, não pela quantidade de opções disponíveis.",
  },
  {
    titulo: "Rigor na origem",
    texto: "A procedência é tratada como parte inegociável da qualidade — um princípio, não um detalhe secundário.",
  },
  {
    titulo: "Padrões internacionais",
    texto: "A curadoria da Aurum busca se alinhar aos elevados padrões observados em mercados internacionais de referência.",
  },
];

export function QualidadeInternacional() {
  return (
    <section id="qualidade" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Qualidade Internacional
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Rigor na origem. Consistência na entrega.
          </h2>
          <p className="max-w-2xl text-balance leading-relaxed text-aurum-ice/75">
            A confiança começa antes do produto chegar ao cliente. Por isso, a seleção da
            Aurum Peptide segue processos de qualidade pensados para sustentar, com
            seriedade, o que a marca se propõe a entregar.
          </p>
        </ScrollReveal>

        <Divider className="mx-auto w-24" />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {CRITERIOS.map((criterio, index) => (
            <ScrollReveal key={criterio.titulo} delay={index * 0.12} className="text-center sm:text-left">
              <h3 className="font-heading text-lg text-aurum-gold">{criterio.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-aurum-ice/70">{criterio.texto}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
