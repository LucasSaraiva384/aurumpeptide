"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
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
import type { Aplicacao, Categoria, Marca, Produto } from "@/lib/types";

// Radix Select não aceita value="" em SelectItem — usamos este sentinel
// para representar "nenhuma categoria/marca selecionada" e convertemos
// de volta para null no submit.
const SEM_SELECAO = "none";

export function ProdutoForm({
  produto,
  categorias,
  marcas,
  aplicacoes,
  aplicacaoIdsIniciais,
}: {
  produto?: Produto;
  categorias: Categoria[];
  marcas: Marca[];
  aplicacoes: Aplicacao[];
  aplicacaoIdsIniciais?: string[];
}) {
  const router = useRouter();
  const isEdicao = Boolean(produto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [categoriaId, setCategoriaId] = useState(produto?.categoria_id ?? SEM_SELECAO);
  const [marcaId, setMarcaId] = useState(produto?.marca_id ?? SEM_SELECAO);
  const [aplicacaoIds, setAplicacaoIds] = useState<string[]>(aplicacaoIdsIniciais ?? []);
  const [keywords, setKeywords] = useState((produto?.keywords ?? []).join(", "));
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? []);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [estoqueAtual, setEstoqueAtual] = useState(String(produto?.estoque_atual ?? 0));
  const [estoqueMinimo, setEstoqueMinimo] = useState(String(produto?.estoque_minimo ?? 0));
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [maisVendido, setMaisVendido] = useState(produto?.mais_vendido ?? false);
  const [lancamento, setLancamento] = useState(produto?.lancamento ?? false);
  const [promocao, setPromocao] = useState(produto?.promocao ?? false);
  const [seoTitle, setSeoTitle] = useState(produto?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(produto?.seo_description ?? "");
  const [seoSlug, setSeoSlug] = useState(produto?.seo_slug ?? "");
  const [seoCanonical, setSeoCanonical] = useState(produto?.seo_canonical ?? "");
  const [seoOgImage, setSeoOgImage] = useState(produto?.seo_og_image ?? "");
  const [seoRobots, setSeoRobots] = useState(produto?.seo_robots ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function toggleAplicacao(id: string, marcado: boolean) {
    setAplicacaoIds((atuais) => (marcado ? [...atuais, id] : atuais.filter((atual) => atual !== id)));
  }

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
    // categoria (texto livre legado) fica de fora do payload novo — não é
    // mais escrita a partir daqui, só categoria_id. A coluna continua no
    // banco intacta para produtos antigos que ainda não têm categoria_id.
    const payload = {
      nome,
      descricao: descricao || null,
      preco: Number(preco),
      categoria_id: categoriaId === SEM_SELECAO ? null : categoriaId,
      marca_id: marcaId === SEM_SELECAO ? null : marcaId,
      keywords: keywords
        .split(",")
        .map((termo) => termo.trim())
        .filter((termo) => termo.length > 0),
      imagens,
      estoque_atual: Number(estoqueAtual),
      estoque_minimo: Number(estoqueMinimo),
      ativo,
      destaque,
      mais_vendido: maisVendido,
      lancamento,
      promocao,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      seo_slug: seoSlug || null,
      seo_canonical: seoCanonical || null,
      seo_og_image: seoOgImage || null,
      seo_robots: seoRobots || null,
    };

    let produtoId = produto?.id;

    if (isEdicao) {
      const { error } = await supabase.from("produtos").update(payload).eq("id", produto!.id);
      if (error) {
        setSalvando(false);
        setErro(error.message);
        toast.error("Erro ao salvar produto", { description: error.message });
        return;
      }
    } else {
      const { data, error } = await supabase.from("produtos").insert(payload).select("id").single();
      if (error || !data) {
        setSalvando(false);
        setErro(error?.message ?? "Erro ao criar produto.");
        toast.error("Erro ao salvar produto", { description: error?.message });
        return;
      }
      produtoId = data.id;
    }

    // Sincroniza produto_aplicacoes: remove os vínculos atuais e recria a
    // partir da seleção corrente. Simples e correto mesmo sem diffing fino,
    // já que o volume de aplicações por produto é pequeno.
    if (produtoId) {
      const { error: erroDelete } = await supabase.from("produto_aplicacoes").delete().eq("produto_id", produtoId);
      if (erroDelete) {
        setSalvando(false);
        setErro(erroDelete.message);
        toast.error("Erro ao salvar aplicações do produto", { description: erroDelete.message });
        return;
      }

      if (aplicacaoIds.length > 0) {
        const { error: erroInsert } = await supabase
          .from("produto_aplicacoes")
          .insert(aplicacaoIds.map((aplicacaoId) => ({ produto_id: produtoId!, aplicacao_id: aplicacaoId })));
        if (erroInsert) {
          setSalvando(false);
          setErro(erroInsert.message);
          toast.error("Erro ao salvar aplicações do produto", { description: erroInsert.message });
          return;
        }
      }
    }

    setSalvando(false);
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
              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger id="categoria" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SEM_SELECAO}>Sem categoria</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="marca">Marca</Label>
              <Select value={marcaId} onValueChange={setMarcaId}>
                <SelectTrigger id="marca" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SEM_SELECAO}>Sem marca</SelectItem>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id}>
                      {marca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="separadas por vírgula"
              />
            </div>
          </div>

          {aplicacoes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Aplicações</Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3 sm:grid-cols-3">
                {aplicacoes.map((aplicacao) => (
                  <label key={aplicacao.id} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={aplicacaoIds.includes(aplicacao.id)}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        toggleAplicacao(aplicacao.id, checked === true)
                      }
                    />
                    {aplicacao.nome}
                  </label>
                ))}
              </div>
            </div>
          )}

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

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <h3 className="font-heading text-base text-foreground">Vitrine</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={destaque}
                  onCheckedChange={(checked: boolean | "indeterminate") => setDestaque(checked === true)}
                />
                Destaque
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={maisVendido}
                  onCheckedChange={(checked: boolean | "indeterminate") => setMaisVendido(checked === true)}
                />
                Mais vendido
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={lancamento}
                  onCheckedChange={(checked: boolean | "indeterminate") => setLancamento(checked === true)}
                />
                Lançamento
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={promocao}
                  onCheckedChange={(checked: boolean | "indeterminate") => setPromocao(checked === true)}
                />
                Promoção
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div>
              <h3 className="font-heading text-base text-foreground">SEO</h3>
              <p className="text-xs text-muted-foreground">
                Todos os campos abaixo são opcionais — deixe em branco para gerar automaticamente
                a partir do nome, descrição e categoria do produto.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoTitle">Título (SEO)</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={nome || "Gerado a partir do nome do produto"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoDescription">Meta descrição</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Gerada a partir da descrição do produto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seoSlug">Slug (URL)</Label>
                <Input
                  id="seoSlug"
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                  placeholder="Gerado a partir do nome + id"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seoRobots">Meta robots</Label>
                <Input
                  id="seoRobots"
                  value={seoRobots}
                  onChange={(e) => setSeoRobots(e.target.value)}
                  placeholder="index,follow"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoCanonical">URL canônica</Label>
              <Input
                id="seoCanonical"
                value={seoCanonical}
                onChange={(e) => setSeoCanonical(e.target.value)}
                placeholder="Gerada a partir do slug do produto"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoOgImage">Imagem para compartilhamento (Open Graph)</Label>
              <Input
                id="seoOgImage"
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder="URL da imagem — usa a primeira foto do produto por padrão"
              />
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Criar produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
