import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Ativa hover com leve elevação e glow dourado — opt-in para não alterar
   * o visual dos usos existentes (ex.: apps/admin) que não passam a prop. */
  interactive?: boolean;
}

export function Card({ className = "", interactive = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-aurum-gold/15 bg-aurum-green-deep/60 p-6 shadow-sm backdrop-blur-sm ${
        interactive
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-aurum-gold/40 hover:shadow-[0_0_30px_-10px_rgba(198,165,90,0.35)]"
          : ""
      } ${className}`}
      {...props}
    />
  );
}
