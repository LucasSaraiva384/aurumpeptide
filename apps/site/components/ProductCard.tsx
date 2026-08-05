import Image from "next/image";
import Link from "next/link";
import { Card } from "@aurum/ui";
import type { Produto } from "@/lib/types";
import { currencyFormatter } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { buildProductSlug } from "@/lib/seo";
import { WhatsappButtonLink } from "@/components/WhatsappButtonLink";

export function ProductCard({ produto }: { produto: Produto }) {
  const detalheHref = `/produtos/${buildProductSlug(produto)}`;
  const capa = produto.imagens[0] ?? produto.imagem_url;

  return (
    <Card interactive className="flex h-full flex-col gap-4">
      <Link
        href={detalheHref}
        className="-mx-6 -mt-6 block overflow-hidden rounded-t-lg bg-aurum-ice/[0.04] p-5"
      >
        {capa ? (
          <div className="relative aspect-[4/5] w-full rounded-md">
            <Image
              src={capa}
              alt={produto.nome}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
              className="rounded-md object-contain"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/5] w-full rounded-md bg-aurum-emerald/30">
            <Image
              src="/logo-oficial.png"
              alt=""
              fill
              className="object-contain p-10 opacity-10 mix-blend-screen"
            />
          </div>
        )}
      </Link>

      <Link href={detalheHref} className="flex flex-col gap-2">
        <h2 className="font-heading text-lg text-aurum-ice">{produto.nome}</h2>
      </Link>

      <div className="mt-auto flex flex-col gap-3 pt-1">
        <p className="font-heading text-xl text-aurum-gold">
          {currencyFormatter.format(produto.preco)}
        </p>
        <WhatsappButtonLink
          origem="product-card"
          produtoNome={produto.nome}
          href={buildWhatsappLink(produto.nome)}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          className="w-full"
        >
          Comprar no WhatsApp
        </WhatsappButtonLink>
      </div>
    </Card>
  );
}
