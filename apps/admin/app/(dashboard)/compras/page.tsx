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
import { CompraForm } from "@/components/CompraForm";
import type { Compra, Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ComprasPage() {
  const supabase = await createClient();
  const [{ data: compras, error }, { data: produtos }] = await Promise.all([
    supabase
      .from("compras")
      .select("*")
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<Compra[]>(),
    supabase.from("produtos").select("id, nome").returns<Pick<Produto, "id" | "nome">[]>(),
  ]);

  // Join feito em JS (mesmo padrão de pedidos/page.tsx) para manter o tipo
  // do resultado simples sem declarar o grafo de foreign keys no Database.
  const nomeProdutoPorId = new Map((produtos ?? []).map((produto) => [produto.id, produto.nome]));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading mb-6 text-2xl text-foreground">Registrar compra</h2>
        <CompraForm />
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Compras recentes</h3>
        {error && <p className="text-sm text-destructive">Erro ao carregar compras: {error.message}</p>}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Custo unitário</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(compras ?? []).map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>{dateFormatter.format(new Date(`${compra.data}T00:00:00`))}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {nomeProdutoPorId.get(compra.produto_id) ?? "—"}
                  </TableCell>
                  <TableCell>{compra.quantidade}</TableCell>
                  <TableCell>{currencyFormatter.format(compra.custo_unitario)}</TableCell>
                  <TableCell>{currencyFormatter.format(compra.valor_total)}</TableCell>
                </TableRow>
              ))}
              {(compras ?? []).length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Nenhuma compra registrada ainda.
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
