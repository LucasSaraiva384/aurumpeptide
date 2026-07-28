import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Cliente } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clientes")
    .select("*")
    .order("ultima_compra_em", { ascending: false, nullsFirst: false });

  if (q) {
    query = query.or(`nome.ilike.%${q}%,whatsapp.ilike.%${q}%`);
  }

  // `.returns<Cliente[]>()` explícito: a reatribuição condicional de `query`
  // (com/sem `.or()`) confunde a inferência de tipo do builder do
  // supabase-js e o `data` acaba tipado como `never[]` sem isso.
  const { data: clientes, error } = await query.returns<Cliente[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Clientes</h2>
        <Link href="/clientes/novo">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      <form method="get" className="mb-6 flex gap-2">
        <Input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nome ou WhatsApp..."
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">Erro ao carregar clientes: {error.message}</p>}

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Última compra</TableHead>
              <TableHead>Total gasto</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(clientes ?? []).map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium text-foreground">{cliente.nome}</TableCell>
                <TableCell className="text-muted-foreground">{cliente.whatsapp ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{cliente.cidade ?? "—"}</TableCell>
                <TableCell>
                  {cliente.ultima_compra_em
                    ? dateFormatter.format(new Date(`${cliente.ultima_compra_em}T00:00:00`))
                    : "—"}
                </TableCell>
                <TableCell>{currencyFormatter.format(cliente.valor_total_gasto)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Link href={`/clientes/${cliente.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(clientes ?? []).length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
