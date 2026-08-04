"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";

type Campo = "publicado" | "destaque" | "mais_vendido" | "lancamento" | "promocao";

export function ProdutoMarketingControls({
  produtoId,
  publicadoInicial,
  destaqueInicial,
  maisVendidoInicial,
  lancamentoInicial,
  promocaoInicial,
}: {
  produtoId: string;
  publicadoInicial: boolean;
  destaqueInicial: boolean;
  maisVendidoInicial: boolean;
  lancamentoInicial: boolean;
  promocaoInicial: boolean;
}) {
  const router = useRouter();
  const [publicado, setPublicado] = useState(publicadoInicial);
  const [destaque, setDestaque] = useState(destaqueInicial);
  const [maisVendido, setMaisVendido] = useState(maisVendidoInicial);
  const [lancamento, setLancamento] = useState(lancamentoInicial);
  const [promocao, setPromocao] = useState(promocaoInicial);
  const [salvando, setSalvando] = useState(false);

  const setters: Record<Campo, (valor: boolean) => void> = {
    publicado: setPublicado,
    destaque: setDestaque,
    mais_vendido: setMaisVendido,
    lancamento: setLancamento,
    promocao: setPromocao,
  };

  const labelSucesso: Record<Campo, string> = {
    publicado: "Visibilidade no site atualizada.",
    destaque: "Destaque atualizado.",
    mais_vendido: "Mais vendido atualizado.",
    lancamento: "Lançamento atualizado.",
    promocao: "Promoção atualizada.",
  };

  async function atualizar(campo: Campo, valor: boolean) {
    setSalvando(true);
    const supabase = createClient();
    // O client tipado do Supabase rejeita um payload de update com chave
    // computada ({ [campo]: valor }) — precisa de um objeto literal por
    // campo para bater com o tipo Partial<Produto> esperado.
    const payload: Partial<Record<Campo, boolean>> =
      campo === "publicado"
        ? { publicado: valor }
        : campo === "destaque"
          ? { destaque: valor }
          : campo === "mais_vendido"
            ? { mais_vendido: valor }
            : campo === "lancamento"
              ? { lancamento: valor }
              : { promocao: valor };
    const { error } = await supabase.from("produtos").update(payload).eq("id", produtoId);
    setSalvando(false);

    if (error) {
      toast.error("Erro ao atualizar produto", { description: error.message });
      // Reverte o estado otimista em caso de falha.
      setters[campo](!valor);
      return;
    }

    toast.success(labelSucesso[campo]);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-6">
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
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox
          checked={maisVendido}
          disabled={salvando}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            const valor = checked === true;
            setMaisVendido(valor);
            void atualizar("mais_vendido", valor);
          }}
        />
        Mais vendido
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox
          checked={lancamento}
          disabled={salvando}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            const valor = checked === true;
            setLancamento(valor);
            void atualizar("lancamento", valor);
          }}
        />
        Lançamento
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox
          checked={promocao}
          disabled={salvando}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            const valor = checked === true;
            setPromocao(valor);
            void atualizar("promocao", valor);
          }}
        />
        Promoção
      </label>
    </div>
  );
}
