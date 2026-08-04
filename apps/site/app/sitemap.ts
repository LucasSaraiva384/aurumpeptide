import type { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { absoluteUrl, buildProductSlug } from "@/lib/seo";

// Query enxuta, só o necessário para montar a URL + lastModified de cada
// produto — não reaproveita o tipo `Produto` completo do catálogo.
type ProdutoSitemap = { id: string; nome: string; seo_slug: string | null; updated_at: string };
type AplicacaoSitemap = { slug: string; updated_at: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entradas: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Combinações de filtro (`?categoria=`, `?marca=`, etc.) ficam fora do
    // sitemap de propósito — não são páginas indexáveis por si (ver regra
    // de canonical/robots em lib/seo.ts::buildCatalogoMetadata).
    {
      url: absoluteUrl("/produtos"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (!isSupabaseConfigured) {
    return entradas;
  }

  const [{ data: produtos }, { data: aplicacoes }] = await Promise.all([
    supabase
      .from("produtos")
      .select("id, nome, seo_slug, updated_at")
      .eq("ativo", true)
      .eq("publicado", true)
      .returns<ProdutoSitemap[]>(),
    supabase.from("aplicacoes").select("slug, updated_at").eq("ativo", true).returns<AplicacaoSitemap[]>(),
  ]);

  for (const produto of produtos ?? []) {
    entradas.push({
      url: absoluteUrl(`/produtos/${buildProductSlug(produto)}`),
      lastModified: new Date(produto.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const aplicacao of aplicacoes ?? []) {
    entradas.push({
      url: absoluteUrl(`/aplicacoes/${aplicacao.slug}`),
      lastModified: new Date(aplicacao.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entradas;
}
