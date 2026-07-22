"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [categoria, setCategoria] = useState(produto?.categoria ?? "");
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? []);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [estoqueAtual, setEstoqueAtual] = useState(String(produto?.estoque_atual ?? 0));
  const [estoqueMinimo, setEstoqueMinimo] = useState(String(produto?.estoque_minimo ?? 0));
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleUpload(event: FormEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;
    if (!files || files.length === 0) return;

    setEnviandoImagem(true);
    const supabase = createClient();
    const novasUrls: string[] = [];

    for (const file of Array.from(files)) {
      const extensao = file.name.split(".").pop();
      const caminho = `${crypto.randomUUID()}.${extensao}`;
      const { error } = await supabase.storage.from("produtos").upload(caminho, file);

      if (error) {
        toast.error("Erro ao enviar imagem", { description: error.message });
        continue;
      }

      const { data } = supabase.storage.from("produtos").getPublicUrl(caminho);
      novasUrls.push(data.publicUrl);
    }

    setImagens((atuais) => [...atuais, ...novasUrls]);
    setEnviandoImagem(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removerImagem(index: number) {
    setImagens((atuais) => atuais.filter((_, i) => i !== index));
  }

  function moverImagem(index: number, direcao: -1 | 1) {
    setImagens((atuais) => {
      const destino = index + direcao;
      if (destino < 0 || destino >= atuais.length) return atuais;
      const copia = [...atuais];
      const temp = copia[index]!;
      copia[index] = copia[destino]!;
      copia[destino] = temp;
      return copia;
    });
  }

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
      imagens,
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
            <Label htmlFor="imagens">Fotos do produto</Label>
            <p className="text-xs text-muted-foreground">
              A primeira foto é a capa no catálogo. As demais aparecem no carrossel da página do produto.
            </p>

            {imagens.length > 0 && (
              <div className="flex flex-wrap gap-3 py-1">
                {imagens.map((url, index) => (
                  <div key={url} className="relative w-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="aspect-square w-24 rounded-md border border-border object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                        Capa
                      </span>
                    )}
                    <div className="mt-1 flex justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => moverImagem(index, -1)}
                        disabled={index === 0}
                        className="rounded border border-border px-1.5 text-xs text-muted-foreground disabled:opacity-30"
                        aria-label="Mover para a esquerda"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="rounded border border-border px-1.5 text-xs text-destructive"
                        aria-label="Remover foto"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() => moverImagem(index, 1)}
                        disabled={index === imagens.length - 1}
                        className="rounded border border-border px-1.5 text-xs text-muted-foreground disabled:opacity-30"
                        aria-label="Mover para a direita"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Input
              id="imagens"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={enviandoImagem}
            />
            {enviandoImagem && <p className="text-xs text-muted-foreground">Enviando...</p>}
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
