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

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const { de, ate } = await searchParams;
  const dataInicial = de || primeiroDiaDoMes();
  const dataFinal = ate || hoje();

  const supabase = await createClient();
  const { data: transacoes, error } = await supabase
    .from("transacoes")
    .select("*")
    .gte("data", dataInicial)
    .lte("data", dataFinal)
    .order("data", { ascending: false })
    .returns<Transacao[]>();

  const receita = (transacoes ?? [])
    .filter((t) => t.tipo === "receita")
    .reduce((soma, t) => soma + Number(t.valor), 0);
  const despesa = (transacoes ?? [])
    .filter((t) => t.tipo === "despesa")
    .reduce((soma, t) => soma + Number(t.valor), 0);

  return (
    <div>
      <h2 className="font-heading mb-6 text-2xl text-foreground">Fluxo de caixa</h2>

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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Receita no período</p>
            <p className="font-heading mt-1 text-xl text-foreground">{currencyFormatter.format(receita)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Despesa no período</p>
            <p className="font-heading mt-1 text-xl text-foreground">{currencyFormatter.format(despesa)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Saldo</p>
            <p className="font-heading mt-1 text-xl text-foreground">
              {currencyFormatter.format(receita - despesa)}
            </p>
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
                  <Badge variant={transacao.tipo === "receita" ? "default" : "destructive"}>
                    {transacao.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{transacao.categoria ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{transacao.descricao ?? "—"}</TableCell>
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
