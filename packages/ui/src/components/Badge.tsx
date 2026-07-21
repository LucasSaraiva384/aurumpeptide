import type { HTMLAttributes } from "react";

/** Rótulo pequeno em maiúsculas, uso editorial (categoria, eyebrow de seção). */
export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-aurum-gold/30 bg-aurum-gold/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-aurum-gold ${className}`}
      {...props}
    />
  );
}
