import type { Metadata } from "next";
import Image from "next/image";
import { Container, ButtonLink } from "@aurum/ui";

// Página de destino dos anúncios do Meta. O Meta não aceita chat.whatsapp.com
// (nem redirecionamento para ele) como destino de anúncio de site, então o
// anúncio cai aqui e a pessoa entra no grupo pelo botão.
const CONVITE_GRUPO_VIP = "https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb";

export const metadata: Metadata = {
  title: "Grupo VIP",
  description: "Entre no Grupo VIP da Aurum Peptide e receba conteúdo exclusivo sobre peptídeos.",
  robots: { index: false, follow: false },
};

export default function GrupoVipPage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-8 py-16 text-center sm:py-24">
      <span className="relative block h-24 w-24 overflow-hidden rounded-3xl ring-1 ring-aurum-gold/30">
        <Image src="/logo-badge.png" alt="Aurum Peptide" fill priority className="object-cover" />
      </span>
      <div className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.3em] text-aurum-gold">Grupo VIP</p>
        <h1 className="max-w-xl text-balance font-heading text-3xl leading-snug text-aurum-ice sm:text-4xl">
          Conteúdo exclusivo sobre peptídeos
        </h1>
        <p className="max-w-md text-balance leading-relaxed text-aurum-ice/75">
          O que são, para que servem e as novidades em performance, longevidade, estética e
          metabolismo, direto no seu WhatsApp.
        </p>
      </div>
      <ButtonLink href={CONVITE_GRUPO_VIP} size="lg">
        Entrar no Grupo VIP
      </ButtonLink>
      <p className="text-xs text-aurum-ice/50">Gratuito. Você pode sair quando quiser.</p>
    </Container>
  );
}
