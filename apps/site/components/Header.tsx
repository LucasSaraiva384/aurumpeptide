import Image from "next/image";
import Link from "next/link";
import { Container, ButtonLink } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";

const NAV_ITEMS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#pilares", label: "Pilares" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#qualidade", label: "Qualidade" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-aurum-gold/10 bg-aurum-green-deep/85 backdrop-blur-md">
      <Container className="flex h-24 items-center justify-between sm:h-28">
        <Link href="/" className="flex items-center gap-3" aria-label="Aurum Peptide">
          <span className="relative block h-11 w-11 overflow-hidden rounded-2xl ring-1 ring-aurum-gold/30 sm:h-14 sm:w-14">
            <Image
              src="/logo-badge.png"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl text-aurum-ice sm:text-2xl">Aurum</span>
            <span className="text-[10px] tracking-[0.35em] text-aurum-gold/80 sm:text-xs">
              PEPTIDE
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-aurum-ice/70 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-aurum-gold">
              {item.label}
            </a>
          ))}
        </nav>
        <ButtonLink
          href={buildWhatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          className="shrink-0 whitespace-nowrap text-[0.65rem] sm:text-xs"
        >
          Fale com um Especialista
        </ButtonLink>
      </Container>
    </header>
  );
}
