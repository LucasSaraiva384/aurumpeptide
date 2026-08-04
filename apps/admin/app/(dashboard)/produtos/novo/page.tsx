import { createClient } from "@/lib/supabase/server";
import { ProdutoForm } from "@/components/ProdutoForm";
import type { Aplicacao, Categoria, Marca } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const supabase = await createClient();
  const [{ data: categorias }, { data: marcas }, { data: aplicacoes }] = await Promise.all([
    supabase.from("categorias").select("*").eq("ativo", true).order("ordem").returns<Categoria[]>(),
    supabase.from("marcas").select("*").eq("ativo", true).order("ordem").returns<Marca[]>(),
    supabase.from("aplicacoes").select("*").eq("ativo", true).order("ordem").returns<Aplicacao[]>(),
  ]);

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Novo produto</h2>
      <ProdutoForm categorias={categorias ?? []} marcas={marcas ?? []} aplicacoes={aplicacoes ?? []} />
    </div>
  );
}
