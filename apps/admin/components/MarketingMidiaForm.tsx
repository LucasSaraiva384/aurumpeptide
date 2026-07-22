"use client";

import { useRef, useState, type FormEvent } from "react";
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
import { createClient } from "@/lib/supabase/client";
import type { MarketingMidia } from "@/lib/types";

const TIPOS: { valor: MarketingMidia["tipo"]; label: string }[] = [
  { valor: "banner_principal", label: "Banner principal" },
  { valor: "destaque", label: "Destaque" },
  { valor: "promocional", label: "Promocional" },
];

export function MarketingMidiaForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tipo, setTipo] = useState<MarketingMidia["tipo"]>("banner_principal");
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [ordem, setOrdem] = useState("0");
  const [ativo, setAtivo] = useState(true);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Mesma lógica de upload usada em ProdutoForm.tsx, reaproveitada aqui só
  // trocando o bucket ('marketing' em vez de 'produtos') e aceitando uma
  // única imagem por mídia em vez de uma galeria.
  async function handleUpload(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    setEnviandoImagem(true);
    const supabase = createClient();
    const extensao = file.name.split(".").pop();
    const caminho = `${crypto.randomUUID()}.${extensao}`;
    const { error } = await supabase.storage.from("marketing").upload(caminho, file);

    if (error) {
      toast.error("Erro ao enviar imagem", { description: error.message });
      setEnviandoImagem(false);
      return;
    }

    const { data } = supabase.storage.from("marketing").getPublicUrl(caminho);
    setImagemUrl(data.publicUrl);
    setEnviandoImagem(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (!imagemUrl) {
      setErro("Envie uma imagem para a mídia.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();

    const { error } = await supabase.from("marketing_midias").insert({
      tipo,
      titulo: titulo || null,
      imagem_url: imagemUrl,
      link: link || null,
      ordem: Number(ordem),
      ativo,
    });

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao salvar mídia", { description: error.message });
      return;
    }

    toast.success("Mídia criada.");
    setTitulo("");
    setLink("");
    setOrdem("0");
    setAtivo(true);
    setImagemUrl(null);
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(valor: MarketingMidia["tipo"]) => setTipo(valor)}>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((opcao) => (
                    <SelectItem key={opcao.valor} value={opcao.valor}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="link">Link (opcional)</Label>
              <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ordem">Ordem de exibição</Label>
              <Input id="ordem" type="number" min="0" value={ordem} onChange={(e) => setOrdem(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imagem">Imagem</Label>
            {imagemUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagemUrl} alt="Prévia da mídia" className="h-24 w-fit rounded-md border border-border object-cover" />
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

          <Label className="flex items-center gap-2">
            <Checkbox
              checked={ativo}
              onCheckedChange={(checked: boolean | "indeterminate") => setAtivo(checked === true)}
            />
            Ativo
          </Label>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando || enviandoImagem} className="w-fit">
            {salvando ? "Salvando..." : "Adicionar mídia"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
