import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin, type WhatsappContato } from "@/lib/supabaseAdmin";

// Precisa do módulo `crypto` do Node pra validar a assinatura HMAC — não
// roda em edge runtime.
export const runtime = "nodejs";

const META_API_VERSION = process.env.META_API_VERSION || "v21.0";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_WHATSAPP_PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aurumpeptide.com.br";

// Texto aprovado pelo Marketing Manager e pelo usuário — não alterar sem
// nova aprovação.
const MENSAGEM_BOAS_VINDAS = `Olá, seja bem-vindo(a) à Aurum Peptide.
Recebemos sua mensagem e, em instantes, alguém da nossa equipe dará continuidade ao seu atendimento.
Enquanto isso, fica o convite para o nosso Grupo VIP no WhatsApp — conteúdo exclusivo e atendimento prioritário: https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb?s=cl&p=i&mlu=0
Conheça também o portfólio completo em nosso site: https://aurumpeptide.com.br
Na sequência, enviamos a tabela de preços atualizada em PDF.`;

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

  // A partir daqui, sempre 200 — evita que a Meta entre em retry storm.
  // Qualquer erro de processamento é logado, nunca propagado.
  try {
    const payload = JSON.parse(corpoBruto) as MetaWebhookPayload;
    await processarPayload(payload);
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao processar payload:", erro);
  }

  return NextResponse.json({ success: true });
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
  const waId = mensagem.from;
  const nomePerfil = contato?.profile?.name ?? null;

  await registrarMensagem(waId, "recebida", mensagem.type, mensagem.text?.body ?? null, mensagem.id);

  const contatoRegistrado = await buscarOuCriarContato(waId, nomePerfil);

  // contatoRegistrado é null quando o Supabase não está configurado/acessível
  // (ver isSupabaseAdminConfigured) — nesse caso não há como saber se é
  // contato novo, então não envia boas-vindas, pra não arriscar reenviar a
  // cada mensagem enquanto a chave de service_role não é preenchida.
  if (contatoRegistrado && !contatoRegistrado.boas_vindas_enviada_em) {
    await enviarBoasVindas(waId);
  }
}

async function buscarOuCriarContato(waId: string, nomePerfil: string | null): Promise<WhatsappContato | null> {
  if (!isSupabaseAdminConfigured) return null;

  const { data: existente, error: erroBusca } = await supabaseAdmin
    .from("whatsapp_contatos")
    .select("*")
    .eq("wa_id", waId)
    .maybeSingle();

  if (erroBusca) {
    console.error("[whatsapp/webhook] erro ao buscar contato:", erroBusca);
    return null;
  }

  if (existente) return existente;

  const { data: novo, error: erroInsercao } = await supabaseAdmin
    .from("whatsapp_contatos")
    .insert({ wa_id: waId, nome_perfil: nomePerfil })
    .select("*")
    .single();

  if (erroInsercao) {
    console.error("[whatsapp/webhook] erro ao criar contato:", erroInsercao);
    return null;
  }

  return novo;
}

async function registrarMensagem(
  waId: string,
  direcao: "recebida" | "enviada",
  tipo: string,
  corpo: string | null,
  waMessageId: string | null,
): Promise<void> {
  if (!isSupabaseAdminConfigured) return;

  const { error } = await supabaseAdmin.from("whatsapp_mensagens").insert({
    wa_id: waId,
    direcao,
    tipo,
    corpo,
    wa_message_id: waMessageId,
  });

  if (error) {
    console.error("[whatsapp/webhook] erro ao registrar mensagem:", error);
  }
}

/**
 * Envia texto de boas-vindas + tabela de preços em PDF (duas chamadas
 * isoladas — falha em uma não impede a outra) e marca o contato como
 * atendido, mesmo que algum envio tenha falhado (evita reenvio em loop a
 * cada nova mensagem da mesma pessoa; uma falha pontual significa que essa
 * pessoa não recebeu um dos dois envios).
 */
async function enviarBoasVindas(waId: string): Promise<void> {
  await enviarTextoBoasVindas(waId);
  await enviarTabelaPrecos(waId);
  await marcarBoasVindasEnviada(waId);
}

async function enviarTextoBoasVindas(waId: string): Promise<void> {
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "text",
      text: { body: MENSAGEM_BOAS_VINDAS },
    });
    await registrarMensagem(waId, "enviada", "text", MENSAGEM_BOAS_VINDAS, waMessageId);
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao enviar texto de boas-vindas:", erro);
  }
}

async function enviarTabelaPrecos(waId: string): Promise<void> {
  const linkPdf = `${SITE_URL}/tabela-aurum-peptide.pdf`;
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "document",
      document: {
        link: linkPdf,
        filename: "Tabela Aurum Peptide.pdf",
        caption: "Tabela de preços atualizada",
      },
    });
    await registrarMensagem(waId, "enviada", "document", linkPdf, waMessageId);
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao enviar tabela de preços:", erro);
  }
}

type GraphApiRespostaMensagens = {
  messages?: { id: string }[];
  error?: { message?: string };
};

async function chamarGraphApiMensagens(corpo: Record<string, unknown>): Promise<string | null> {
  if (!META_ACCESS_TOKEN || !META_WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("META_ACCESS_TOKEN ou META_WHATSAPP_PHONE_NUMBER_ID não configurados");
  }

  const resposta = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${META_WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${META_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(corpo),
    },
  );

  const dados = (await resposta.json()) as GraphApiRespostaMensagens;

  if (!resposta.ok) {
    throw new Error(dados.error?.message ?? `Graph API respondeu ${resposta.status}`);
  }

  return dados.messages?.[0]?.id ?? null;
}

async function marcarBoasVindasEnviada(waId: string): Promise<void> {
  if (!isSupabaseAdminConfigured) return;

  const { error } = await supabaseAdmin
    .from("whatsapp_contatos")
    .update({ boas_vindas_enviada_em: new Date().toISOString() })
    .eq("wa_id", waId);

  if (error) {
    console.error("[whatsapp/webhook] erro ao marcar boas-vindas como enviada:", error);
  }
}
