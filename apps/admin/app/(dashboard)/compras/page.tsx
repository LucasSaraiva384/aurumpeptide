import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Último dia do mês de `mes` ("YYYY-MM"): dia 0 do mês seguinte volta pro
// último dia do mês atual — sem precisar saber se tem 28/30/31 dias.
function fimDoMes(mes: string): string {
  const [ano, mesNum] = mes.split("-").map(Number);
  return new Date(ano!, mesNum!, 0).toISOString().slice(0, 10);
}

// Agrupa compras pelo grupo_compra_id (supabase/compras-grupo.sql) só pra
// exibição — cada linha continua sendo uma compra independente no banco.
// Preserva a ordem de chegada (compras não fica presa a estar adjacente no
// resultado da query: linhas do mesmo grupo têm created_at idêntico, então
// o desempate entre elas na ordenação não é garantido).
function agruparCompras(compras: Compra[]): Compra[][] {
  const grupos: Compra[][] = [];
  const indicePorGrupo = new Map<string, number>();
  for (const compra of compras) {
    if (compra.grupo_compra_id) {
      const indice = indicePorGrupo.get(compra.grupo_compra_id);
      if (indice !== undefined) {
        grupos[indice]!.push(compra);
        continue;
      }
      indicePorGrupo.set(compra.grupo_compra_id, grupos.length);
    }
    grupos.push([compra]);
  }
  return grupos;
}

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const filtroAtivo = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : null;
  const inicioMes = filtroAtivo ? `${filtroAtivo}-01` : null;
  const fimMes = filtroAtivo ? fimDoMes(filtroAtivo) : null;

  const supabase = await createClient();

  let queryCompras = supabase
    .from("compras")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });
  let queryGastos = supabase
    .from("transacoes")
    .select("*")
    .eq("tipo", "despesa")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  if (inicioMes && fimMes) {
    queryCompras = queryCompras.gte("data", inicioMes).lte("data", fimMes);
    queryGastos = queryGastos.gte("data", inicioMes).lte("data", fimMes);
  } else {
    // Sem filtro: mantém as listas curtas (mais recentes primeiro). Com
    // filtro por mês, o range de datas já limita o volume naturalmente.
    queryCompras = queryCompras.limit(50);
    queryGastos = queryGastos.limit(10);
  }

  const [{ data: compras, error }, { data: produtos }, { data: gastos, error: erroGastos }] = await Promise.all([
    queryCompras.returns<Compra[]>(),
    supabase.from("produtos").select("id, nome").returns<Pick<Produto, "id" | "nome">[]>(),
    // "Outro gasto" (aba da ComprasTabs) grava direto em transacoes (tipo
    // despesa, mesma tabela/form de Financeiro > Despesas) — sem produto
    // nem vínculo com compras, por isso não aparece na query de compras
    // acima. Mostrado aqui à parte pra quem lança pela aba de Compras não
    // perder de vista que o gasto foi registrado.
    queryGastos.returns<Transacao[]>(),
  ]);

  // Join feito em JS (mesmo padrão de pedidos/page.tsx) para manter o tipo
  // do resultado simples sem declarar o grafo de foreign keys no Database.
  const nomeProdutoPorId = new Map((produtos ?? []).map((produto) => [produto.id, produto.nome]));
  const gruposCompras = agruparCompras(compras ?? []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading mb-6 text-2xl text-foreground">Registrar compra</h2>
        <ComprasTabs />
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mes">Filtrar por mês</Label>
          <Input id="mes" type="month" name="mes" defaultValue={filtroAtivo ?? undefined} />
        </div>
        <Button type="submit" variant="outline">
          Filtrar
        </Button>
        {filtroAtivo && (
          <Link href="/compras">
            <Button type="button" variant="ghost">
              Limpar filtro
            </Button>
          </Link>
        )}
      </form>

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
              {gruposCompras.map((grupo) => {
                const agrupada = grupo.length > 1;
                const freteTotalGrupo = grupo.reduce((soma, c) => soma + Number(c.frete), 0);
                return (
                  <Fragment key={grupo[0]!.id}>
                    {grupo.map((compra) => (
                      <TableRow key={compra.id} className={agrupada ? "border-l-2 border-l-aurum-gold/40" : undefined}>
                        <TableCell>{dateFormatter.format(new Date(`${compra.data}T00:00:00`))}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {nomeProdutoPorId.get(compra.produto_id) ?? "—"}
                        </TableCell>
                        <TableCell>{compra.quantidade}</TableCell>
                        <TableCell>{currencyFormatter.format(compra.custo_unitario)}</TableCell>
                        <TableCell>{agrupada && compra.frete === 0 ? "—" : currencyFormatter.format(compra.frete)}</TableCell>
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
                              )} do financeiro.${
                                agrupada && compra.frete > 0
                                  ? ` Esta linha carrega o frete de todo o grupo (${currencyFormatter.format(
                                      compra.frete,
                                    )}) — as outras ${grupo.length - 1} linha(s) do grupo não têm frete próprio.`
                                  : ""
                              } Esta ação não pode ser desfeita.`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {agrupada && (
                      <TableRow key={`${grupo[0]!.grupo_compra_id}-legenda`} className="border-l-2 border-l-aurum-gold/40">
                        <TableCell colSpan={7} className="py-1.5 text-xs text-muted-foreground">
                          ↳ mesma compra — frete {currencyFormatter.format(freteTotalGrupo)} lançado 1x
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
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
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(gastos ?? []).map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell>{dateFormatter.format(new Date(`${gasto.data}T00:00:00`))}</TableCell>
                  <TableCell className="text-muted-foreground">{gasto.categoria ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{gasto.descricao ?? "—"}</TableCell>
                  <TableCell>{currencyFormatter.format(gasto.valor)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <Link href={`/financeiro/despesas/${gasto.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <ExcluirButton
                        tabela="transacoes"
                        id={gasto.id}
                        titulo="Excluir gasto?"
                        descricao={`Isso vai remover ${currencyFormatter.format(
                          gasto.valor,
                        )} (${gasto.categoria ?? "sem categoria"}) do financeiro. Esta ação não pode ser desfeita.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(gastos ?? []).length === 0 && !erroGastos && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
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
