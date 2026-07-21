import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aurum Peptide — Ciência aplicada à performance e longevidade",
  description:
    "Peptídeos selecionados sob elevados padrões internacionais de qualidade, para performance física e emagrecimento/metabolismo. Atendimento pessoal pelo WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col font-body antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
