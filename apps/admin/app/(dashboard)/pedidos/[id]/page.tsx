import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PedidoForm } from "@/components/PedidoForm";
import type { Pedido, PedidoItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: pedido }, { data: itens }] = await Promise.all([
    supabase.from("pedidos").select("*").eq("id", id).maybeSingle().returns<Pedido>(),
    supabase
      .from("pedido_itens")
      .select("*")
      .eq("pedido_id", id)
      .returns<PedidoItem[]>(),
  ]);

  if (!pedido) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar pedido</h2>
      <PedidoForm pedido={pedido} itensIniciais={itens ?? []} />
    </div>
  );
}
