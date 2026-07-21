import { Container, Card } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  IconCiencia,
  IconPerformance,
  IconRegeneracao,
  IconLongevidade,
  IconTecnologia,
  IconQualidade,
} from "@/components/PilarIcons";

const PILARES = [
  {
    nome: "Ciência",
    descricao: "Base científica aplicada a cada critério de seleção da nossa curadoria.",
    Icon: IconCiencia,
  },
  {
    nome: "Performance",
    descricao: "Foco em resultados físicos consistentes, sem promessas exageradas.",
    Icon: IconPerformance,
  },
  {
    nome: "Regeneração",
    descricao: "Compromisso com processos que respeitam o funcionamento do corpo.",
    Icon: IconRegeneracao,
  },
  {
    nome: "Longevidade",
    descricao: "Uma visão de longo prazo sobre saúde, performance e qualidade de vida.",
    Icon: IconLongevidade,
  },
  {
    nome: "Tecnologia",
    descricao: "Padrões e processos alinhados ao que há de mais atual no setor.",
    Icon: IconTecnologia,
  },
  {
    nome: "Qualidade Internacional",
    descricao: "Critérios de seleção alinhados aos elevados padrões do mercado global.",
    Icon: IconQualidade,
  },
];

export function Pilares() {
  return (
    <section id="pilares" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Pilares da marca
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            O que sustenta cada decisão da Aurum
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILARES.map(({ nome, descricao, Icon }, index) => (
            <ScrollReveal key={nome} delay={(index % 3) * 0.1}>
              <Card interactive className="group flex h-full flex-col items-center gap-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-aurum-gold/25 text-aurum-gold transition-transform duration-500 group-hover:scale-110 group-hover:border-aurum-gold/50">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="font-heading text-lg text-aurum-ice">{nome}</h3>
                <p className="text-sm leading-relaxed text-aurum-ice/70">{descricao}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
