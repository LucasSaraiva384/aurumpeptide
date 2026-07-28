"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types";

type TabelaComId = keyof Database["public"]["Tables"];

// Botão de exclusão genérico com confirmação (AlertDialog) — usado por
// pedidos, compras e clientes. Diferente de components/DeleteButton.tsx
// (usado só por produtos), este aceita uma descrição rica do que vai ser
// revertido (estoque/financeiro) e um mapeamento opcional de erro, usado
// por clientes para trocar a violação de FK crua por uma mensagem amigável.
export function ExcluirButton({
  tabela,
  id,
  titulo = "Confirmar exclusão",
  descricao,
  mensagensErro,
}: {
  tabela: TabelaComId;
  id: string;
  titulo?: string;
  descricao: string;
  // Mapa código de erro Postgres -> mensagem amigável. Um objeto simples
  // (em vez de uma função) porque este componente é "use client" e recebe
  // props de Server Components — funções não podem atravessar essa
  // fronteira, só valores serializáveis.
  mensagensErro?: Record<string, string>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
    // O AlertDialog fecha sozinho ao clicar em Action — bloqueamos isso
    // para poder manter o diálogo aberto se o delete falhar (ex.: cliente
    // com pedidos vinculados) e só fechar manualmente no sucesso.
    event.preventDefault();

    setExcluindo(true);
    const supabase = createClient();
    const { error } = await (supabase.from(tabela) as any).delete().eq("id", id);
    setExcluindo(false);

    if (error) {
      const mensagem = (error.code && mensagensErro?.[error.code]) ?? error.message;
      toast.error("Erro ao excluir", { description: mensagem });
      return;
    }

    setOpen(false);
    toast.success("Registro excluído.");
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={excluindo} onClick={handleConfirm}>
            {excluindo ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
