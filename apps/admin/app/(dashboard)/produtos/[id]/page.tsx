import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProdutoForm } from "@/components/ProdutoForm";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: produto } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .returns<Produto>();

  if (!produto) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar produto</h2>
      <ProdutoForm produto={produto} />
    </div>
  );
}
