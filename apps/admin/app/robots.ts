import type { MetadataRoute } from "next";

// Painel interno — nunca deve ser indexado. Defesa em profundidade além do
// `metadata.robots` em app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
