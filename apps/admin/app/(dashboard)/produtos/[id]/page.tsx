import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProdutoForm } from "@/components/ProdutoForm";
import type { Aplicacao, Categoria, Marca, Produto, ProdutoAplicacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [
    { data: produto },
    { data: categorias },
    { data: marcas },
    { data: aplicacoes },
    { data: produtoAplicacoes },
  ] = await Promise.all([
    supabase.from("produtos").select("*").eq("id", id).maybeSingle().returns<Produto>(),
    supabase.from("categorias").select("*").eq("ativo", true).order("ordem").returns<Categoria[]>(),
    supabase.from("marcas").select("*").eq("ativo", true).order("ordem").returns<Marca[]>(),
    supabase.from("aplicacoes").select("*").eq("ativo", true).order("ordem").returns<Aplicacao[]>(),
    supabase.from("produto_aplicacoes").select("*").eq("produto_id", id).returns<ProdutoAplicacao[]>(),
  ]);

  if (!produto) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar produto</h2>
      <ProdutoForm
        produto={produto}
        categorias={categorias ?? []}
        marcas={marcas ?? []}
        aplicacoes={aplicacoes ?? []}
        aplicacaoIdsIniciais={(produtoAplicacoes ?? []).map((item) => item.aplicacao_id)}
      />
    </div>
  );
}
