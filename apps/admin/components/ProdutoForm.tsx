"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Produto } from "@/lib/types";

export function ProdutoForm({ produto }: { produto?: Produto }) {
  const router = useRouter();
  const isEdicao = Boolean(produto);

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [categoria, setCategoria] = useState(produto?.categoria ?? "");
  const [imagemUrl, setImagemUrl] = useState(produto?.imagem_url ?? "");
  const [estoqueAtual, setEstoqueAtual] = useState(String(produto?.estoque_atual ?? 0));
  const [estoqueMinimo, setEstoqueMinimo] = useState(String(produto?.estoque_minimo ?? 0));
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setSalvando(true);

    const supabase = createClient();
    const payload = {
      nome,
      descricao: descricao || null,
      preco: Number(preco),
      categoria: categoria || null,
      imagem_url: imagemUrl || null,
      estoque_atual: Number(estoqueAtual),
      estoque_minimo: Number(estoqueMinimo),
      ativo,
    };

    const { error } = isEdicao
      ? await supabase.from("produtos").update(payload).eq("id", produto!.id)
      : await supabase.from("produtos").insert(payload);

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao salvar produto", { description: error.message });
      return;
    }

    toast.success(isEdicao ? "Produto atualizado." : "Produto criado.");
    router.push("/produtos");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao ?? ""}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                required
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={categoria ?? ""}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imagemUrl">URL da imagem</Label>
            <Input
              id="imagemUrl"
              value={imagemUrl ?? ""}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="estoqueAtual">Estoque atual</Label>
              <Input
                id="estoqueAtual"
                required
                type="number"
                min="0"
                value={estoqueAtual}
                onChange={(e) => setEstoqueAtual(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="estoqueMinimo">Estoque mínimo</Label>
              <Input
                id="estoqueMinimo"
                required
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
              />
            </div>
          </div>

          <Label className="flex items-center gap-2">
            <Checkbox
              checked={ativo}
              onCheckedChange={(checked: boolean | "indeterminate") => setAtivo(checked === true)}
            />
            Ativo no catálogo público
          </Label>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Criar produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
