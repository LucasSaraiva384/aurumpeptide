import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { currencyFormatter } from "@/lib/format";
import { getResumoPeriodo } from "@/lib/finance";

export const dynamic = "force-dynamic";

type Preset = "dia" | "semana" | "mes" | "ano";

const PRESETS: { valor: Preset; label: string }[] = [
  { valor: "dia", label: "Diário" },
  { valor: "semana", label: "Semanal" },
  { valor: "mes", label: "Mensal" },
  { valor: "ano", label: "Anual" },
];

function isoDate(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function rangeDoPreset(preset: Preset): { de: string; ate: string } {
  const hoje = new Date();
  const ate = isoDate(hoje);

  if (preset === "dia") return { de: ate, ate };

  if (preset === "semana") {
    const inicio = new Date(hoje);
    inicio.setDate(inicio.getDate() - 6);
    return { de: isoDate(inicio), ate };
  }

  if (preset === "ano") {
    const inicio = new Date(hoje.getFullYear(), 0, 1);
    return { de: isoDate(inicio), ate };
  }

  const inicio = new Date(hoje);
  inicio.setDate(1);
  return { de: isoDate(inicio), ate };
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; de?: string; ate?: string }>;
}) {
  const { periodo, de, ate } = await searchParams;
  const presetAtivo: Preset = (["dia", "semana", "mes", "ano"] as const).includes(periodo as Preset)
    ? (periodo as Preset)
    : "mes";

  const { de: deDefault, ate: ateDefault } = rangeDoPreset(presetAtivo);
  const dataInicial = de || deDefault;
  const dataFinal = ate || ateDefault;

  const supabase = await createClient();
  const resumo = await getResumoPeriodo(supabase, dataInicial, dataFinal);

  const cards = [
    { label: "Vendas", value: resumo.vendas },
    { label: "Compras", value: resumo.compras },
    { label: "Despesas", value: resumo.despesas },
    { label: "Retiradas", value: resumo.retiradas },
    { label: "Investimento", value: resumo.investimento },
    { label: "Custo dos produtos vendidos", value: resumo.custoProdutosVendidos },
    { label: "Lucro líquido", value: resumo.lucroLiquido },
    { label: "Caixa do período", value: resumo.caixaPeriodo },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl text-foreground">Relatórios</h2>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Link key={preset.valor} href={`/relatorios?periodo=${preset.valor}`}>
            <Button variant={presetAtivo === preset.valor && !de && !ate ? "default" : "outline"} size="sm">
              {preset.label}
            </Button>
          </Link>
        ))}
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="periodo" value={presetAtivo} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="de">De</Label>
          <Input id="de" type="date" name="de" defaultValue={dataInicial} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ate">Até</Label>
          <Input id="ate" type="date" name="ate" defaultValue={dataFinal} />
        </div>
        <Button type="submit" variant="outline">
          Filtrar período customizado
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {resumo.pedidosCount} venda(s) no período selecionado.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="font-heading mt-2 text-xl text-foreground">{currencyFormatter.format(card.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
