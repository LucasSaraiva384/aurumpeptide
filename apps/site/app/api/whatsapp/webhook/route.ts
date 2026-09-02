import { createHmac, timingSafeEqual } from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { processarMensagemRecebida } from "@/lib/whatsappAutomacao";

// Precisa do módulo `crypto` do Node pra validar a assinatura HMAC — não
// roda em edge runtime.
export const runtime = "nodejs";
// O envio da mensagem de boas-vindas roda em segundo plano via `after()` (ver
// POST abaixo), mas a função Vercel precisa continuar viva até ele terminar —
// daí o maxDuration, acima do timeout padrão de 10s do plano Hobby.
export const maxDuration = 30;

const META_APP_SECRET = process.env.META_APP_SECRET;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
// URL do webhook do Chatwoot (self-hosted) pra onde espelhamos o payload bruto
// da Meta, só como registro/backup — hoje o Chatwoot já recebe o tráfego real
// direto por conta própria (ver apps/site/app/api/chatwoot/webhook/route.ts),
// então este webhook só recebe tráfego de admins/testers do app "Aurum A.I"
// (limitação de app não publicado — deixado de lado por ora, ver
// docs/publicacao/log.md).
const CHATWOOT_WHATSAPP_WEBHOOK_URL = process.env.CHATWOOT_WHATSAPP_WEBHOOK_URL;

// -- Payload do webhook da Meta (só os campos usados aqui) --
// https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples

type MetaWebhookPayload = {
  entry?: MetaWebhookEntry[];
};

type MetaWebhookEntry = {
  changes?: MetaWebhookChange[];
};

type MetaWebhookChange = {
  value?: MetaWebhookValue;
};

type MetaWebhookValue = {
  // Ausente em eventos que não são mensagem recebida (ex.: `statuses`,
  // confirmação de entrega) — esses são ignorados graciosamente.
  messages?: MetaMessage[];
  contacts?: MetaContact[];
};

type MetaMessage = {
  from: string;
  id: string;
  type: string;
  text?: { body?: string };
  // Presente quando `type === "interactive"` e a pessoa clicou num botão de
  // resposta rápida.
  interactive?: { type?: string; button_reply?: { id: string; title: string } };
};

type MetaContact = {
  profile?: { name?: string };
  wa_id: string;
};

/** Handshake de verificação do webhook, exigido pela Meta ao registrar a URL. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const modo = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (modo === "subscribe" && Boolean(WHATSAPP_WEBHOOK_VERIFY_TOKEN) && token === WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Corpo bruto precisa ser lido ANTES do JSON.parse — a assinatura é
  // calculada sobre os bytes exatos recebidos, não sobre o objeto
  // re-serializado (que pode diferir em espaçamento/ordem de chaves).
  const corpoBruto = await request.text();

  if (!validarAssinatura(corpoBruto, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Responde à Meta imediatamente e processa em segundo plano via `after()`
  // — se a resposta do webhook demorasse até o fim do processamento
  // (chamadas à Graph API/Chatwoot), a Meta poderia interpretar como falha e
  // reentregar o mesmo webhook (retry), disparando o envio duas vezes em
  // paralelo. A trava atômica em reivindicarBoasVindas (dentro de
  // processarMensagemRecebida) cobre esse cenário de qualquer forma, mas
  // responder rápido evita o retry na origem. Qualquer erro de
  // processamento é logado, nunca propagado — sempre 200.
  try {
    const payload = JSON.parse(corpoBruto) as MetaWebhookPayload;
    after(() =>
      processarPayload(payload).catch((erro) => console.error("[whatsapp/webhook] erro ao processar payload:", erro)),
    );
    after(() => repassarParaChatwoot(corpoBruto));
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao processar payload:", erro);
  }

  return NextResponse.json({ success: true });
}

/**
 * Espelha o payload bruto (mesmo formato que a Meta manda) pro webhook do
 * Chatwoot self-hosted, como registro/backup. Nunca lança — uma falha aqui
 * não pode impedir a automação de boas-vindas acima de rodar.
 */
async function repassarParaChatwoot(corpoBruto: string): Promise<void> {
  if (!CHATWOOT_WHATSAPP_WEBHOOK_URL) return;

  try {
    const resposta = await fetch(CHATWOOT_WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpoBruto,
    });

    if (!resposta.ok) {
      console.error(`[whatsapp/webhook] Chatwoot respondeu ${resposta.status} ao repasse`);
    }
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao repassar para o Chatwoot:", erro);
  }
}

function validarAssinatura(corpoBruto: string, headerAssinatura: string | null): boolean {
  try {
    if (!META_APP_SECRET || !headerAssinatura) return false;

    const prefixo = "sha256=";
    if (!headerAssinatura.startsWith(prefixo)) return false;

    const assinaturaRecebidaHex = headerAssinatura.slice(prefixo.length);
    const assinaturaEsperadaHex = createHmac("sha256", META_APP_SECRET).update(corpoBruto, "utf8").digest("hex");

    const bufferRecebido = Buffer.from(assinaturaRecebidaHex, "hex");
    const bufferEsperado = Buffer.from(assinaturaEsperadaHex, "hex");

    // timingSafeEqual lança exceção se os buffers tiverem tamanhos
    // diferentes — checar antes evita o throw (e continua seguro contra
    // timing attack, já que a comparação de tamanho não vaza o conteúdo).
    if (bufferRecebido.length !== bufferEsperado.length) return false;

    return timingSafeEqual(bufferRecebido, bufferEsperado);
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao validar assinatura:", erro);
    return false;
  }
}

async function processarPayload(payload: MetaWebhookPayload): Promise<void> {
  const values = payload.entry?.flatMap((entry) => entry.changes ?? []).map((change) => change.value) ?? [];

  for (const value of values) {
    if (!value?.messages?.length) continue; // ex.: evento `statuses`, ignorado

    for (const [indice, mensagem] of value.messages.entries()) {
      await processarMensagem(mensagem, value.contacts?.[indice]);
    }
  }
}

async function processarMensagem(mensagem: MetaMessage, contato?: MetaContact): Promise<void> {
  const botaoClicadoId =
    mensagem.type === "interactive" && mensagem.interactive?.type === "button_reply"
      ? mensagem.interactive.button_reply?.id
      : undefined;

  await processarMensagemRecebida({
    waId: mensagem.from,
    nomePerfil: contato?.profile?.name ?? null,
    tipo: mensagem.type,
    corpo: mensagem.text?.body ?? null,
    waMessageId: mensagem.id,
    botaoClicadoId,
  });
}
