import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Aurum Peptide — Painel Admin",
  description: "Painel interno: estoque, vendas, clientes e fluxo de caixa.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
