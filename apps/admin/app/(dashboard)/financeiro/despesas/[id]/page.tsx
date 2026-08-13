import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DespesaForm } from "@/components/DespesaForm";
import type { Transacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarDespesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: despesa } = await supabase
    .from("transacoes")
    .select("*")
    .eq("id", id)
    .eq("tipo", "despesa")
    .maybeSingle()
    .returns<Transacao>();

  if (!despesa) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar despesa</h2>
      <DespesaForm despesa={despesa} />
    </div>
  );
}
