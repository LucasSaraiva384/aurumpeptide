// Ícones geométricos minimalistas, desenhados à mão para os 6 pilares —
// stroke fino em currentColor (dourado via classe do pai), sem biblioteca
// de ícones genérica, para manter alinhamento total com a identidade visual.
import type { SVGProps } from "react";

const shared: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconCiencia(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <path d="M13 4h6" />
      <path d="M14 4v7.5L7.5 24a2 2 0 0 0 1.8 3h13.4a2 2 0 0 0 1.8-3L18 11.5V4" />
      <path d="M10.5 19h11" />
    </svg>
  );
}

export function IconPerformance(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <path d="M5 22 12 13l5 5 10-12" />
      <path d="M22 6h5v5" />
    </svg>
  );
}

export function IconRegeneracao(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <path d="M6 16a10 10 0 0 1 17-7" />
      <path d="M26 16a10 10 0 0 1-17 7" />
      <path d="M23 5v4h-4" />
      <path d="M9 27v-4h4" />
    </svg>
  );
}

export function IconLongevidade(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9v7l5 3" />
    </svg>
  );
}

export function IconTecnologia(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <rect x="9" y="9" width="14" height="14" rx="1.5" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M8 8l2 2M22 8l-2 2M8 24l2-2M22 24l-2-2" />
    </svg>
  );
}

export function IconQualidade(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <path d="M16 4 25 8v8c0 6-4 9.5-9 12-5-2.5-9-6-9-12V8Z" />
      <path d="M12 16l3 3 5-6" />
    </svg>
  );
}
