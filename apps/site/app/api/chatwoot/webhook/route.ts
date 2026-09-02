import { after, NextRequest, NextResponse } from "next/server";
import { identificarBotaoPeloTexto, processarMensagemRecebida } from "@/lib/whatsappAutomacao";

// Webhook de saída do Chatwoot self-hosted (Configurações > Integrações >
// Webhooks, evento "message_created") — descoberto em 2026-09-02 que o
// Chatwoot registra sua própria URL de callback direto na Meta pra esse
// número, sobrepondo a config a nível de app usada pelo webhook antigo
// (apps/site/app/api/whatsapp/webhook/route.ts). Esse é hoje o único caminho
// que recebe mensagens reais de clientes, então a automação de boas-vindas
// precisa reagir a partir daqui.
export const runtime = "nodejs";
export const maxDuration = 30;

// O Chatwoot não assina o payload (sem equivalente ao X-Hub-Signature-256 da
// Meta) — autenticação é via segredo compartilhado na própria URL do
// webhook, conferido abaixo.
const CHATWOOT_OUTGOING_WEBHOOK_SECRET = process.env.CHATWOOT_OUTGOING_WEBHOOK_SECRET;
// Filtra só a caixa de entrada "WhatsApp Aurum" — evita reagir a eventos de
// outras caixas que possam existir/ser criadas no futuro.
const CHATWOOT_INBOX_ID = process.env.CHATWOOT_INBOX_ID;

type ChatwootWebhookPayload = {
  event?: string;
  message_type?: string | number;
  content?: string | null;
  source_id?: string | null;
  sender?: { name?: string; phone_number?: string; type?: string };
  conversation?: { id?: number; inbox_id?: number };
  inbox?: { id?: number; name?: string };
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const segredoRecebido = request.nextUrl.searchParams.get("secret");
  if (!CHATWOOT_OUTGOING_WEBHOOK_SECRET || segredoRecebido !== CHATWOOT_OUTGOING_WEBHOOK_SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let payload: ChatwootWebhookPayload;
  try {
    payload = (await request.json()) as ChatwootWebhookPayload;
  } catch (erro) {
    console.error("[chatwoot/webhook] payload inválido:", erro);
    return NextResponse.json({ success: true });
  }

  // Responde ao Chatwoot imediatamente e processa em segundo plano — mesmo
  // raciocínio do webhook da Meta (evitar que uma resposta lenta pareça
  // falha e dispare reentrega).
  after(() => processarEvento(payload).catch((erro) => console.error("[chatwoot/webhook] erro ao processar evento:", erro)));

  return NextResponse.json({ success: true });
}

async function processarEvento(payload: ChatwootWebhookPayload): Promise<void> {
  if (payload.event !== "message_created") return;
  // "incoming"/0 dependendo da versão do Chatwoot — nunca reage a mensagens
  // que o próprio Chatwoot enviou (evita loop) nem a eventos de atividade
  // (ex.: "Assigned to ...").
  if (payload.message_type !== "incoming" && payload.message_type !== 0) return;
  if (payload.sender?.type && payload.sender.type !== "contact") return;

  const inboxId = payload.inbox?.id ?? payload.conversation?.inbox_id;
  if (CHATWOOT_INBOX_ID && inboxId !== undefined && String(inboxId) !== CHATWOOT_INBOX_ID) return;

  const telefone = payload.sender?.phone_number;
  if (!telefone) {
    console.error("[chatwoot/webhook] evento sem telefone do remetente, ignorado:", JSON.stringify(payload));
    return;
  }
  const waId = telefone.replace(/^\+/, "");

  await processarMensagemRecebida({
    waId,
    nomePerfil: payload.sender?.name ?? null,
    tipo: "text",
    corpo: payload.content ?? null,
    waMessageId: payload.source_id ?? null,
    botaoClicadoId: identificarBotaoPeloTexto(payload.content),
  });
}
