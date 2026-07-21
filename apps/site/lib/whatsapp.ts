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
