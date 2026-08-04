import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Aplicacao, Categoria, Marca, Produto, ProdutoAplicacao, ProdutoComRelacoes } from "@/lib/types";
import { anexarRelacoes } from "@/lib/produtos";
import { normalizarBusca } from "@/lib/busca";
import { absoluteUrl, buildCatalogoMetadata } from "@/lib/seo";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ProdutosFiltros } from "@/components/ProdutosFiltros";
import { ProductGrid } from "@/components/ProductGrid";
import { EmptyState } from "@/components/EmptyState";

// Catálogo depende de dados que mudam (estoque, produtos ativos, filtros na
// URL) — mesmo motivo já documentado na Home: renderiza sob demanda em vez
// de estático.
export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;
type RawSearchParams = {
  categoria?: SearchParamValue;
  marca?: SearchParamValue;
  aplicacao?: SearchParamValue;
  precoMin?: SearchParamValue;
  precoMax?: SearchParamValue;
  ordenar?: SearchParamValue;
  disponibilidade?: SearchParamValue;
  q?: SearchParamValue;
};

type FiltrosNormalizados = {
  categoria?: string;
  marca?: string;
  aplicacao?: string;
  precoMin?: string;
  precoMax?: string;
  ordenar?: string;
  disponibilidade?: string;
  q?: string;
};

/** Cada facet chega como CSV num único param (ex.: `?categoria=a,b`); pega o primeiro valor se o Next entregar array (query repetida) e descarta string vazia. */
function normalizarParam(valor: SearchParamValue): string | undefined {
  const bruto = Array.isArray(valor) ? valor[0] : valor;
  const limpo = bruto?.trim();
  return limpo ? limpo : undefined;
}

function normalizarFiltros(raw: RawSearchParams): FiltrosNormalizados {
  return {
    categoria: normalizarParam(raw.categoria),
    marca: normalizarParam(raw.marca),
    aplicacao: normalizarParam(raw.aplicacao),
    precoMin: normalizarParam(raw.precoMin),
    precoMax: normalizarParam(raw.precoMax),
    ordenar: normalizarParam(raw.ordenar),
    disponibilidade: normalizarParam(raw.disponibilidade),
    q: normalizarParam(raw.q),
  };
}

function csv(valor: string | undefined): string[] {
  return valor ? valor.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

// created_at só é necessário para a ordenação "recentes" — não faz parte de
// `Produto` (lib/types.ts) porque nenhuma outra página do site precisa
// dele, mesmo espírito de `ProdutoSitemap` em app/sitemap.ts.
type ProdutoComData = Produto & { created_at: string };

type CatalogoData = {
  produtos: ProdutoComData[];
  categorias: Categoria[];
  marcas: Marca[];
  aplicacoes: Aplicacao[];
  produtoAplicacoes: ProdutoAplicacao[];
  erro: "config" | "query" | null;
};

// `cache()` garante que generateMetadata e a página compartilham o mesmo
// round-trip ao Supabase dentro da mesma requisição (mesmo padrão de
// app/produtos/[slug]/page.tsx).
const getCatalogo = cache(async (): Promise<CatalogoData> => {
  if (!isSupabaseConfigured) {
    return { produtos: [], categorias: [], marcas: [], aplicacoes: [], produtoAplicacoes: [], erro: "config" };
  }

  const [produtosRes, categoriasRes, marcasRes, aplicacoesRes, produtoAplicacoesRes] = await Promise.all([
    supabase
      .from("produtos")
      .select(
        "id, nome, descricao, preco, categoria, categoria_id, marca_id, keywords, destaque, mais_vendido, lancamento, promocao, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots, created_at",
      )
      .eq("ativo", true)
      .eq("publicado", true)
      .returns<ProdutoComData[]>(),
    supabase
      .from("categorias")
      .select("id, nome, slug, descricao, imagem_url, ordem, ativo")
      .eq("ativo", true)
      .order("ordem")
      .returns<Categoria[]>(),
    supabase
      .from("marcas")
      .select("id, nome, slug, descricao, logo_url, ordem, ativo")
      .eq("ativo", true)
      .order("ordem")
      .returns<Marca[]>(),
    supabase
      .from("aplicacoes")
      .select("id, nome, slug, descricao, imagem_url, ordem, ativo, seo_title, seo_description, seo_canonical, seo_og_image, seo_robots")
      .eq("ativo", true)
      .order("ordem")
      .returns<Aplicacao[]>(),
    supabase.from("produto_aplicacoes").select("produto_id, aplicacao_id").returns<ProdutoAplicacao[]>(),
  ]);

  if (produtosRes.error || categoriasRes.error || marcasRes.error || aplicacoesRes.error || produtoAplicacoesRes.error) {
    return { produtos: [], categorias: [], marcas: [], aplicacoes: [], produtoAplicacoes: [], erro: "query" };
  }

  return {
    produtos: produtosRes.data ?? [],
    categorias: categoriasRes.data ?? [],
    marcas: marcasRes.data ?? [],
    aplicacoes: aplicacoesRes.data ?? [],
    produtoAplicacoes: produtoAplicacoesRes.data ?? [],
    erro: null,
  };
});

function filtrarEOrdenar(
  produtos: ProdutoComRelacoes[],
  filtros: FiltrosNormalizados,
  criadoEmPorId: Map<string, string>,
): ProdutoComRelacoes[] {
  const categorias = csv(filtros.categoria);
  const marcas = csv(filtros.marca);
  const aplicacoes = csv(filtros.aplicacao);
  const precoMin = filtros.precoMin ? Number(filtros.precoMin) : undefined;
  const precoMax = filtros.precoMax ? Number(filtros.precoMax) : undefined;
  const alvoBusca = filtros.q ? normalizarBusca(filtros.q) : "";

  const filtrados = produtos.filter((produto) => {
    if (categorias.length > 0 && (!produto.categoriaRef || !categorias.includes(produto.categoriaRef.slug))) {
      return false;
    }
    if (marcas.length > 0 && (!produto.marcaRef || !marcas.includes(produto.marcaRef.slug))) {
      return false;
    }
    if (aplicacoes.length > 0) {
      const slugsProduto = produto.aplicacoesRef.map((aplicacao) => aplicacao.slug);
      if (!aplicacoes.some((slug) => slugsProduto.includes(slug))) return false;
    }
    if (precoMin !== undefined && !Number.isNaN(precoMin) && produto.preco < precoMin) return false;
    if (precoMax !== undefined && !Number.isNaN(precoMax) && produto.preco > precoMax) return false;
    if (filtros.disponibilidade === "em-estoque" && produto.estoque_atual <= 0) return false;

    if (alvoBusca) {
      const campos = [
        produto.nome,
        produto.categoria,
        produto.categoriaRef?.nome ?? null,
        produto.marcaRef?.nome ?? null,
        produto.descricao,
        ...produto.aplicacoesRef.map((aplicacao) => aplicacao.nome),
        ...produto.keywords,
      ];
      const bate = campos.some((campo) => campo && normalizarBusca(campo).includes(alvoBusca));
      if (!bate) return false;
    }

    return true;
  });

  const ordenados = [...filtrados];
  switch (filtros.ordenar) {
    case "vendidos":
      ordenados.sort((a, b) => Number(b.mais_vendido) - Number(a.mais_vendido));
      break;
    case "menor-preco":
      ordenados.sort((a, b) => a.preco - b.preco);
      break;
    case "maior-preco":
      ordenados.sort((a, b) => b.preco - a.preco);
      break;
    case "alfabetica":
      ordenados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      break;
    case "recentes":
    default:
      ordenados.sort((a, b) => (criadoEmPorId.get(b.id) ?? "").localeCompare(criadoEmPorId.get(a.id) ?? ""));
      break;
  }

  return ordenados;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const filtros = normalizarFiltros(await searchParams);
  const { categorias, aplicacoes } = await getCatalogo();

  const categoriaSlugs = csv(filtros.categoria);
  const categoriaNomes = categorias
    .filter((categoria) => categoriaSlugs.includes(categoria.slug))
    .map((categoria) => categoria.nome);

  const aplicacaoUnica = filtros.aplicacao && !filtros.aplicacao.includes(",") ? filtros.aplicacao : undefined;
  const aplicacaoNome = aplicacaoUnica
    ? aplicacoes.find((aplicacao) => aplicacao.slug === aplicacaoUnica)?.nome ?? null
    : null;

  const meta = buildCatalogoMetadata({ ...filtros, categoriaNomes, aplicacaoNome });

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: meta.robots,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
    },
  };
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filtros = normalizarFiltros(await searchParams);
  const { produtos, categorias, marcas, aplicacoes, produtoAplicacoes, erro } = await getCatalogo();

  const criadoEmPorId = new Map(produtos.map((produto) => [produto.id, produto.created_at]));
  const produtosComRelacoes = anexarRelacoes(produtos, categorias, marcas, aplicacoes, produtoAplicacoes);
  const produtosFiltrados = filtrarEOrdenar(produtosComRelacoes, filtros, criadoEmPorId);

  const categoriaSlugs = csv(filtros.categoria);
  const categoriaNomes = categorias
    .filter((categoria) => categoriaSlugs.includes(categoria.slug))
    .map((categoria) => categoria.nome);
  const aplicacaoUnica = filtros.aplicacao && !filtros.aplicacao.includes(",") ? filtros.aplicacao : undefined;
  const aplicacaoNome = aplicacaoUnica
    ? aplicacoes.find((aplicacao) => aplicacao.slug === aplicacaoUnica)?.nome ?? null
    : null;
  const meta = buildCatalogoMetadata({ ...filtros, categoriaNomes, aplicacaoNome });

  return (
    <Container className="flex flex-col gap-10 py-16">
      <JsonLd data={collectionPageSchema(produtosFiltrados, meta.canonical)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/") },
          { name: "Produtos", url: absoluteUrl("/produtos") },
        ])}
      />

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.35em] text-aurum-gold">Catálogo</span>
        <h1 className="max-w-2xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
          {meta.title.split(" | ")[0] ?? meta.title}
        </h1>
      </div>

      {erro === "config" && (
        <p className="text-sm text-aurum-gold">
          Catálogo ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
          NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/site/.env.local.
        </p>
      )}
      {erro === "query" && (
        <p className="text-sm text-aurum-gold">Não foi possível carregar o catálogo agora. Tente novamente em instantes.</p>
      )}

      {!erro && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr]">
          <Suspense fallback={null}>
            <ProdutosFiltros categorias={categorias} marcas={marcas} aplicacoes={aplicacoes} />
          </Suspense>

          <div className="flex flex-col gap-6">
            <p className="text-sm text-aurum-ice/60">
              {produtosFiltrados.length}{" "}
              {produtosFiltrados.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            {produtosFiltrados.length === 0 ? <EmptyState /> : <ProductGrid produtos={produtosFiltrados} />}
          </div>
        </div>
      )}
    </Container>
  );
}
