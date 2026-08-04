import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoriaForm } from "@/components/CategoriaForm";
import type { Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: categoria } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .returns<Categoria>();

  if (!categoria) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar categoria</h2>
      <CategoriaForm categoria={categoria} />
    </div>
  );
}
