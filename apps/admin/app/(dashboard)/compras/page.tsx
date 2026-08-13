import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ComprasTabs } from "@/components/ComprasTabs";
import { ExcluirButton } from "@/components/ExcluirButton";
import type { Compra, Produto, Transacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ComprasPage() {
  const supabase = await createClient();
  const [{ data: compras, error }, { data: produtos }, { data: gastos, error: erroGastos }] = await Promise.all([
    supabase
      .from("compras")
      .select("*")
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<Compra[]>(),
    supabase.from("produtos").select("id, nome").returns<Pick<Produto, "id" | "nome">[]>(),
    // "Outro gasto" (aba da ComprasTabs) grava direto em transacoes (tipo
    // despesa, mesma tabela/form de Financeiro > Despesas) — sem produto
    // nem vínculo com compras, por isso não aparece na query de compras
    // acima. Mostrado aqui à parte pra quem lança pela aba de Compras não
    // perder de vista que o gasto foi registrado.
    supabase
      .from("transacoes")
      .select("*")
      .eq("tipo", "despesa")
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10)
      .returns<Transacao[]>(),
  ]);

  // Join feito em JS (mesmo padrão de pedidos/page.tsx) para manter o tipo
  // do resultado simples sem declarar o grafo de foreign keys no Database.
  const nomeProdutoPorId = new Map((produtos ?? []).map((produto) => [produto.id, produto.nome]));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading mb-6 text-2xl text-foreground">Registrar compra</h2>
        <ComprasTabs />
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
                <TableHead>Frete</TableHead>
                <TableHead>Total</TableHead>
                <TableHead />
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
                  <TableCell>{currencyFormatter.format(compra.frete)}</TableCell>
                  <TableCell>{currencyFormatter.format(compra.valor_total)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <Link href={`/compras/${compra.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <ExcluirButton
                        tabela="compras"
                        id={compra.id}
                        titulo="Excluir compra?"
                        descricao={`Isso vai remover ${compra.quantidade} un. de ${
                          nomeProdutoPorId.get(compra.produto_id) ?? "produto"
                        } do estoque (recalculando o custo médio) e ${currencyFormatter.format(
                          compra.valor_total,
                        )} do financeiro. Esta ação não pode ser desfeita.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(compras ?? []).length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                    Nenhuma compra registrada ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">Outros gastos recentes</h3>
          <Link href="/financeiro/despesas" className="text-sm text-aurum-gold hover:underline">
            Ver todas em Financeiro → Despesas
          </Link>
        </div>
        {erroGastos && <p className="text-sm text-destructive">Erro ao carregar gastos: {erroGastos.message}</p>}
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
              {(gastos ?? []).map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell>{dateFormatter.format(new Date(`${gasto.data}T00:00:00`))}</TableCell>
                  <TableCell className="text-muted-foreground">{gasto.categoria ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{gasto.descricao ?? "—"}</TableCell>
                  <TableCell>{currencyFormatter.format(gasto.valor)}</TableCell>
                </TableRow>
              ))}
              {(gastos ?? []).length === 0 && !erroGastos && (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    Nenhum gasto avulso registrado ainda.
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
