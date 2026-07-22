import Link from "next/link";
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
import { DespesaForm } from "@/components/DespesaForm";
import type { Transacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DespesasPage() {
  const supabase = await createClient();
  const { data: despesas, error } = await supabase
    .from("transacoes")
    .select("*")
    .eq("tipo", "despesa")
    .order("data", { ascending: false })
    .limit(50)
    .returns<Transacao[]>();

  const totalListado = (despesas ?? []).reduce((soma, despesa) => soma + Number(despesa.valor), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Despesas</h2>
        <Link href="/financeiro" className="text-sm text-aurum-gold hover:underline">
          ← Voltar ao Financeiro
        </Link>
      </div>

      <DespesaForm />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">Despesas recentes</h3>
          <p className="text-sm text-muted-foreground">
            Total listado: <span className="text-foreground">{currencyFormatter.format(totalListado)}</span>
          </p>
        </div>
        {error && <p className="text-sm text-destructive">Erro ao carregar despesas: {error.message}</p>}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(despesas ?? []).map((despesa) => (
                <TableRow key={despesa.id}>
                  <TableCell>{dateFormatter.format(new Date(`${despesa.data}T00:00:00`))}</TableCell>
                  <TableCell className="text-muted-foreground">{despesa.categoria ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{despesa.descricao ?? "—"}</TableCell>
                  <TableCell>{currencyFormatter.format(despesa.valor)}</TableCell>
                </TableRow>
              ))}
              {(despesas ?? []).length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    Nenhuma despesa registrada ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
