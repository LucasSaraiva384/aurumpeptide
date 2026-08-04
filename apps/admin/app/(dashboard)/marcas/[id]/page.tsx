import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarcaForm } from "@/components/MarcaForm";
import type { Marca } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarMarcaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: marca } = await supabase
    .from("marcas")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .returns<Marca>();

  if (!marca) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar marca</h2>
      <MarcaForm marca={marca} />
    </div>
  );
}
