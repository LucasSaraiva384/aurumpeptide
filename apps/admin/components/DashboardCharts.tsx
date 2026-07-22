"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/lib/format";
import type { EvolucaoMensal } from "@/lib/finance";

// Tokens de chart já definidos em app/globals.css (--chart-1..5), mesma
// paleta institucional usada no resto do admin — não é uma escolha nova.
// chart-2/chart-4 (verdes bem escuros) ficam próximos demais do fundo dos
// cards no tema dark único do admin, por isso os traços usam os tons mais
// claros/saturados da mesma paleta (chart-1, chart-3, chart-5).
const OURO = "var(--chart-1)";
const BRONZE = "var(--chart-3)";
const DOURADO_CLARO = "var(--chart-5)";
const DESTRUTIVO = "var(--destructive)";

function compactCurrency(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}: {currencyFormatter.format(item.value)}
        </p>
      ))}
    </div>
  );
}

const eixoComum = {
  stroke: "var(--muted-foreground)",
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  tickLine: false,
  axisLine: false,
};

export function DashboardCharts({ evolucao }: { evolucao: EvolucaoMensal[] }) {
  const financeiro = evolucao.map((mes) => ({
    mes: mes.mes,
    entradas: mes.vendas + mes.investimento,
    saidas: mes.compras + mes.despesas + mes.retiradas,
  }));

  const lucro = evolucao.map((mes) => ({ mes: mes.mes, lucroLiquido: mes.lucroLiquido }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Financeiro — entradas vs. saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={financeiro} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" {...eixoComum} />
              <YAxis {...eixoComum} tickFormatter={compactCurrency} width={64} />
              <Tooltip content={<TooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
              <Line type="monotone" dataKey="entradas" name="Entradas" stroke={OURO} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="saidas" name="Saídas" stroke={BRONZE} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patrimonial — caixa acumulado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={evolucao} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" {...eixoComum} />
              <YAxis {...eixoComum} tickFormatter={compactCurrency} width={64} />
              <Tooltip content={<TooltipContent />} />
              <Line
                type="monotone"
                dataKey="caixaAcumulado"
                name="Caixa acumulado"
                stroke={DOURADO_CLARO}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-muted-foreground">
            Proxy patrimonial: capital em estoque só existe como valor atual (sem histórico de custo médio por
            mês), então esta série reflete a posição de caixa acumulada — ver lib/finance.ts.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lucro líquido mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={lucro} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" {...eixoComum} />
              <YAxis {...eixoComum} tickFormatter={compactCurrency} width={64} />
              <Tooltip content={<TooltipContent />} />
              <Bar dataKey="lucroLiquido" name="Lucro líquido" radius={[4, 4, 0, 0]}>
                {lucro.map((mes) => (
                  <Cell key={mes.mes} fill={mes.lucroLiquido >= 0 ? OURO : DESTRUTIVO} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendas mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={evolucao} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" {...eixoComum} />
              <YAxis {...eixoComum} tickFormatter={compactCurrency} width={64} />
              <Tooltip content={<TooltipContent />} />
              <Bar dataKey="vendas" name="Vendas" fill={OURO} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
