"use client";

import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

/**
 * Efeito "spotlight" (inspirado em Aceternity UI, recolorido para a paleta
 * Aurum) — glow dourado muito sutil que segue o ponteiro sobre a seção,
 * reforçando a iluminação premium do hero sem nunca ficar chamativo.
 *
 * O listener de ponteiro fica no wrapper (que envolve o conteúdo real, por
 * isso recebe todos os movimentos do mouse mesmo passando sobre botões); o
 * gradiente em si é `pointer-events-none` e renderizado atrás do
 * `children`, então nunca intercepta cliques.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.35);
  const xPct = useTransform(x, (value) => value * 100);
  const yPct = useTransform(y, (value) => value * 100);
  const background = useMotionTemplate`radial-gradient(600px circle at ${xPct}% ${yPct}%, rgba(198,165,90,0.10), transparent 70%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width);
    y.set((event.clientY - bounds.top) / bounds.height);
  }

  return (
    <div onPointerMove={handlePointerMove} className={`relative ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />
      {children}
    </div>
  );
}
