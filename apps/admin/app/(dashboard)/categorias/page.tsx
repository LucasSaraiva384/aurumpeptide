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
import type { Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categorias, error } = await supabase
    .from("categorias")
    .select("*")
    .order("ordem")
    .returns<Categoria[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Categorias</h2>
        <Link href="/categorias/novo">
          <Button>Nova categoria</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-destructive">Erro ao carregar categorias: {error.message}</p>}

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
            {(categorias ?? []).map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell className="whitespace-normal font-medium text-foreground">
                  {categoria.nome}
                </TableCell>
                <TableCell className="text-muted-foreground">{categoria.slug}</TableCell>
                <TableCell>{categoria.ordem}</TableCell>
                <TableCell>
                  <Badge variant={categoria.ativo ? "default" : "outline"}>
                    {categoria.ativo ? "Ativa" : "Oculta"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <Link href={`/categorias/${categoria.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <DeleteButton
                      tabela="categorias"
                      id={categoria.id}
                      confirmMessage={`Excluir a categoria "${categoria.nome}"? Esta ação não pode ser desfeita.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(categorias ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Nenhuma categoria cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
