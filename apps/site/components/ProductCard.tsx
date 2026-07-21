import Image from "next/image";
import Link from "next/link";
import { Card, ButtonLink } from "@aurum/ui";
import type { Produto } from "@/lib/types";
import { currencyFormatter } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";

export function ProductCard({ produto }: { produto: Produto }) {
  const detalheHref = `/produtos/${produto.id}`;

  return (
    <Card interactive className="flex h-full flex-col gap-4">
      <Link
        href={detalheHref}
        className="-mx-6 -mt-6 block overflow-hidden rounded-t-lg bg-aurum-ice/[0.04] p-5"
      >
        {produto.imagem_url ? (
          // <img>, não next/image: o domínio do Storage do Supabase varia por
          // projeto e ainda não está configurado em remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            className="aspect-[4/5] w-full rounded-md object-contain"
          />
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
        <ButtonLink
          href={buildWhatsappLink(produto.nome)}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          className="w-full"
        >
          Comprar no WhatsApp
        </ButtonLink>
      </div>
    </Card>
  );
}
