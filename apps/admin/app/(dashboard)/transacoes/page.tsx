import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { currencyFormatter, dateFormatter } from "@/lib/format";
import type { Transacao } from "@/lib/types";

export const dynamic = "force-dynamic";

function primeiroDiaDoMes(): string {
  const data = new Date();
  data.setDate(1);
  return data.toISOString().slice(0, 10);
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

const BADGE_VARIANT: Record<Transacao["tipo"], "default" | "secondary" | "destructive" | "outline"> = {
  venda: "default",
  investimento: "secondary",
  compra: "outline",
  despesa: "destructive",
  retirada: "destructive",
};

const LABEL_TIPO: Record<Transacao["tipo"], string> = {
  venda: "Venda",
  compra: "Compra",
  despesa: "Despesa",
  retirada: "Retirada",
  investimento: "Investimento",
};

/** Entra (+1)/sai (-1) do caixa, mesmo critério de lib/finance.ts. */
function sinalCaixa(tipo: Transacao["tipo"]): number {
  if (tipo === "venda" || tipo === "investimento") return 1;
  if (tipo === "compra" || tipo === "despesa" || tipo === "retirada") return -1;
  return 0;
}

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const { de, ate } = await searchParams;
  const dataInicial = de || primeiroDiaDoMes();
  const dataFinal = ate || hoje();

  const supabase = await createClient();
  const [{ data: transacoes, error }, { data: transacoesAteData }] = await Promise.all([
    supabase
      .from("transacoes")
      .select("*")
      .gte("data", dataInicial)
      .lte("data", dataFinal)
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<Transacao[]>(),
    // Todo o histórico até o fim do período: dá o saldo de caixa acumulado
    // (posição de caixa da empresa na data final), não só o saldo do filtro.
    supabase.from("transacoes").select("tipo, valor").lte("data", dataFinal).returns<Pick<Transacao, "tipo" | "valor">[]>(),
  ]);

  const somaPorTipo = (tipo: Transacao["tipo"]) =>
    (transacoes ?? []).filter((t) => t.tipo === tipo).reduce((soma, t) => soma + Number(t.valor), 0);

  const totais = {
    venda: somaPorTipo("venda"),
    compra: somaPorTipo("compra"),
    despesa: somaPorTipo("despesa"),
    retirada: somaPorTipo("retirada"),
    investimento: somaPorTipo("investimento"),
  };

  const saldoCaixaAcumulado = (transacoesAteData ?? []).reduce(
    (saldo, t) => saldo + sinalCaixa(t.tipo) * Number(t.valor),
    0,
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Fluxo de caixa</h2>
        <Link href="/financeiro/despesas">
          <Button variant="outline" size="sm">
            + Nova despesa
          </Button>
        </Link>
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="de">De</Label>
          <Input id="de" type="date" name="de" defaultValue={dataInicial} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ate">Até</Label>
          <Input id="ate" type="date" name="ate" defaultValue={dataFinal} />
        </div>
        <Button type="submit" variant="outline">
          Filtrar
        </Button>
      </form>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Vendas</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(totais.venda)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Compras</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(totais.compra)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(totais.despesa)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Retiradas</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(totais.retirada)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Investimento</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(totais.investimento)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Saldo de caixa acumulado</p>
            <p className="font-heading mt-1 text-lg text-foreground">{currencyFormatter.format(saldoCaixaAcumulado)}</p>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-sm text-destructive">Erro ao carregar transações: {error.message}</p>}

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(transacoes ?? []).map((transacao) => (
              <TableRow key={transacao.id}>
                <TableCell>{dateFormatter.format(new Date(`${transacao.data}T00:00:00`))}</TableCell>
                <TableCell>
                  <Badge variant={BADGE_VARIANT[transacao.tipo]}>{LABEL_TIPO[transacao.tipo]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{transacao.categoria ?? "—"}</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">{transacao.descricao ?? "—"}</TableCell>
                <TableCell>{currencyFormatter.format(transacao.valor)}</TableCell>
              </TableRow>
            ))}
            {(transacoes ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Nenhuma transação no período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
