import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AplicacaoForm } from "@/components/AplicacaoForm";
import type { Aplicacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarAplicacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: aplicacao } = await supabase
    .from("aplicacoes")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .returns<Aplicacao>();

  if (!aplicacao) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Editar aplicação</h2>
      <AplicacaoForm aplicacao={aplicacao} />
    </div>
  );
}
