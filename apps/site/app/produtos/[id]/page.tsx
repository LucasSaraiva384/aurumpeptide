import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, ButtonLink } from "@aurum/ui";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { currencyFormatter } from "@/lib/format";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    return (
      <Container className="py-16 text-center">
        <p className="text-sm text-aurum-gold">
          Catálogo ainda não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e
          NEXT_PUBLIC_SUPABASE_ANON_KEY em apps/site/.env.local.
        </p>
      </Container>
    );
  }

  const { data: produto, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, categoria, imagem_url, estoque_atual, ativo")
    .eq("id", id)
    .eq("ativo", true)
    .maybeSingle()
    .returns<Produto>();

  if (error || !produto) {
    notFound();
  }

  return (
    <Container className="py-16">
      <Link
        href="/#catalogo"
        className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-aurum-ice/60 transition-colors hover:text-aurum-gold"
      >
        <span aria-hidden>←</span>
        Voltar ao catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        {produto.imagem_url ? (
          // <img>, não next/image: o domínio do Storage do Supabase varia por
          // projeto e ainda não está configurado em remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            className="aspect-[4/5] w-full rounded-lg bg-aurum-ice/[0.04] object-contain p-8"
          />
        ) : (
          <div className="relative aspect-[4/5] w-full rounded-lg bg-aurum-emerald/30">
            <Image
              src="/logo-oficial.png"
              alt=""
              fill
              className="object-contain p-16 opacity-10 mix-blend-screen"
            />
          </div>
        )}

        <div className="flex flex-col gap-5">
          {produto.categoria && <Badge className="w-fit">{produto.categoria}</Badge>}
          <h1 className="font-heading text-3xl leading-tight text-aurum-ice sm:text-4xl">
            {produto.nome}
          </h1>
          {produto.descricao && (
            <p className="leading-relaxed text-aurum-ice/80">{produto.descricao}</p>
          )}
          <p className="font-heading text-2xl text-aurum-gold">
            {currencyFormatter.format(produto.preco)}
          </p>
          <ButtonLink
            href={buildWhatsappLink(produto.nome)}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="mt-2 w-fit"
          >
            Comprar no WhatsApp
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
