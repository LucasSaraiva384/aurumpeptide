/**
 * Design tokens — Aurum Peptide.
 *
 * Fonte de verdade: docs/identidade-visual.md.
 *
 * `greenDeep` e `gold` têm hex confirmado no documento. As demais cores
 * nomeadas (`greenEmerald`, `iceWhite`, `graphite`) NÃO têm hex formalizado
 * ainda (ver seção "Pendências" do documento) — os valores abaixo são
 * aproximações razoáveis para viabilizar o desenvolvimento e devem ser
 * revisados/substituídos assim que o manual de marca formalizar os hex
 * exatos.
 */
export const colors = {
  greenDeep: "#0D1B16",
  greenEmerald: "#0F2E25",
  gold: "#C6A55A",
  iceWhite: "#F4F2ED",
  graphite: "#2B2B2B",
} as const;

/**
 * O documento de identidade visual descreve o *estilo* tipográfico
 * (serif elegante para títulos, sans-serif limpa para texto) sem apontar
 * famílias específicas. Usamos stacks genéricas aqui de propósito — a
 * escolha de uma webfont concreta é decisão pendente do Designer Manager.
 */
export const typography = {
  heading: '"Iowan Old Style", "Palatino Linotype", Georgia, ui-serif, serif',
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ui-sans-serif, sans-serif',
} as const;

export const radii = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
} as const;
