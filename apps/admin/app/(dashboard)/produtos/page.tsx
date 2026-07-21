import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { currencyFormatter } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const supabase = await createClient();
  const { data: produtos, error } = await supabase
    .from("produtos")
    .select("*")
    .order("nome")
    .returns<Produto[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Produtos</h2>
        <Link href="/produtos/novo">
          <Button>Novo produto</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-destructive">Erro ao carregar produtos: {error.message}</p>}

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(produtos ?? []).map((produto) => (
              <TableRow key={produto.id}>
                <TableCell className="whitespace-normal font-medium text-foreground">
                  {produto.nome}
                </TableCell>
                <TableCell className="text-muted-foreground">{produto.categoria ?? "—"}</TableCell>
                <TableCell>{currencyFormatter.format(produto.preco)}</TableCell>
                <TableCell>
                  {produto.estoque_atual <= produto.estoque_minimo ? (
                    <Badge variant="destructive">{produto.estoque_atual} / mín. {produto.estoque_minimo}</Badge>
                  ) : (
                    <span className="text-foreground">
                      {produto.estoque_atual}
                      <span className="text-muted-foreground"> / mín. {produto.estoque_minimo}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={produto.ativo ? "default" : "outline"}>
                    {produto.ativo ? "Ativo" : "Oculto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <Link href={`/produtos/${produto.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <DeleteButton
                      tabela="produtos"
                      id={produto.id}
                      confirmMessage={`Excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(produtos ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                  Nenhum produto cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
