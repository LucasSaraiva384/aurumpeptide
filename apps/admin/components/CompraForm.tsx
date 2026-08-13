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

interface ItemCompra {
  produtoId: string;
  quantidade: string;
  custoUnitario: string;
}

function novoItem(produtos: ProdutoOpcao[]): ItemCompra {
  return { produtoId: produtos[0]?.id ?? "", quantidade: "1", custoUnitario: "" };
}

export function CompraForm({ compra }: { compra?: Compra }) {
  const router = useRouter();
  const isEdicao = Boolean(compra);
  const [produtos, setProdutos] = useState<ProdutoOpcao[]>([]);

  // Modo edição: campos de 1 produto só — fluxo já existente e testado em
  // produção, intocado (atualizar_compra RPC só edita 1 linha por vez).
  const [produtoId, setProdutoId] = useState(compra?.produto_id ?? "");
  const [quantidade, setQuantidade] = useState(compra ? String(compra.quantidade) : "1");
  const [custoUnitario, setCustoUnitario] = useState(compra ? String(compra.custo_unitario) : "");

  // Modo criação: lista de itens (mesmo padrão de PedidoForm/itens da
  // venda) — permite lançar vários produtos numa mesma compra, com 1 frete
  // só (supabase/compras-grupo.sql, ver handleSubmit).
  const [itens, setItens] = useState<ItemCompra[]>([]);

  const [frete, setFrete] = useState(compra?.frete ? String(compra.frete) : "0");
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
      .then(({ data }) => {
        const lista = data ?? [];
        setProdutos(lista);
        if (!isEdicao) {
          setItens([novoItem(lista)]);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valorTotalEdicao = Number(quantidade || 0) * Number(custoUnitario || 0) + Number(frete || 0);
  const valorTotalCriacao =
    itens.reduce((soma, item) => soma + Number(item.quantidade || 0) * Number(item.custoUnitario || 0), 0) +
    Number(frete || 0);

  function atualizarItem(index: number, campo: keyof ItemCompra, valor: string) {
    setItens((atual) => atual.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (isEdicao) {
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

      // RPC transacional (supabase/edicoes.sql): atualiza a compra e
      // sincroniza a transação vinculada — o trigger de UPDATE em compras
      // recalcula estoque/custo médio do produto do zero.
      const { error: erroRpc } = await supabase.rpc("atualizar_compra", {
        p_compra_id: compra!.id,
        p_produto_id: produtoId,
        p_quantidade: Number(quantidade),
        p_custo_unitario: Number(custoUnitario),
        p_frete: Number(frete || 0),
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

    if (itens.length === 0 || itens.some((item) => !item.produtoId || Number(item.quantidade) <= 0)) {
      setErro("Adicione ao menos um produto válido à compra.");
      return;
    }
    if (itens.some((item) => Number(item.custoUnitario) < 0)) {
      setErro("O custo unitário não pode ser negativo.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();

    // grupo_compra_id só serve pra compras/page.tsx agrupar visualmente as
    // linhas lançadas juntas — cada linha continua sendo uma compra
    // independente pros triggers/RPCs de estoque e financeiro (nenhum deles
    // sabe que essa coluna existe).
    const grupoCompraId = itens.length > 1 ? crypto.randomUUID() : null;

    const { error } = await supabase.from("compras").insert(
      itens.map((item, index) => ({
        produto_id: item.produtoId,
        quantidade: Number(item.quantidade),
        custo_unitario: Number(item.custoUnitario || 0),
        // Frete do grupo inteiro só na primeira linha — evita contar o
        // mesmo frete mais de uma vez no financeiro.
        frete: index === 0 ? Number(frete || 0) : 0,
        data,
        observacao: observacao || null,
        grupo_compra_id: grupoCompraId,
      })),
    );

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao registrar compra", { description: error.message });
      return;
    }

    toast.success(
      itens.length > 1
        ? `Compra registrada — ${itens.length} produtos, estoque e custo médio atualizados.`
        : "Compra registrada — estoque e custo médio atualizados.",
    );
    setItens([novoItem(produtos)]);
    setFrete("0");
    setObservacao("");
    router.refresh();
  }

  const produtoSelecionado = produtos.find((produto) => produto.id === produtoId);

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isEdicao ? (
            <>
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

              {produtoSelecionado && (
                <p className="text-xs text-muted-foreground">
                  Novo custo médio ponderado será calculado automaticamente a partir do estoque atual
                  ({produtoSelecionado.estoque_atual} un. a {currencyFormatter.format(produtoSelecionado.custo_medio)}).
                </p>
              )}
            </>
          ) : (
            <div>
              <p className="mb-2 text-sm text-foreground/80">Produtos da compra</p>
              <div className="flex flex-col gap-2">
                {itens.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_80px_120px_32px] items-center gap-2">
                    <Select
                      value={item.produtoId}
                      onValueChange={(valor: string) => atualizarItem(index, "produtoId", valor)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome} (estoque: {produto.estoque_atual})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, "quantidade", e.target.value)}
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Custo un."
                      value={item.custoUnitario}
                      onChange={(e) => atualizarItem(index, "custoUnitario", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setItens((atual) => atual.filter((_, i) => i !== index))}
                      className="text-destructive hover:opacity-80"
                      aria-label="Remover produto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setItens((atual) => [...atual, novoItem(produtos)])}
                className="mt-2 text-sm text-aurum-gold hover:underline"
              >
                + adicionar produto
              </button>

              {itens.length === 1 && produtos.find((p) => p.id === itens[0]!.produtoId) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Novo custo médio ponderado será calculado automaticamente a partir do estoque atual
                  ({produtos.find((p) => p.id === itens[0]!.produtoId)!.estoque_atual} un. a{" "}
                  {currencyFormatter.format(produtos.find((p) => p.id === itens[0]!.produtoId)!.custo_medio)}).
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="frete">Frete (R$)</Label>
              <Input
                id="frete"
                type="number"
                step="0.01"
                min="0"
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Total da compra (produto{!isEdicao && itens.length > 1 ? "s" : ""} + frete):{" "}
            <span className="text-foreground">
              {currencyFormatter.format(isEdicao ? valorTotalEdicao : valorTotalCriacao)}
            </span>
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
            />
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Registrar compra"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
