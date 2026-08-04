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
import { dateFormatter } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { MarketingMidiaForm } from "@/components/MarketingMidiaForm";
import { ProdutoMarketingControls } from "@/components/ProdutoMarketingControls";
import type { MarketingMidia, Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

const LABEL_TIPO: Record<MarketingMidia["tipo"], string> = {
  banner_principal: "Banner principal",
  destaque: "Destaque",
  promocional: "Promocional",
};

export default async function MarketingPage() {
  const supabase = await createClient();
  const [{ data: produtos, error: erroProdutos }, { data: midias, error: erroMidias }] = await Promise.all([
    supabase
      .from("produtos")
      .select("id, nome, publicado, destaque, mais_vendido, lancamento, promocao")
      .order("nome")
      .returns<Pick<Produto, "id" | "nome" | "publicado" | "destaque" | "mais_vendido" | "lancamento" | "promocao">[]>(),
    supabase.from("marketing_midias").select("*").order("ordem").returns<MarketingMidia[]>(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-heading mb-2 text-2xl text-foreground">Marketing</h2>
        <p className="text-sm text-muted-foreground">
          Controle o que aparece no catálogo público e as mídias promocionais do site.
        </p>
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Visibilidade dos produtos</h3>
        {erroProdutos && <p className="text-sm text-destructive">Erro ao carregar produtos: {erroProdutos.message}</p>}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Controles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(produtos ?? []).map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="whitespace-normal font-medium text-foreground">{produto.nome}</TableCell>
                  <TableCell>
                    <ProdutoMarketingControls
                      produtoId={produto.id}
                      publicadoInicial={produto.publicado}
                      destaqueInicial={produto.destaque}
                      maisVendidoInicial={produto.mais_vendido}
                      lancamentoInicial={produto.lancamento}
                      promocaoInicial={produto.promocao}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(produtos ?? []).length === 0 && !erroProdutos && (
                <TableRow>
                  <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                    Nenhum produto cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Nova mídia</h3>
        <MarketingMidiaForm />
      </div>

      <div>
        <h3 className="font-heading mb-4 text-xl text-foreground">Mídias cadastradas</h3>
        {erroMidias && <p className="text-sm text-destructive">Erro ao carregar mídias: {erroMidias.message}</p>}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(midias ?? []).map((midia) => (
                <TableRow key={midia.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={midia.imagem_url}
                      alt={midia.titulo ?? LABEL_TIPO[midia.tipo]}
                      className="h-12 w-20 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{LABEL_TIPO[midia.tipo]}</TableCell>
                  <TableCell className="whitespace-normal text-foreground">{midia.titulo ?? "—"}</TableCell>
                  <TableCell>{midia.ordem}</TableCell>
                  <TableCell>
                    <Badge variant={midia.ativo ? "default" : "outline"}>{midia.ativo ? "Ativa" : "Oculta"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(midia.created_at))}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      tabela="marketing_midias"
                      id={midia.id}
                      confirmMessage="Excluir esta mídia? Esta ação não pode ser desfeita."
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(midias ?? []).length === 0 && !erroMidias && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                    Nenhuma mídia cadastrada ainda.
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
