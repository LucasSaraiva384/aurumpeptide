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
import type { Marca } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MarcasPage() {
  const supabase = await createClient();
  const { data: marcas, error } = await supabase
    .from("marcas")
    .select("*")
    .order("ordem")
    .returns<Marca[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Marcas</h2>
        <Link href="/marcas/novo">
          <Button>Nova marca</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-destructive">Erro ao carregar marcas: {error.message}</p>}

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
            {(marcas ?? []).map((marca) => (
              <TableRow key={marca.id}>
                <TableCell className="whitespace-normal font-medium text-foreground">
                  {marca.nome}
                </TableCell>
                <TableCell className="text-muted-foreground">{marca.slug}</TableCell>
                <TableCell>{marca.ordem}</TableCell>
                <TableCell>
                  <Badge variant={marca.ativo ? "default" : "outline"}>
                    {marca.ativo ? "Ativa" : "Oculta"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <Link href={`/marcas/${marca.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <DeleteButton
                      tabela="marcas"
                      id={marca.id}
                      confirmMessage={`Excluir a marca "${marca.nome}"? Esta ação não pode ser desfeita.`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(marcas ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Nenhuma marca cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
