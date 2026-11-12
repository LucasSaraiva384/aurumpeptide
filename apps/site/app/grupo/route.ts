import { NextResponse } from "next/server";

// Atalho para os anúncios do Meta: o Meta não aceita chat.whatsapp.com como
// destino de anúncio, então o anúncio aponta para aurumpeptide.com.br/grupo
// e esta rota redireciona na hora para o convite do Grupo VIP.
const CONVITE_GRUPO_VIP = "https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.redirect(CONVITE_GRUPO_VIP, 302);
}
