"use client";

import { useState, type FormEvent } from "react";
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
import type { Retirada } from "@/lib/types";

const SOCIOS: { valor: Retirada["socio"]; label: string }[] = [
  { valor: "lucas", label: "Lucas" },
  { valor: "vinicius", label: "Vinicius" },
];

export function RetiradaForm() {
  const router = useRouter();
  const [socio, setSocio] = useState<Retirada["socio"]>("lucas");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [observacao, setObservacao] = useState("");
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

    const { error } = await supabase.from("retiradas").insert({
      socio,
      valor: Number(valor),
      data,
      observacao: observacao || null,
    });

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao registrar retirada", { description: error.message });
      return;
    }

    toast.success("Retirada registrada.");
    setValor("");
    setObservacao("");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="socio">Sócio</Label>
              <Select value={socio} onValueChange={(valor: Retirada["socio"]) => setSocio(valor)}>
                <SelectTrigger id="socio" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIOS.map((opcao) => (
                    <SelectItem key={opcao.valor} value={opcao.valor}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Label htmlFor="observacao">Observação</Label>
            <Textarea id="observacao" value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={2} />
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Registrando..." : "Registrar retirada"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
