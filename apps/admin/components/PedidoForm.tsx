"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Pedido, PedidoItem as PedidoItemRow } from "@/lib/types";

interface ClienteOpcao {
  id: string;
  nome: string;
}

interface ProdutoOpcao {
  id: string;
  nome: string;
  preco: number;
  estoque_atual: number;
}

interface ItemPedido {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

const FORMAS_PAGAMENTO = ["Pix", "Cartão", "Dinheiro", "Transferência", "Outro"];

function novoItem(produtos: ProdutoOpcao[]): ItemPedido {
  const primeiro = produtos[0];
  return { produtoId: primeiro?.id ?? "", quantidade: 1, precoUnitario: primeiro?.preco ?? 0 };
}

export function PedidoForm({
  pedido,
  itensIniciais,
}: {
  pedido?: Pedido;
  itensIniciais?: PedidoItemRow[];
}) {
  const router = useRouter();
  const isEdicao = Boolean(pedido);
  const [clientes, setClientes] = useState<ClienteOpcao[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOpcao[]>([]);

  const [clienteNovo, setClienteNovo] = useState(false);
  const [clienteId, setClienteId] = useState(pedido?.cliente_id ?? "");
  const [nomeClienteNovo, setNomeClienteNovo] = useState("");
  const [whatsappClienteNovo, setWhatsappClienteNovo] = useState("");
  const [cidadeClienteNovo, setCidadeClienteNovo] = useState("");

  const [itens, setItens] = useState<ItemPedido[]>(
    itensIniciais?.map((item) => ({
      produtoId: item.produto_id,
      quantidade: item.quantidade,
      precoUnitario: item.preco_unitario,
    })) ?? [],
  );
  const [formaPagamento, setFormaPagamento] = useState<string>(
    pedido?.forma_pagamento ?? FORMAS_PAGAMENTO[0] ?? "",
  );
  const [observacao, setObservacao] = useState<string>(pedido?.observacao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("clientes")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => setClientes(data ?? []));

    // Na edição, um item pode referenciar um produto que hoje está
    // inativo/descontinuado — buscar todos os produtos garante que ele
    // continue aparecendo no select em vez de sumir da lista.
    let query = supabase.from("produtos").select("id, nome, preco, estoque_atual");
    if (!isEdicao) {
      query = query.eq("ativo", true);
    }

    query.order("nome").then(({ data }) => {
      const lista = data ?? [];
      setProdutos(lista);
      if (!isEdicao) {
        setItens([novoItem(lista)]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valorTotal = itens.reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0);

  function atualizarItem(index: number, campo: keyof ItemPedido, valor: string) {
    setItens((atual) =>
      atual.map((item, i) => {
        if (i !== index) return item;
        if (campo === "produtoId") {
          const produto = produtos.find((p) => p.id === valor);
          return { ...item, produtoId: valor, precoUnitario: produto?.preco ?? item.precoUnitario };
        }
        if (campo === "quantidade") return { ...item, quantidade: Number(valor) };
        if (campo === "precoUnitario") return { ...item, precoUnitario: Number(valor) };
        return item;
      }),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (itens.length === 0 || itens.some((item) => !item.produtoId || item.quantidade <= 0)) {
      setErro("Adicione ao menos um item válido ao pedido.");
      return;
    }
    if (!clienteNovo && !clienteId) {
      setErro("Selecione um cliente existente ou cadastre um novo.");
      return;
    }
    if (clienteNovo && !nomeClienteNovo) {
      setErro("Informe o nome do novo cliente.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();

    let clienteIdFinal = clienteId || null;

    if (clienteNovo) {
      const { data: novoCliente, error: erroCliente } = await supabase
        .from("clientes")
        .insert({
          nome: nomeClienteNovo,
          whatsapp: whatsappClienteNovo || null,
          cidade: cidadeClienteNovo || null,
        })
        .select("id")
        .single()
        .returns<{ id: string }>();

      if (erroCliente || !novoCliente) {
        const mensagem = erroCliente?.message ?? "Erro ao criar cliente.";
        setErro(mensagem);
        toast.error("Erro ao criar cliente", { description: mensagem });
        setSalvando(false);
        return;
      }
      clienteIdFinal = novoCliente.id;
    }

    if (isEdicao) {
      // RPC transacional (supabase/edicoes.sql): apaga os itens antigos,
      // atualiza o pedido, insere os itens novos e recalcula
      // estoque/financeiro/estatísticas do cliente — tudo dentro de uma
      // única transação no Postgres, em vez de statements soltos no client.
      const { error: erroRpc } = await supabase.rpc("atualizar_pedido", {
        p_pedido_id: pedido!.id,
        p_cliente_id: clienteIdFinal,
        p_forma_pagamento: formaPagamento,
        p_observacao: observacao || null,
        p_itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
      });

      setSalvando(false);

      if (erroRpc) {
        setErro(erroRpc.message);
        toast.error("Erro ao atualizar pedido", { description: erroRpc.message });
        return;
      }

      toast.success("Pedido atualizado.");
      router.push("/pedidos");
      router.refresh();
      return;
    }

    const { data: pedidoCriado, error: erroPedido } = await supabase
      .from("pedidos")
      .insert({
        cliente_id: clienteIdFinal,
        valor_total: valorTotal,
        forma_pagamento: formaPagamento,
        observacao: observacao || null,
      })
      .select("id")
      .single()
      .returns<{ id: string }>();

    if (erroPedido || !pedidoCriado) {
      const mensagem = erroPedido?.message ?? "Erro ao registrar pedido.";
      setErro(mensagem);
      toast.error("Erro ao registrar pedido", { description: mensagem });
      setSalvando(false);
      return;
    }

    // Sem transação client-side (Supabase JS não expõe múltiplos statements
    // atômicos): se a inserção dos itens falhar aqui, o pedido já foi criado
    // sem itens. Para um volume maior de vendas, mover este fluxo para uma
    // função RPC no Postgres eliminaria essa janela.
    const { error: erroItens } = await supabase.from("pedido_itens").insert(
      itens.map((item) => ({
        pedido_id: pedidoCriado.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario,
      })),
    );

    setSalvando(false);

    if (erroItens) {
      const mensagem = `Pedido criado, mas houve erro ao registrar itens: ${erroItens.message}`;
      setErro(mensagem);
      toast.error("Pedido criado com pendência", { description: mensagem });
      return;
    }

    toast.success("Pedido registrado.");
    router.push("/pedidos");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={clienteNovo}
                onCheckedChange={(checked: boolean | "indeterminate") => setClienteNovo(checked === true)}
              />
              Cadastrar novo cliente
            </Label>

            {clienteNovo ? (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  required
                  placeholder="Nome"
                  value={nomeClienteNovo}
                  onChange={(e) => setNomeClienteNovo(e.target.value)}
                />
                <Input
                  placeholder="WhatsApp"
                  value={whatsappClienteNovo}
                  onChange={(e) => setWhatsappClienteNovo(e.target.value)}
                />
                <Input
                  placeholder="Cidade"
                  value={cidadeClienteNovo}
                  onChange={(e) => setCidadeClienteNovo(e.target.value)}
                />
              </div>
            ) : (
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger className="mt-3 w-full">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm text-foreground/80">Itens do pedido</p>
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
                    value={item.precoUnitario}
                    onChange={(e) => atualizarItem(index, "precoUnitario", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setItens((atual) => atual.filter((_, i) => i !== index))}
                    className="text-destructive hover:opacity-80"
                    aria-label="Remover item"
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
              + adicionar item
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="formaPagamento">Forma de pagamento</Label>
            <Select value={formaPagamento} onValueChange={setFormaPagamento}>
              <SelectTrigger id="formaPagamento" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAS_PAGAMENTO.map((forma) => (
                  <SelectItem key={forma} value={forma}>
                    {forma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <p className="font-heading text-xl text-foreground">
            Total: {currencyFormatter.format(valorTotal)}
          </p>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Registrar pedido"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
