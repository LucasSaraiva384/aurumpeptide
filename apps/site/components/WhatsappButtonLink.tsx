"use client";

import type { ComponentProps } from "react";
import { ButtonLink } from "@aurum/ui";
import { trackWhatsappClick } from "@/lib/whatsapp";

interface WhatsappButtonLinkProps extends ComponentProps<typeof ButtonLink> {
  origem: string;
  produtoNome?: string;
}

/** ButtonLink para CTAs de WhatsApp: dispara `whatsapp_click` no dataLayer antes de navegar. */
export function WhatsappButtonLink({ origem, produtoNome, onClick, ...props }: WhatsappButtonLinkProps) {
  return (
    <ButtonLink
      {...props}
      onClick={(e) => {
        trackWhatsappClick(origem, produtoNome);
        onClick?.(e);
      }}
    />
  );
}
