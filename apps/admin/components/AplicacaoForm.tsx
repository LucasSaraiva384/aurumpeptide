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
import type { Aplicacao } from "@/lib/types";

export function AplicacaoForm({ aplicacao }: { aplicacao?: Aplicacao }) {
  const router = useRouter();
  const isEdicao = Boolean(aplicacao);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Enquanto o usuário não editar o slug manualmente, ele é regerado a
  // partir do nome digitado. Numa edição já existente, o slug atual não é
  // sobrescrito automaticamente (a aplicação pode já estar publicada com ele).
  const slugTocadoRef = useRef(Boolean(aplicacao?.slug));

  const [nome, setNome] = useState(aplicacao?.nome ?? "");
  const [slug, setSlug] = useState(aplicacao?.slug ?? "");
  const [descricao, setDescricao] = useState(aplicacao?.descricao ?? "");
  const [imagemUrl, setImagemUrl] = useState<string | null>(aplicacao?.imagem_url ?? null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [ordem, setOrdem] = useState(String(aplicacao?.ordem ?? 0));
  const [ativo, setAtivo] = useState(aplicacao?.ativo ?? true);
  const [seoTitle, setSeoTitle] = useState(aplicacao?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(aplicacao?.seo_description ?? "");
  const [seoCanonical, setSeoCanonical] = useState(aplicacao?.seo_canonical ?? "");
  const [seoOgImage, setSeoOgImage] = useState(aplicacao?.seo_og_image ?? "");
  const [seoRobots, setSeoRobots] = useState(aplicacao?.seo_robots ?? "");
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
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      seo_canonical: seoCanonical || null,
      seo_og_image: seoOgImage || null,
      seo_robots: seoRobots || null,
    };

    const { error } = isEdicao
      ? await supabase.from("aplicacoes").update(payload).eq("id", aplicacao!.id)
      : await supabase.from("aplicacoes").insert(payload);

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao salvar aplicação", { description: error.message });
      return;
    }

    toast.success(isEdicao ? "Aplicação atualizada." : "Aplicação criada.");
    router.push("/aplicacoes");
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

          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div>
              <h3 className="font-heading text-base text-foreground">SEO</h3>
              <p className="text-xs text-muted-foreground">
                Todos os campos abaixo são opcionais — deixe em branco para gerar automaticamente
                a partir do nome e da descrição da aplicação.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoTitle">Título (SEO)</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={nome || "Gerado a partir do nome da aplicação"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoDescription">Meta descrição</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Gerada a partir da descrição da aplicação"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seoCanonical">URL canônica</Label>
                <Input
                  id="seoCanonical"
                  value={seoCanonical}
                  onChange={(e) => setSeoCanonical(e.target.value)}
                  placeholder="Gerada a partir do slug da aplicação"
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
              <Label htmlFor="seoOgImage">Imagem para compartilhamento (Open Graph)</Label>
              <Input
                id="seoOgImage"
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder="URL da imagem — usa a imagem da aplicação por padrão"
              />
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando || enviandoImagem} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Criar aplicação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
