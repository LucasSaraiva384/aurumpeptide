import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Aplicacao, Categoria, Marca, Produto, ProdutoAplicacao } from "@/lib/types";
import { anexarRelacoes } from "@/lib/produtos";
import { buildProductSlug } from "@/lib/seo";
import type { BuscaIndice } from "@/lib/busca";

// Índice leve consumido por SearchBox (busca instantânea): o componente
// busca este endpoint uma única vez, no primeiro foco do campo, e filtra o
// resultado em memória a cada tecla — sem infra de busca dedicada, catálogo
// pequeno o suficiente para isso. `revalidate = 120` evita bater no Supabase
// a cada requisição sem deixar o índice ficar desatualizado por muito tempo.
export const revalidate = 120;

const INDICE_VAZIO: BuscaIndice = { produtos: [], categorias: [], marcas: [], aplicacoes: [] };

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(INDICE_VAZIO);
  }

  const [produtosRes, categoriasRes, marcasRes, aplicacoesRes, produtoAplicacoesRes] = await Promise.all([
    supabase
      .from("produtos")
      .select(
        "id, nome, descricao, preco, categoria, categoria_id, marca_id, keywords, destaque, mais_vendido, lancamento, promocao, imagem_url, imagens, estoque_atual, ativo, publicado, seo_title, seo_description, seo_slug, seo_canonical, seo_og_image, seo_robots",
      )
      .eq("ativo", true)
      .eq("publicado", true)
      .returns<Produto[]>(),
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
      .select(
        "id, nome, slug, descricao, imagem_url, ordem, ativo, seo_title, seo_description, seo_canonical, seo_og_image, seo_robots",
      )
      .eq("ativo", true)
      .order("ordem")
      .returns<Aplicacao[]>(),
    supabase.from("produto_aplicacoes").select("produto_id, aplicacao_id").returns<ProdutoAplicacao[]>(),
  ]);

  const algumErro =
    produtosRes.error || categoriasRes.error || marcasRes.error || aplicacoesRes.error || produtoAplicacoesRes.error;
  if (algumErro) {
    return NextResponse.json(INDICE_VAZIO);
  }

  const produtos = produtosRes.data ?? [];
  const categorias = categoriasRes.data ?? [];
  const marcas = marcasRes.data ?? [];
  const aplicacoes = aplicacoesRes.data ?? [];
  const produtoAplicacoes = produtoAplicacoesRes.data ?? [];

  const produtosComRelacoes = anexarRelacoes(produtos, categorias, marcas, aplicacoes, produtoAplicacoes);

  const indice: BuscaIndice = {
    produtos: produtosComRelacoes.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      slug: buildProductSlug(produto),
      categoria: produto.categoriaRef?.nome ?? produto.categoria,
      marca: produto.marcaRef?.nome ?? null,
      aplicacoes: produto.aplicacoesRef.map((aplicacao) => aplicacao.nome),
      keywords: produto.keywords,
      descricao: produto.descricao,
      imagem: produto.imagens[0] ?? produto.imagem_url,
      preco: produto.preco,
      mais_vendido: produto.mais_vendido,
      destaque: produto.destaque,
    })),
    categorias: categorias.map((categoria) => ({ nome: categoria.nome, slug: categoria.slug })),
    marcas: marcas.map((marca) => ({ nome: marca.nome, slug: marca.slug })),
    aplicacoes: aplicacoes.map((aplicacao) => ({ nome: aplicacao.nome, slug: aplicacao.slug })),
  };

  return NextResponse.json(indice);
}
