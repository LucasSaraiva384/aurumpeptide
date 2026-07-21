import { Divider } from "@aurum/ui";
import type { Produto } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ProductCatalog({ groups }: { groups: Array<[string, Produto[]]> }) {
  return (
    <div className="flex flex-col gap-16">
      {groups.map(([categoria, produtos], index) => (
        <ScrollReveal key={categoria} delay={Math.min(index, 3) * 0.08}>
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h3 className="whitespace-nowrap font-heading text-2xl text-aurum-ice">{categoria}</h3>
              <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      ))}
    </div>
  );
}
