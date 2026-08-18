import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";

const TITLE_PADRAO = "Aurum Peptide — Ciência aplicada à performance e longevidade";
const DESCRICAO_PADRAO =
  "Peptídeos selecionados sob elevados padrões internacionais de qualidade, para performance física e emagrecimento/metabolismo. Atendimento pessoal pelo WhatsApp.";
const OG_IMAGE = "/logo-oficial-com-nome.png";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_PADRAO,
    template: "%s | Aurum Peptide",
  },
  description: DESCRICAO_PADRAO,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-badge.png",
    apple: "/logo-badge.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Aurum Peptide",
    title: TITLE_PADRAO,
    description: DESCRICAO_PADRAO,
    url: SITE_URL,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_PADRAO,
    description: DESCRICAO_PADRAO,
    images: [OG_IMAGE],
  },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    // Verificação de propriedade do domínio para o Business Manager da Meta
    // (Configurações da empresa > Domínios) — necessária para a Verificação
    // da Empresa liberar recursos avançados (ex.: webhook de produção do
    // WhatsApp Business em apps desenvolvidos ainda não publicados).
    other: {
      "facebook-domain-verification": "bvn0a9z1o1wkjlgcw6tj4fs6378bz9",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col font-body antialiased">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        {/* GA4/GTM: só renderizam quando as env vars reais forem configuradas
            (apps/site/.env.local) — sem efeito nenhum até lá. */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
