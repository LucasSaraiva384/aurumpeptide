import { Container, Divider } from "@aurum/ui";
import { ScrollReveal } from "@/components/ScrollReveal";

const PERGUNTAS = [
  {
    pergunta: "O que é a Aurum Peptide?",
    resposta:
      "A Aurum Peptide é uma marca premium especializada em peptídeos, com foco em performance física e emagrecimento/metabolismo, atuando em venda direta ao consumidor final no Brasil.",
  },
  {
    pergunta: "Qual o compromisso da marca?",
    resposta:
      "Seriedade sobre o que é vendido: comunicamos resultados com honestidade, sem promessas de milagre, priorizando a confiança e a qualidade da seleção acima de qualquer urgência de venda.",
  },
  {
    pergunta: "Como funciona o atendimento?",
    resposta:
      "O atendimento é pessoal e direto, feito pela própria equipe da Aurum Peptide pelo WhatsApp — não se trata de uma clínica nem de acompanhamento médico.",
  },
  {
    pergunta: "Como falar com um especialista?",
    resposta:
      "Basta usar o botão de WhatsApp em qualquer ponto desta página. Nossa equipe responde diretamente para tirar dúvidas e apresentar o catálogo.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">
            Perguntas frequentes
          </span>
          <h2 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
            Dúvidas mais comuns sobre a Aurum
          </h2>
        </ScrollReveal>

        <ScrollReveal className="mx-auto flex w-full max-w-3xl flex-col">
          {PERGUNTAS.map((item, index) => (
            <div key={item.pergunta}>
              {index > 0 && <Divider />}
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg text-aurum-ice marker:content-none">
                  {item.pergunta}
                  <span
                    aria-hidden
                    className="shrink-0 text-aurum-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-aurum-ice/70">{item.resposta}</p>
              </details>
            </div>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
