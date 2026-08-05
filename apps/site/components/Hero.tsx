"use client";

import { motion } from "framer-motion";
import { Container, ButtonLink } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { MoleculeGlyph } from "@/components/MoleculeGlyph";
import { Spotlight } from "@/components/Spotlight";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

export function Hero() {
  return (
    <Spotlight className="overflow-hidden">
      <section className="relative pb-24 pt-28 sm:pb-28 sm:pt-36">
        <MoleculeGlyph className="pointer-events-none absolute -right-16 -top-16 h-[28rem] w-[28rem] text-aurum-gold/[0.07] sm:h-[36rem] sm:w-[36rem]" />

        <Container className="relative flex flex-col items-center gap-7 text-center">
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.35em] text-aurum-gold"
          >
            Biotecnologia &amp; Otimização Humana
          </motion.span>

          <motion.h1
            custom={0.12}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl text-balance font-heading text-4xl leading-tight text-aurum-ice sm:text-5xl md:text-6xl"
          >
            Precisão na escolha. <span className="text-aurum-gold">Excelência na origem.</span>
          </motion.h1>

          <motion.p
            custom={0.24}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-2xl text-balance text-base leading-relaxed text-aurum-ice/75 sm:text-lg"
          >
            Ciência aplicada à performance, regeneração e longevidade humana. Produtos
            selecionados sob elevados padrões internacionais de qualidade.
          </motion.p>

          <motion.div
            custom={0.36}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-2 flex flex-col items-center gap-4 sm:flex-row"
          >
            <ButtonLink
              href="https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="secondary"
            >
              Entre no nosso grupo de promoções
            </ButtonLink>
            <ButtonLink
              href={buildWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Fale com um Especialista
            </ButtonLink>
          </motion.div>
        </Container>
      </section>
    </Spotlight>
  );
}
