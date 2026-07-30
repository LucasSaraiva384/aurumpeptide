import type { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { absoluteUrl, buildProductSlug } from "@/lib/seo";

// Query enxuta, só o necessário para montar a URL + lastModified de cada
// produto — não reaproveita o tipo `Produto` completo do catálogo.
type ProdutoSitemap = { id: string; nome: string; seo_slug: string | null; updated_at: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entradas: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (!isSupabaseConfigured) {
    return entradas;
  }

  const { data } = await supabase
    .from("produtos")
    .select("id, nome, seo_slug, updated_at")
    .eq("ativo", true)
    .eq("publicado", true)
    .returns<ProdutoSitemap[]>();

  for (const produto of data ?? []) {
    entradas.push({
      url: absoluteUrl(`/produtos/${buildProductSlug(produto)}`),
      lastModified: new Date(produto.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entradas;
}
