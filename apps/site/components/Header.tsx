"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { SearchBox } from "@/components/SearchBox";
import { WhatsappButtonLink } from "@/components/WhatsappButtonLink";

const NAV_ITEMS = [
  { href: "#pilares", label: "Pilares" },
  { href: "/produtos", label: "Produtos" },
  { href: "#qualidade", label: "Qualidade" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-aurum-ice/70">
            {NAV_ITEMS.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} className="transition-colors hover:text-aurum-gold">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-aurum-gold">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <SearchBox />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <WhatsappButtonLink
            origem="header"
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="shrink-0 whitespace-nowrap text-[0.65rem] sm:text-xs"
          >
            Fale com um Especialista
          </WhatsappButtonLink>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-aurum-gold/20 text-aurum-ice transition-colors hover:border-aurum-gold/50 hover:text-aurum-gold lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>
      {isMenuOpen ? (
        <div
          id="mobile-nav-panel"
          className="border-t border-aurum-gold/10 bg-aurum-green-deep/95 backdrop-blur-md lg:hidden"
        >
          <Container>
            <nav className="flex flex-col divide-y divide-aurum-gold/10 py-2 text-base uppercase tracking-[0.15em] text-aurum-ice/80">
              {NAV_ITEMS.map((item) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 transition-colors hover:text-aurum-gold"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 transition-colors hover:text-aurum-gold"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
