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
import { currencyFormatter } from "@/lib/format";
import { getResumoEstoque } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const supabase = await createClient();
  const { capitalEstoque, produtos } = await getResumoEstoque(supabase);

  const produtosEstoqueBaixo = produtos.filter((produto) => produto.estoque_atual <= produto.estoque_minimo);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-heading text-2xl text-foreground">Estoque</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Capital investido em estoque</p>
            <p className="font-heading mt-1 text-2xl text-foreground">{currencyFormatter.format(capitalEstoque)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Produtos com estoque baixo</p>
            <p className="font-heading mt-1 text-2xl text-foreground">{produtosEstoqueBaixo.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Estoque atual</TableHead>
              <TableHead>Estoque mínimo</TableHead>
              <TableHead>Custo médio</TableHead>
              <TableHead>Capital investido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => {
              const estoqueBaixo = produto.estoque_atual <= produto.estoque_minimo;
              return (
                <TableRow key={produto.id} className={estoqueBaixo ? "bg-destructive/5" : undefined}>
                  <TableCell className="whitespace-normal font-medium text-foreground">{produto.nome}</TableCell>
                  <TableCell>
                    {estoqueBaixo ? (
                      <Badge variant="destructive">{produto.estoque_atual}</Badge>
                    ) : (
                      produto.estoque_atual
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{produto.estoque_minimo}</TableCell>
                  <TableCell>{currencyFormatter.format(produto.custo_medio)}</TableCell>
                  <TableCell>{currencyFormatter.format(produto.capitalInvestido)}</TableCell>
                </TableRow>
              );
            })}
            {produtos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
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
