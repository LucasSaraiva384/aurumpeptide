import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompraForm } from "@/components/CompraForm";
import type { Compra } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarCompraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: compra } = await supabase
    .from("compras")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .returns<Compra>();

  if (!compra) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar compra</h2>
      <CompraForm compra={compra} />
    </div>
  );
}
