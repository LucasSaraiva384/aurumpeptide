import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consome @aurum/ui direto do source TS do monorepo (sem passo de build
  // próprio no pacote) — Next transpila o pacote workspace ao empacotar.
  transpilePackages: ["@aurum/ui"],
};

export default nextConfig;
