import type { MetadataRoute } from "next";

// Cores dos tokens de marca (apps/site/app/globals.css @theme, espelham
// docs/identidade-visual.md via packages/ui/src/tokens.ts).
const COLOR_GREEN_DEEP = "#0d1b16";
const COLOR_GOLD = "#c6a55a";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aurum Peptide",
    short_name: "Aurum Peptide",
    description:
      "Peptídeos selecionados sob elevados padrões internacionais de qualidade, para performance física e emagrecimento/metabolismo.",
    start_url: "/",
    display: "standalone",
    background_color: COLOR_GREEN_DEEP,
    theme_color: COLOR_GOLD,
    icons: [
      {
        src: "/logo-badge.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
