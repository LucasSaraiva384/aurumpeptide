"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types";

type TabelaComId = keyof Database["public"]["Tables"];

export function DeleteButton({
  tabela,
  id,
  confirmMessage = "Tem certeza que deseja excluir?",
}: {
  tabela: TabelaComId;
  id: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function handleConfirm() {
    setExcluindo(true);
    const supabase = createClient();
    const { error } = await (supabase.from(tabela) as any).delete().eq("id", id);
    setExcluindo(false);
    setOpen(false);

    if (error) {
      toast.error("Erro ao excluir", { description: error.message });
      return;
    }

    toast.success("Registro excluído.");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>{confirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={excluindo}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={excluindo}>
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
