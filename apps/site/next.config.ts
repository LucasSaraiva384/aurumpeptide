import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consome @aurum/ui direto do source TS do monorepo (sem passo de build
  // próprio no pacote) — Next transpila o pacote workspace ao empacotar.
  transpilePackages: ["@aurum/ui"],

  // Habilita next/image para as fotos de produto do Supabase Storage
  // (ProductCard/ProductGallery). Wildcard genérico de **.supabase.co, não
  // o host específico do projeto — evita expor o subdomínio no repo.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  // Padrão do Next, deixado explícito.
  compress: true,

  // Headers de segurança/SEO básicos — sem CSP (risco de quebrar scripts/
  // JSON-LD sem necessidade real aqui).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
