import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { currencyFormatter } from "@/lib/format";
import {
  getEvolucaoMensal,
  getProdutosEstoqueBaixo,
  getProdutosMaisVendidos,
  getResumoFinanceiro,
} from "@/lib/finance";
import { DashboardCharts } from "@/components/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="text-sm text-aurum-gold">
        Supabase ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
        NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/admin/.env.local.
      </p>
    );
  }

  const supabase = await createClient();
  const [resumo, evolucao, produtosMaisVendidos, produtosEstoqueBaixo] = await Promise.all([
    getResumoFinanceiro(supabase),
    getEvolucaoMensal(supabase, 6),
    getProdutosMaisVendidos(supabase, 5),
    getProdutosEstoqueBaixo(supabase),
  ]);

  const cards = [
    { label: "Caixa disponível", value: resumo.caixaDisponivel },
    { label: "Capital em estoque", value: resumo.capitalEstoque },
    { label: "Patrimônio operacional", value: resumo.patrimonioOperacional },
    { label: "Faturamento total", value: resumo.faturamentoTotal },
    { label: "Lucro líquido", value: resumo.lucroLiquido },
    { label: "Investimento total", value: resumo.investimentoTotal },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-heading text-2xl text-foreground">Visão geral</h2>

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

      <DashboardCharts evolucao={evolucao} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-heading mb-4 text-xl text-foreground">Mais vendidos</h3>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd. vendida</TableHead>
                  <TableHead>Faturamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosMaisVendidos.map((produto) => (
                  <TableRow key={produto.produtoId}>
                    <TableCell className="whitespace-normal font-medium text-foreground">{produto.nome}</TableCell>
                    <TableCell>{produto.quantidadeVendida}</TableCell>
                    <TableCell>{currencyFormatter.format(produto.faturamento)}</TableCell>
                  </TableRow>
                ))}
                {produtosMaisVendidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                      Nenhuma venda registrada ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-xl text-foreground">Estoque baixo</h3>
            <Link href="/estoque" className="text-sm text-aurum-gold hover:underline">
              Ver estoque completo →
            </Link>
          </div>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosEstoqueBaixo.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="whitespace-normal font-medium text-foreground">{produto.nome}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {produto.estoque_atual} / mín. {produto.estoque_minimo}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {produtosEstoqueBaixo.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                      Nenhum produto com estoque baixo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
