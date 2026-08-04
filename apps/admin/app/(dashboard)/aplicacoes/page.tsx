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
import { DeleteButton } from "@/components/DeleteButton";
import type { Aplicacao } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AplicacoesPage() {
  const supabase = await createClient();
  const { data: aplicacoes, error } = await supabase
    .from("aplicacoes")
    .select("*")
    .order("ordem")
    .returns<Aplicacao[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Aplicações</h2>
        <Link href="/aplicacoes/novo">
          <Button>Nova aplicação</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-destructive">Erro ao carregar aplicações: {error.message}</p>}

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(aplicacoes ?? []).map((aplicacao) => (
              <TableRow key={aplicacao.id}>
                <TableCell className="whitespace-normal font-medium text-foreground">
                  {aplicacao.nome}
                </TableCell>
                <TableCell className="text-muted-foreground">{aplicacao.slug}</TableCell>
                <TableCell>{aplicacao.ordem}</TableCell>
                <TableCell>
                  <Badge variant={aplicacao.ativo ? "default" : "outline"}>
                    {aplicacao.ativo ? "Ativa" : "Oculta"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <Link href={`/aplicacoes/${aplicacao.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <DeleteButton
                      tabela="aplicacoes"
                      id={aplicacao.id}
                      confirmMessage={`Excluir a aplicação "${aplicacao.nome}"? Esta ação não pode ser desfeita.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(aplicacoes ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Nenhuma aplicação cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
