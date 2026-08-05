import { Divider } from "@aurum/ui";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { WhatsappButtonLink } from "@/components/WhatsappButtonLink";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <Divider className="w-16" />
      <h2 className="font-heading text-2xl text-aurum-ice">
        Nenhum produto disponível no momento
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-aurum-ice/70">
        Nossa seleção está sendo atualizada. Fale diretamente com a equipe da Aurum Peptide pelo
        WhatsApp para mais informações.
      </p>
      <WhatsappButtonLink
        origem="empty-state"
        href={buildWhatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        className="mt-1"
      >
        Falar no WhatsApp
      </WhatsappButtonLink>
    </div>
  );
}
