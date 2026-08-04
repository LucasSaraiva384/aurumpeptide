import type { Produto } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

/** Grid flat de produtos, sem agrupamento por categoria (isso era só o que
 * `ProductCatalog` fazia para a Home antiga) — usado por `/produtos`,
 * `/aplicacoes/[slug]` e pelas seções da Home. */
export function ProductGrid({ produtos }: { produtos: Produto[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
