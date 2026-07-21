"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade-in + leve deslocamento vertical ao entrar na viewport — usado em toda
 * seção institucional abaixo da dobra. `once: true` evita reanimar ao rolar
 * para cima/baixo repetidamente (mantém o efeito discreto, não chamativo).
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
