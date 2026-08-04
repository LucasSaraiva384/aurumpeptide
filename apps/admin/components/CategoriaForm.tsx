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
import { slugify } from "@/lib/slugify";
import type { Categoria } from "@/lib/types";

export function CategoriaForm({ categoria }: { categoria?: Categoria }) {
  const router = useRouter();
  const isEdicao = Boolean(categoria);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Enquanto o usuário não editar o slug manualmente, ele é regerado a
  // partir do nome digitado. Numa edição já existente, o slug atual não é
  // sobrescrito automaticamente (o produto pode já estar publicado com ele).
  const slugTocadoRef = useRef(Boolean(categoria?.slug));

  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [slug, setSlug] = useState(categoria?.slug ?? "");
  const [descricao, setDescricao] = useState(categoria?.descricao ?? "");
  const [imagemUrl, setImagemUrl] = useState<string | null>(categoria?.imagem_url ?? null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [ordem, setOrdem] = useState(String(categoria?.ordem ?? 0));
  const [ativo, setAtivo] = useState(categoria?.ativo ?? true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function handleNomeChange(valor: string) {
    setNome(valor);
    if (!slugTocadoRef.current) {
      setSlug(slugify(valor));
    }
  }

  function handleSlugChange(valor: string) {
    slugTocadoRef.current = true;
    setSlug(valor);
  }

  async function handleUpload(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    setEnviandoImagem(true);
    const supabase = createClient();
    const extensao = file.name.split(".").pop();
    const caminho = `${crypto.randomUUID()}.${extensao}`;
    const { error } = await supabase.storage.from("catalogo").upload(caminho, file);

    if (error) {
      toast.error("Erro ao enviar imagem", { description: error.message });
      setEnviandoImagem(false);
      return;
    }

    const { data } = supabase.storage.from("catalogo").getPublicUrl(caminho);
    setImagemUrl(data.publicUrl);
    setEnviandoImagem(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setSalvando(true);

    const supabase = createClient();
    const payload = {
      nome,
      slug: slugify(slug),
      descricao: descricao || null,
      imagem_url: imagemUrl,
      ordem: Number(ordem),
      ativo,
    };

    const { error } = isEdicao
      ? await supabase.from("categorias").update(payload).eq("id", categoria!.id)
      : await supabase.from("categorias").insert(payload);

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao salvar categoria", { description: error.message });
      return;
    }

    toast.success(isEdicao ? "Categoria atualizada." : "Categoria criada.");
    router.push("/categorias");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" required value={nome} onChange={(e) => handleNomeChange(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" required value={slug} onChange={(e) => handleSlugChange(e.target.value)} />
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imagem">Imagem</Label>
            {imagemUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagemUrl} alt="Prévia da imagem" className="h-24 w-fit rounded-md border border-border object-cover" />
            )}
            <Input
              id="imagem"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={enviandoImagem}
            />
            {enviandoImagem && <p className="text-xs text-muted-foreground">Enviando...</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ordem">Ordem de exibição</Label>
            <Input id="ordem" type="number" min="0" value={ordem} onChange={(e) => setOrdem(e.target.value)} />
          </div>

          <Label className="flex items-center gap-2">
            <Checkbox
              checked={ativo}
              onCheckedChange={(checked: boolean | "indeterminate") => setAtivo(checked === true)}
            />
            Ativa no catálogo público
          </Label>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando || enviandoImagem} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Criar categoria"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
