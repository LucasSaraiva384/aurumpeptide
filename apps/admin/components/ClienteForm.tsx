"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Cliente } from "@/lib/types";

// Só nome/whatsapp/cidade são editáveis aqui — valor_total_gasto,
// primeira_compra_em e ultima_compra_em são 100% automáticos (recalculados
// por recompute_cliente_estatisticas em supabase/edicoes.sql sempre que um
// pedido do cliente é criado/editado) e nunca aparecem neste formulário.
export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const isEdicao = Boolean(cliente);

  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [whatsapp, setWhatsapp] = useState(cliente?.whatsapp ?? "");
  const [cidade, setCidade] = useState(cliente?.cidade ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    setSalvando(true);
    const supabase = createClient();
    const payload = {
      nome: nome.trim(),
      whatsapp: whatsapp.trim() || null,
      cidade: cidade.trim() || null,
    };

    const { error } = isEdicao
      ? await supabase.from("clientes").update(payload).eq("id", cliente!.id)
      : await supabase.from("clientes").insert(payload);

    setSalvando(false);

    if (error) {
      setErro(error.message);
      toast.error("Erro ao salvar cliente", { description: error.message });
      return;
    }

    toast.success(isEdicao ? "Cliente atualizado." : "Cliente cadastrado.");
    router.push("/clientes");
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" disabled={salvando} className="w-fit">
            {salvando ? "Salvando..." : isEdicao ? "Salvar alterações" : "Cadastrar cliente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
