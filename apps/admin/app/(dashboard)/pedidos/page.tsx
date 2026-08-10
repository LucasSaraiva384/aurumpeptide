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
import { PedidoForm } from "@/components/PedidoForm";
import { ExcluirButton } from "@/components/ExcluirButton";
import type { Pedido, Cliente } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const supabase = await createClient();
  const [{ data: pedidos, error }, { data: clientes }] = await Promise.all([
    supabase
      .from("pedidos")
      .select("id, data, cliente_id, valor_total, forma_pagamento")
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<Pick<Pedido, "id" | "data" | "cliente_id" | "valor_total" | "forma_pagamento">[]>(),
    supabase.from("clientes").select("id, nome").returns<Pick<Cliente, "id" | "nome">[]>(),
  ]);

  // Join feito em JS em vez de embed do PostgREST (`clientes(nome)`) para
  // manter o tipo do resultado simples e totalmente seguro sem precisar
  // declarar o grafo de foreign keys no tipo Database.
  const nomeClientePorId = new Map((clientes ?? []).map((cliente) => [cliente.id, cliente.nome]));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading mb-6 text-2xl text-foreground">Registrar venda</h2>
        <PedidoForm />
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Vendas recentes</h3>
        {error && <p className="text-sm text-destructive">Erro ao carregar vendas: {error.message}</p>}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(pedidos ?? []).map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{dateFormatter.format(new Date(`${pedido.data}T00:00:00`))}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {(pedido.cliente_id && nomeClientePorId.get(pedido.cliente_id)) ?? "—"}
                  </TableCell>
                  <TableCell>{currencyFormatter.format(pedido.valor_total)}</TableCell>
                  <TableCell className="text-muted-foreground">{pedido.forma_pagamento ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <Link href={`/pedidos/${pedido.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <ExcluirButton
                        tabela="pedidos"
                        id={pedido.id}
                        titulo="Excluir venda?"
                        descricao={`Isso vai excluir a venda de ${
                          (pedido.cliente_id && nomeClientePorId.get(pedido.cliente_id)) ?? "cliente não identificado"
                        } no valor de ${currencyFormatter.format(
                          pedido.valor_total,
                        )}, devolver os itens vendidos ao estoque e remover a transação vinculada do financeiro. Esta ação não pode ser desfeita.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(pedidos ?? []).length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Nenhuma venda registrada ainda.
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
