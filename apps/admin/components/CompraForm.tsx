"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { currencyFormatter } from "@/lib/format";
import type { Compra } from "@/lib/types";

type ProdutoOpcao = {
  id: string;
  nome: string;
  estoque_atual: number;
  custo_medio: number;
};

export function CompraForm({ compra }: { compra?: Compra }) {
  const router = useRouter();
  const isEdicao = Boolean(compra);
  const [produtos, setProdutos] = useState<ProdutoOpcao[]>([]);
  const [produtoId, setProdutoId] = useState(compra?.produto_id ?? "");
  const [quantidade, setQuantidade] = useState(compra ? String(compra.quantidade) : "1");
  const [custoUnitario, setCustoUnitario] = useState(compra ? String(compra.custo_unitario) : "");
  const [data, setData] = useState(() => compra?.data ?? new Date().toISOString().slice(0, 10));
  const [observacao, setObservacao] = useState(compra?.observacao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("produtos")
      .select("id, nome, estoque_atual, custo_medio")
      .order("nome")
      .then(({ data }) => setProdutos(data ?? []));
  }, []);

  const valorTotal = Number(quantidade || 0) * Number(custoUnitario || 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (!produtoId) {
      setErro("Selecione um produto.");
      return;
    }
    if (Number(quantidade) <= 0) {
      setErro("A quantidade deve ser maior que zero.");
      return;
    }
    if (Number(custoUnitario) < 0) {
      setErro("O custo unitário não pode ser negativo.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();

    if (isEdicao) {
      // RPC transacional (supabase/edicoes.sql): atualiza a compra e
      // sincroniza a transação vinculada — o trigger de UPDATE em compras
      // recalcula estoque/custo médio do produto do zero.
      const { error: erroRpc } = await supabase.rpc("atualizar_compra", {
        p_compra_id: compra!.id,
        p_produto_id: produtoId,
        p_quantidade: Number(quantidade),
        p_custo_unitario: Number(custoUnitario),
        p_data: data,
        p_observacao: observacao || null,
      });

      setSalvando(false);

      if (erroRpc) {
        setErro(erroRpc.message);
        toast.error("Erro ao atualizar compra", { description: erroRpc.message });
        return;
      }

      toast.success("Compra atualizada — estoque e custo médio recalculados.");
      router.push("/compras");
      router.refresh();
      return;
    }

    const { error } = await supabase.from("compras").insert({
      produto_id: produtoId,
      quantidade: Number(quantidade),
      custo_unitario: Number(custoUnitario),
      data,
      observacao: observacao || null,
    });

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao registrar compra", { description: error.message });
      return;
    }

    toast.success("Compra registrada — estoque e custo médio atualizados.");
    setQuantidade("1");
    setCustoUnitario("");
    setObservacao("");
    router.refresh();
  }

  const produtoSelecionado = produtos.find((produto) => produto.id === produtoId);

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="produto">Produto</Label>
            <Select value={produtoId} onValueChange={setProdutoId}>
              <SelectTrigger id="produto" className="w-full">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.nome} (estoque: {produto.estoque_atual}, custo médio: {currencyFormatter.format(produto.custo_medio)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                required
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="custoUnitario">Custo unitário (R$)</Label>
              <Input
                id="custoUnitario"
                required
                type="number"
                step="0.01"
                min="0"
                value={custoUnitario}
                onChange={(e) => setCustoUnitario(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                Total da compra: <span className="text-foreground">{currencyFormatter.format(valorTotal)}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
            />
          </div>

          {produtoSelecionado && (
            <p className="text-xs text-muted-foreground">
              Novo custo médio ponderado será calculado automaticamente a partir do estoque atual
              ({produtoSelecionado.estoque_atual} un. a {currencyFormatter.format(produtoSelecionado.custo_medio)}).
            </p>
          )}

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Registrar compra"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
