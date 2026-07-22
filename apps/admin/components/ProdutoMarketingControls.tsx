"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";

export function ProdutoMarketingControls({
  produtoId,
  publicadoInicial,
  destaqueInicial,
}: {
  produtoId: string;
  publicadoInicial: boolean;
  destaqueInicial: boolean;
}) {
  const router = useRouter();
  const [publicado, setPublicado] = useState(publicadoInicial);
  const [destaque, setDestaque] = useState(destaqueInicial);
  const [salvando, setSalvando] = useState(false);

  async function atualizar(campo: "publicado" | "destaque", valor: boolean) {
    setSalvando(true);
    const supabase = createClient();
    const payload = campo === "publicado" ? { publicado: valor } : { destaque: valor };
    const { error } = await supabase.from("produtos").update(payload).eq("id", produtoId);
    setSalvando(false);

    if (error) {
      toast.error("Erro ao atualizar produto", { description: error.message });
      // Reverte o estado otimista em caso de falha.
      if (campo === "publicado") setPublicado(!valor);
      else setDestaque(!valor);
      return;
    }

    toast.success(campo === "publicado" ? "Visibilidade no site atualizada." : "Destaque atualizado.");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Switch
          checked={publicado}
          disabled={salvando}
          onCheckedChange={(checked: boolean) => {
            setPublicado(checked);
            void atualizar("publicado", checked);
          }}
        />
        Publicado no site
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox
          checked={destaque}
          disabled={salvando}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            const valor = checked === true;
            setDestaque(valor);
            void atualizar("destaque", valor);
          }}
        />
        Destaque
      </label>
    </div>
  );
}
