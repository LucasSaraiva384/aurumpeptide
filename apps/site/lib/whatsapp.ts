// Placeholder — substituir pelo número real da Aurum Peptide via
// NEXT_PUBLIC_WHATSAPP_NUMBER em apps/site/.env.local (formato
// internacional sem símbolos, ex.: 5511999999999).
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5500000000000";

/** Sem `produtoNome`, monta uma mensagem de contato geral (footer, estado vazio). */
export function buildWhatsappLink(produtoNome?: string): string {
  const mensagem = produtoNome
    ? `Olá! Tenho interesse no produto "${produtoNome}" da Aurum Peptide.`
    : "Olá! Gostaria de mais informações sobre os produtos da Aurum Peptide.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Evento customizado pro GTM criar um trigger de conversão do Google Ads
 * (clique em CTA de WhatsApp). `origem` identifica qual botão foi clicado
 * (ex.: "hero", "header", "product-card") para segmentar depois no GA4.
 */
export function trackWhatsappClick(origem: string, produtoNome?: string): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "whatsapp_click",
    whatsapp_origem: origem,
    ...(produtoNome ? { whatsapp_produto: produtoNome } : {}),
  });
}
