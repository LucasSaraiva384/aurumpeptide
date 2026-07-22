import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { currencyFormatter } from "@/lib/format";
import { getResumoFinanceiro } from "@/lib/finance";

export const dynamic = "force-dynamic";

const SUBMODULOS = [
  { href: "/financeiro/despesas", titulo: "Despesas", descricao: "Registrar despesas do negócio" },
  { href: "/financeiro/retiradas", titulo: "Retiradas", descricao: "Retiradas de caixa por sócio" },
  { href: "/compras", titulo: "Compras", descricao: "Entradas de estoque e custo" },
  { href: "/transacoes", titulo: "Fluxo de caixa", descricao: "Ledger completo, todos os tipos" },
];

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const resumo = await getResumoFinanceiro(supabase);

  const cards = [
    { label: "Caixa disponível", value: resumo.caixaDisponivel },
    { label: "Capital em estoque", value: resumo.capitalEstoque },
    { label: "Patrimônio operacional", value: resumo.patrimonioOperacional },
    { label: "Investimento total", value: resumo.investimentoTotal },
    { label: "Faturamento total", value: resumo.faturamentoTotal },
    { label: "Lucro líquido", value: resumo.lucroLiquido },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-heading text-2xl text-foreground">Financeiro</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="font-heading mt-2 text-2xl text-foreground">{currencyFormatter.format(card.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Módulos</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBMODULOS.map((modulo) => (
            <Link key={modulo.href} href={modulo.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent>
                  <p className="font-heading text-foreground">{modulo.titulo}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{modulo.descricao}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
