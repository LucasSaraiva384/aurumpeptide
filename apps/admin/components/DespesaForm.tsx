"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

const CATEGORIAS_SUGERIDAS = ["Fornecedores", "Marketing", "Frete", "Embalagens", "Impostos", "Outro"];

export function DespesaForm() {
  const router = useRouter();
  const [categoria, setCategoria] = useState(CATEGORIAS_SUGERIDAS[0]!);
  const [valor, setValor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (Number(valor) <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();

    const { error } = await supabase.from("transacoes").insert({
      tipo: "despesa",
      categoria,
      valor: Number(valor),
      data,
      descricao: descricao || null,
    });

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao registrar despesa", { description: error.message });
      return;
    }

    toast.success("Despesa registrada.");
    setValor("");
    setDescricao("");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                list="categorias-despesa"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
              <datalist id="categorias-despesa">
                {CATEGORIAS_SUGERIDAS.map((opcao) => (
                  <option key={opcao} value={opcao} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                required
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} />
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Registrando..." : "Registrar despesa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
