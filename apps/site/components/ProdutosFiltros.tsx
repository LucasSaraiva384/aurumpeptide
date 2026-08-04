"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Aplicacao, Categoria, Marca } from "@/lib/types";

const ORDENACOES: Array<{ value: string; label: string }> = [
  { value: "recentes", label: "Mais recentes" },
  { value: "vendidos", label: "Mais vendidos" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "alfabetica", label: "Ordem alfabética" },
];

function parseCsv(valor: string | null): string[] {
  return valor ? valor.split(",").filter(Boolean) : [];
}

/**
 * Filtros de `/produtos`: a URL é a única fonte de verdade (lê via
 * `useSearchParams`, escreve via `router.push`) — sem estado React
 * duplicado, garante SSR correto e URLs compartilháveis/recarregáveis já
 * filtradas. Facets multi-valor (categoria/marca/aplicação) viram um único
 * param CSV (ex.: `?categoria=performance,emagrecimento`).
 */
export function ProdutosFiltros({
  categorias,
  marcas,
  aplicacoes,
}: {
  categorias: Categoria[];
  marcas: Marca[];
  aplicacoes: Aplicacao[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoriasAtivas = useMemo(() => parseCsv(searchParams.get("categoria")), [searchParams]);
  const marcasAtivas = useMemo(() => parseCsv(searchParams.get("marca")), [searchParams]);
  const aplicacoesAtivas = useMemo(() => parseCsv(searchParams.get("aplicacao")), [searchParams]);
  const precoMin = searchParams.get("precoMin") ?? "";
  const precoMax = searchParams.get("precoMax") ?? "";
  const ordenar = searchParams.get("ordenar") ?? "recentes";
  const emEstoque = searchParams.get("disponibilidade") === "em-estoque";

  const temFiltroAtivo =
    categoriasAtivas.length > 0 ||
    marcasAtivas.length > 0 ||
    aplicacoesAtivas.length > 0 ||
    Boolean(precoMin) ||
    Boolean(precoMax) ||
    ordenar !== "recentes" ||
    emEstoque;

  const atualizarParam = useCallback(
    (chave: string, valor: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor === null || valor === "") {
        params.delete(chave);
      } else {
        params.set(chave, valor);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const alternarFacet = useCallback(
    (chave: "categoria" | "marca" | "aplicacao", slug: string, ativos: string[]) => {
      const novo = ativos.includes(slug) ? ativos.filter((item) => item !== slug) : [...ativos, slug];
      atualizarParam(chave, novo.length > 0 ? novo.join(",") : null);
    },
    [atualizarParam],
  );

  function limparFiltros() {
    router.push(pathname, { scroll: false });
  }

  return (
    <aside className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-aurum-ice">Filtrar</h2>
        {temFiltroAtivo && (
          <button
            type="button"
            onClick={limparFiltros}
            className="text-xs uppercase tracking-[0.15em] text-aurum-gold/80 transition-colors hover:text-aurum-gold"
          >
            Limpar
          </button>
        )}
      </div>

      <FiltroLista
        titulo="Categorias"
        itens={categorias}
        ativos={categoriasAtivas}
        onToggle={(slug) => alternarFacet("categoria", slug, categoriasAtivas)}
      />
      <FiltroLista
        titulo="Marcas"
        itens={marcas}
        ativos={marcasAtivas}
        onToggle={(slug) => alternarFacet("marca", slug, marcasAtivas)}
      />
      <FiltroLista
        titulo="Objetivos"
        itens={aplicacoes}
        ativos={aplicacoesAtivas}
        onToggle={(slug) => alternarFacet("aplicacao", slug, aplicacoesAtivas)}
      />

      <div className="flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-[0.2em] text-aurum-gold">Preço</h3>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="preco-min">
            Preço mínimo
          </label>
          <input
            id="preco-min"
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="Mín."
            defaultValue={precoMin}
            onBlur={(event) => atualizarParam("precoMin", event.target.value || null)}
            className="w-full rounded-md border border-aurum-gold/20 bg-aurum-green-deep/60 px-3 py-2 text-sm text-aurum-ice outline-none transition-colors focus:border-aurum-gold/50"
          />
          <span aria-hidden className="text-aurum-ice/40">
            —
          </span>
          <label className="sr-only" htmlFor="preco-max">
            Preço máximo
          </label>
          <input
            id="preco-max"
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="Máx."
            defaultValue={precoMax}
            onBlur={(event) => atualizarParam("precoMax", event.target.value || null)}
            className="w-full rounded-md border border-aurum-gold/20 bg-aurum-green-deep/60 px-3 py-2 text-sm text-aurum-ice outline-none transition-colors focus:border-aurum-gold/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs uppercase tracking-[0.2em] text-aurum-gold" htmlFor="ordenar">
          Ordenar por
        </label>
        <select
          id="ordenar"
          value={ordenar}
          onChange={(event) =>
            atualizarParam("ordenar", event.target.value === "recentes" ? null : event.target.value)
          }
          className="w-full rounded-md border border-aurum-gold/20 bg-aurum-green-deep/60 px-3 py-2 text-sm text-aurum-ice outline-none transition-colors focus:border-aurum-gold/50"
        >
          {ORDENACOES.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-aurum-ice/80">
        <input
          type="checkbox"
          checked={emEstoque}
          onChange={(event) => atualizarParam("disponibilidade", event.target.checked ? "em-estoque" : null)}
          className="h-4 w-4 rounded border-aurum-gold/30 bg-transparent accent-aurum-gold"
        />
        Somente em estoque
      </label>
    </aside>
  );
}

function FiltroLista({
  titulo,
  itens,
  ativos,
  onToggle,
}: {
  titulo: string;
  itens: Array<{ id: string; nome: string; slug: string }>;
  ativos: string[];
  onToggle: (slug: string) => void;
}) {
  if (itens.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-[0.2em] text-aurum-gold">{titulo}</h3>
      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li key={item.id}>
            <label className="flex items-center gap-2 text-sm text-aurum-ice/80">
              <input
                type="checkbox"
                checked={ativos.includes(item.slug)}
                onChange={() => onToggle(item.slug)}
                className="h-4 w-4 rounded border-aurum-gold/30 bg-transparent accent-aurum-gold"
              />
              {item.nome}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
