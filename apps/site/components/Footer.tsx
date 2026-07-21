import Image from "next/image";
import { Container, ButtonLink, Divider } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/aurumpeptide/";

export function Footer() {
  return (
    <footer className="border-t border-aurum-gold/10 bg-aurum-green-deep/60">
      <Container className="flex flex-col items-center gap-8 py-16 text-center">
        <span className="relative block h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-aurum-gold/30">
          <Image src="/logo-badge.png" alt="Aurum Peptide" fill className="object-cover" />
        </span>

        <p className="max-w-xl text-sm text-aurum-ice/70">
          Atendimento pessoal e direto pelo WhatsApp, do primeiro contato à decisão de compra.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Falar no WhatsApp
          </ButtonLink>
          <ButtonLink
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
          >
            @aurumpeptide
          </ButtonLink>
        </div>

        <Divider className="w-24" />

        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-aurum-ice/40">
          © {new Date().getFullYear()} Aurum Peptide — todos os direitos reservados
        </p>
      </Container>
    </footer>
  );
}
