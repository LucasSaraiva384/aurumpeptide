"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompraForm } from "@/components/CompraForm";
import { DespesaForm } from "@/components/DespesaForm";

// Alterna entre registrar uma compra de produto (estoque, custo médio) e um
// gasto avulso sem produto associado (frete extra, material de escritório,
// marketing etc. — reaproveita o DespesaForm já usado em
// app/(dashboard)/financeiro/despesas/page.tsx, sem duplicar lógica).
// Client Component à parte porque compras/page.tsx é Server Component e
// essa alternância precisa de estado local.
export function ComprasTabs() {
  const [aba, setAba] = useState<"compra" | "gasto">("compra");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={aba === "compra" ? "default" : "outline"}
          size="sm"
          onClick={() => setAba("compra")}
        >
          Compra de produto
        </Button>
        <Button
          type="button"
          variant={aba === "gasto" ? "default" : "outline"}
          size="sm"
          onClick={() => setAba("gasto")}
        >
          Outro gasto (frete avulso, material, etc.)
        </Button>
      </div>

      {aba === "compra" ? <CompraForm /> : <DespesaForm />}
    </div>
  );
}
