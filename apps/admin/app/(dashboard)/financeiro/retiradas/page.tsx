import Link from "next/link";
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
import { currencyFormatter, dateFormatter } from "@/lib/format";
import { getRetiradasPorSocio } from "@/lib/finance";
import { RetiradaForm } from "@/components/RetiradaForm";

export const dynamic = "force-dynamic";

const LABEL_SOCIO: Record<string, string> = { lucas: "Lucas", vinicius: "Vinicius" };

export default async function RetiradasPage() {
  const supabase = await createClient();
  const retiradasPorSocio = await getRetiradasPorSocio(supabase);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Retiradas</h2>
        <Link href="/financeiro" className="text-sm text-aurum-gold hover:underline">
          ← Voltar ao Financeiro
        </Link>
      </div>

      <RetiradaForm />

      {/* Duas colunas por sócio — os totais nunca são somados entre si, cada
          sócio enxerga só a própria conta. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {retiradasPorSocio.map(({ socio, total, historico }) => (
          <div key={socio}>
            <Card className="mb-4">
              <CardContent>
                <p className="text-sm text-muted-foreground">Total retirado — {LABEL_SOCIO[socio]}</p>
                <p className="font-heading mt-1 text-2xl text-foreground">{currencyFormatter.format(total)}</p>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.map((retirada) => (
                    <TableRow key={retirada.id}>
                      <TableCell>{dateFormatter.format(new Date(`${retirada.data}T00:00:00`))}</TableCell>
                      <TableCell>{currencyFormatter.format(retirada.valor)}</TableCell>
                      <TableCell className="whitespace-normal text-muted-foreground">
                        {retirada.observacao ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {historico.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Nenhuma retirada de {LABEL_SOCIO[socio]} ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
