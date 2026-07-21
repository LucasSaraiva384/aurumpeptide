import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { currencyFormatter } from "@/lib/format";
import type { Transacao } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getResumoMes() {
  const supabase = await createClient();

  const inicioMes = new Date();
  inicioMes.setDate(1);
  const inicioMesISO = inicioMes.toISOString().slice(0, 10);

  const [{ count: totalProdutos }, { count: totalClientes }, { data: transacoesMes }] =
    await Promise.all([
      supabase.from("produtos").select("*", { count: "exact", head: true }).eq("ativo", true),
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase
        .from("transacoes")
        .select("tipo, valor")
        .gte("data", inicioMesISO)
        .returns<Pick<Transacao, "tipo" | "valor">[]>(),
    ]);

  const receitaMes = (transacoesMes ?? [])
    .filter((t) => t.tipo === "receita")
    .reduce((soma, t) => soma + Number(t.valor), 0);
  const despesaMes = (transacoesMes ?? [])
    .filter((t) => t.tipo === "despesa")
    .reduce((soma, t) => soma + Number(t.valor), 0);

  return {
    totalProdutos: totalProdutos ?? 0,
    totalClientes: totalClientes ?? 0,
    receitaMes,
    despesaMes,
  };
}

export default async function DashboardHomePage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="text-sm text-aurum-gold">
        Supabase ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
        NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/admin/.env.local.
      </p>
    );
  }

  const resumo = await getResumoMes();

  const cards = [
    { label: "Produtos ativos", value: resumo.totalProdutos },
    { label: "Clientes cadastrados", value: resumo.totalClientes },
    { label: "Receita do mês", value: currencyFormatter.format(resumo.receitaMes) },
    { label: "Despesa do mês", value: currencyFormatter.format(resumo.despesaMes) },
  ];

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Visão geral</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="font-heading mt-2 text-2xl text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
