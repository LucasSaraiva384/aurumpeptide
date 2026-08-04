"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { normalizarBusca } from "@/lib/busca";
import type { BuscaEntidadeItem, BuscaIndice, BuscaProdutoItem } from "@/lib/busca";
import { currencyFormatter } from "@/lib/format";

const STORAGE_KEY = "aurum:buscas-recentes";
const DEBOUNCE_MS = 200;

/** Leitura defensiva do localStorage (mecanismo pronto para quando algo
 * passar a gravar buscas — hoje nada grava, então começa sempre vazio). */
function lerBuscasRecentes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return [];
    const valor: unknown = JSON.parse(bruto);
    return Array.isArray(valor) ? valor.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

// Leitura de localStorage exposta via useSyncExternalStore (não useEffect +
// setState): é a forma recomendada pelo React de ler um sistema externo
// sem causar mismatch de hidratação — `getServerSnapshot` mantém o SSR
// sempre vazio, `getSnapshot` só lê o localStorage uma vez no cliente e
// cacheia a referência (nada mais escreve em STORAGE_KEY hoje, então o
// cache nunca precisa ser invalidado).
const semInscricaoExterna = () => () => {};
let buscasRecentesCache: string[] | null = null;
function getBuscasRecentesSnapshot(): string[] {
  if (buscasRecentesCache === null) {
    buscasRecentesCache = lerBuscasRecentes();
  }
  return buscasRecentesCache;
}
function getBuscasRecentesServerSnapshot(): string[] {
  return [];
}

type Resultados = {
  produtos: BuscaProdutoItem[];
  categorias: BuscaEntidadeItem[];
  marcas: BuscaEntidadeItem[];
  aplicacoes: BuscaEntidadeItem[];
};

const RESULTADOS_VAZIOS: Resultados = { produtos: [], categorias: [], marcas: [], aplicacoes: [] };
const LIMITE_POR_SECAO = 6;

/**
 * Busca instantânea do Header: no primeiro foco, faz um único
 * `fetch('/api/busca')` e guarda o índice em estado — toda digitação
 * seguinte só filtra esse índice em memória (com debounce leve), sem nova
 * requisição. Catálogo pequeno, então não precisa de infra de busca dedicada.
 */
export function SearchBox() {
  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState("");
  const [termoDebounced, setTermoDebounced] = useState("");
  const [indice, setIndice] = useState<BuscaIndice | null>(null);
  const [carregando, setCarregando] = useState(false);
  const buscasRecentes = useSyncExternalStore(
    semInscricaoExterna,
    getBuscasRecentesSnapshot,
    getBuscasRecentesServerSnapshot,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTermoDebounced(termo), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [termo]);

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  function handleFocus() {
    setAberto(true);
    if (indice || carregando) return;

    setCarregando(true);
    fetch("/api/busca")
      .then((res) => (res.ok ? (res.json() as Promise<BuscaIndice>) : Promise.reject(new Error("falha"))))
      .then((data) => setIndice(data))
      .catch(() => setIndice(RESULTADOS_VAZIOS))
      .finally(() => setCarregando(false));
  }

  function fechar() {
    setAberto(false);
  }

  const populares = useMemo(() => {
    if (!indice) return [];
    const maisVendidos = indice.produtos.filter((produto) => produto.mais_vendido);
    const base = maisVendidos.length > 0 ? maisVendidos : indice.produtos.filter((produto) => produto.destaque);
    return base.slice(0, 5);
  }, [indice]);

  const digitando = termoDebounced.trim().length > 0;

  const resultados = useMemo<Resultados>(() => {
    const alvo = normalizarBusca(termoDebounced.trim());
    if (!alvo || !indice) return RESULTADOS_VAZIOS;

    const contem = (texto: string | null) => Boolean(texto && normalizarBusca(texto).includes(alvo));

    const produtos = indice.produtos
      .filter(
        (produto) =>
          contem(produto.nome) ||
          contem(produto.categoria) ||
          contem(produto.marca) ||
          contem(produto.descricao) ||
          contem(produto.slug) ||
          produto.aplicacoes.some((aplicacao) => contem(aplicacao)) ||
          produto.keywords.some((keyword) => contem(keyword)),
      )
      .slice(0, 8);

    const categorias = indice.categorias.filter((categoria) => contem(categoria.nome)).slice(0, LIMITE_POR_SECAO);
    const marcas = indice.marcas.filter((marca) => contem(marca.nome)).slice(0, LIMITE_POR_SECAO);
    const aplicacoes = indice.aplicacoes.filter((aplicacao) => contem(aplicacao.nome)).slice(0, LIMITE_POR_SECAO);

    return { produtos, categorias, marcas, aplicacoes };
  }, [termoDebounced, indice]);

  const semResultado =
    digitando &&
    !carregando &&
    resultados.produtos.length === 0 &&
    resultados.categorias.length === 0 &&
    resultados.marcas.length === 0 &&
    resultados.aplicacoes.length === 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-[9.5rem] sm:max-w-[13rem]">
      <label htmlFor="busca-header" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="busca-header"
        type="search"
        value={termo}
        onFocus={handleFocus}
        onChange={(event) => setTermo(event.target.value)}
        placeholder="Buscar..."
        autoComplete="off"
        className="w-full rounded-full border border-aurum-gold/20 bg-aurum-green-deep/60 px-4 py-2 text-xs text-aurum-ice placeholder:text-aurum-ice/40 outline-none transition-colors focus:border-aurum-gold/50"
      />

      {aberto && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 max-h-[70vh] w-[min(90vw,22rem)] overflow-y-auto rounded-lg border border-aurum-gold/15 bg-aurum-green-deep/95 p-4 text-left shadow-xl backdrop-blur-md">
          {carregando && <p className="py-4 text-center text-xs text-aurum-ice/50">Carregando…</p>}

          {!carregando && !digitando && (
            <div className="flex flex-col gap-5">
              {buscasRecentes.length > 0 && (
                <Secao titulo="Pesquisas recentes">
                  {buscasRecentes.map((busca) => (
                    <LinkResultado key={busca} href={`/produtos?q=${encodeURIComponent(busca)}`} onClick={fechar}>
                      {busca}
                    </LinkResultado>
                  ))}
                </Secao>
              )}

              {populares.length > 0 && (
                <Secao titulo="Populares">
                  {populares.map((produto) => (
                    <ResultadoProduto key={produto.id} produto={produto} onClick={fechar} />
                  ))}
                </Secao>
              )}

              {indice && indice.categorias.length > 0 && (
                <Secao titulo="Categorias">
                  {indice.categorias.slice(0, LIMITE_POR_SECAO).map((categoria) => (
                    <LinkResultado
                      key={categoria.slug}
                      href={`/produtos?categoria=${categoria.slug}`}
                      onClick={fechar}
                    >
                      {categoria.nome}
                    </LinkResultado>
                  ))}
                </Secao>
              )}

              {indice && indice.marcas.length > 0 && (
                <Secao titulo="Marcas">
                  {indice.marcas.slice(0, LIMITE_POR_SECAO).map((marca) => (
                    <LinkResultado key={marca.slug} href={`/produtos?marca=${marca.slug}`} onClick={fechar}>
                      {marca.nome}
                    </LinkResultado>
                  ))}
                </Secao>
              )}
            </div>
          )}

          {!carregando && digitando && (
            <div className="flex flex-col gap-5">
              {resultados.produtos.length > 0 && (
                <Secao titulo="Produtos">
                  {resultados.produtos.map((produto) => (
                    <ResultadoProduto key={produto.id} produto={produto} onClick={fechar} />
                  ))}
                </Secao>
              )}
              {resultados.categorias.length > 0 && (
                <Secao titulo="Categorias">
                  {resultados.categorias.map((categoria) => (
                    <LinkResultado
                      key={categoria.slug}
                      href={`/produtos?categoria=${categoria.slug}`}
                      onClick={fechar}
                    >
                      {categoria.nome}
                    </LinkResultado>
                  ))}
                </Secao>
              )}
              {resultados.marcas.length > 0 && (
                <Secao titulo="Marcas">
                  {resultados.marcas.map((marca) => (
                    <LinkResultado key={marca.slug} href={`/produtos?marca=${marca.slug}`} onClick={fechar}>
                      {marca.nome}
                    </LinkResultado>
                  ))}
                </Secao>
              )}
              {resultados.aplicacoes.length > 0 && (
                <Secao titulo="Objetivos">
                  {resultados.aplicacoes.map((aplicacao) => (
                    <LinkResultado
                      key={aplicacao.slug}
                      href={`/produtos?aplicacao=${aplicacao.slug}`}
                      onClick={fechar}
                    >
                      {aplicacao.nome}
                    </LinkResultado>
                  ))}
                </Secao>
              )}
              {semResultado && (
                <p className="py-4 text-center text-xs text-aurum-ice/50">
                  Nenhum resultado para &ldquo;{termoDebounced}&rdquo;.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="px-2 text-[0.65rem] uppercase tracking-[0.2em] text-aurum-gold/70">{titulo}</h4>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function LinkResultado({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block truncate rounded-md px-2 py-1.5 text-sm text-aurum-ice/80 transition-colors hover:bg-aurum-ice/5 hover:text-aurum-gold"
    >
      {children}
    </Link>
  );
}

function ResultadoProduto({ produto, onClick }: { produto: BuscaProdutoItem; onClick: () => void }) {
  return (
    <Link
      href={`/produtos/${produto.slug}`}
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-aurum-ice/5"
    >
      <span className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-aurum-ice/[0.04]">
        {produto.imagem && <Image src={produto.imagem} alt="" fill sizes="40px" className="object-contain" />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm text-aurum-ice/90">{produto.nome}</span>
        <span className="text-xs text-aurum-gold">{currencyFormatter.format(produto.preco)}</span>
      </span>
    </Link>
  );
}
