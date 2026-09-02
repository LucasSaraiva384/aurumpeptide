import { createHmac, timingSafeEqual } from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin, type WhatsappContato } from "@/lib/supabaseAdmin";

// Precisa do módulo `crypto` do Node pra validar a assinatura HMAC — não
// roda em edge runtime.
export const runtime = "nodejs";
// O envio da mensagem de boas-vindas roda em segundo plano via `after()` (ver
// POST abaixo), mas a função Vercel precisa continuar viva até ele terminar —
// daí o maxDuration, acima do timeout padrão de 10s do plano Hobby.
export const maxDuration = 30;

const META_API_VERSION = process.env.META_API_VERSION || "v21.0";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_WHATSAPP_PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
// URL do webhook do Chatwoot (self-hosted) pra onde espelhamos o payload bruto
// da Meta — mantém a automação de boas-vindas aqui, e alimenta o Chatwoot em
// paralelo pra monitoramento/resposta manual. Ver docs/publicacao/log.md.
const CHATWOOT_WHATSAPP_WEBHOOK_URL = process.env.CHATWOOT_WHATSAPP_WEBHOOK_URL;
// API do Chatwoot — só pra registrar confirmação de envio como nota privada
// (nunca reenvia de verdade). Ver registrarConfirmacaoNoChatwoot.
const CHATWOOT_BASE_URL = process.env.CHATWOOT_BASE_URL;
const CHATWOOT_API_ACCESS_TOKEN = process.env.CHATWOOT_API_ACCESS_TOKEN;
const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID;
const CHATWOOT_INBOX_ID = process.env.CHATWOOT_INBOX_ID;

// Sequência de boas-vindas aprovada pelo usuário em 2026-09-02 — uma única
// mensagem interativa com 2 botões (estilo confirmado pelo usuário a partir
// de referência de concorrente), substituindo a versão anterior de 3
// mensagens de texto + PDF. Tabela de preços em PDF fica de fora por ora.
// Ajustar texto/botões é só editar as constantes abaixo.
const MENSAGEM_1_BOAS_VINDAS = `Olá! 👋 Seja muito bem-vindo(a) à Aurum Peptide.

Trabalhamos com um catálogo premium de peptídeos para pesquisa — entre os mais procurados estão Tirzepatida, GHK-Cu, GLOW, Retatrutida e muito mais.

Quer entrar no nosso grupo VIP com promoções e condições exclusivas, ou prefere já falar direto com um vendedor?`;

const BOTAO_ID_GRUPO = "entrar_grupo";
const BOTAO_ID_VENDEDOR = "falar_vendedor";

const MENSAGEM_GRUPO_VIP = `🔥 Aqui está o link do nosso grupo exclusivo no WhatsApp, onde divulgamos promoções, oportunidades e condições especiais antes de qualquer outro canal:

👇 Entre pelo link:

https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb?s=cl&p=i&mlu=0

A participação é gratuita e as condições divulgadas no grupo podem ser por tempo ou estoque limitado.`;

// Número do vendedor: +55 15 98189-0060.
const MENSAGEM_FALAR_VENDEDOR = `Perfeito! 🙌 Você já pode falar diretamente com um de nossos vendedores por aqui:

https://wa.me/5515981890060`;

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
  // resposta rápida (ver MENSAGEM_1_BOAS_VINDAS/enviarMensagemBotoes).
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
  // paralelo. A trava atômica em reivindicarBoasVindas cobre esse cenário de
  // qualquer forma, mas responder rápido evita o retry na origem. Qualquer
  // erro de processamento é logado, nunca propagado — sempre 200.
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
 * Chatwoot self-hosted, pra alimentar a inbox de monitoramento/resposta
 * manual. Nunca lança — uma falha aqui não pode impedir a automação de
 * boas-vindas acima de rodar.
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
  const waId = mensagem.from;
  const nomePerfil = contato?.profile?.name ?? null;

  await registrarMensagem(waId, "recebida", mensagem.type, mensagem.text?.body ?? null, mensagem.id);
  await buscarOuCriarContato(waId, nomePerfil);

  // Clique num botão da mensagem de boas-vindas — independente de já ter
  // reivindicado as boas-vindas antes (é sempre uma mensagem subsequente).
  if (mensagem.type === "interactive" && mensagem.interactive?.type === "button_reply") {
    await processarCliqueBotao(waId, mensagem.interactive.button_reply?.id);
    return;
  }

  // Reivindica atomicamente o direito de enviar as boas-vindas (UPDATE
  // condicional no banco, não um "SELECT depois UPDATE" separado) — só
  // quem conseguir marcar a linha ainda não marcada deve enviar. Fecha a
  // janela de corrida caso a Meta reentregue o mesmo webhook (retry) antes
  // da primeira execução terminar.
  if (await reivindicarBoasVindas(waId)) {
    await enviarBoasVindas(waId);
  }
}

/** Reage ao clique num dos botões da mensagem de boas-vindas, enviando o link correspondente. */
async function processarCliqueBotao(waId: string, botaoId: string | undefined): Promise<void> {
  if (botaoId === BOTAO_ID_GRUPO) {
    await enviarMensagemTexto(waId, MENSAGEM_GRUPO_VIP);
  } else if (botaoId === BOTAO_ID_VENDEDOR) {
    await enviarMensagemTexto(waId, MENSAGEM_FALAR_VENDEDOR);
  }
}

/**
 * Marca `boas_vindas_enviada_em` só se ainda estiver nulo, retornando se
 * esta chamada foi quem conseguiu marcar. Sem Supabase configurado, nunca
 * reivindica (não há como saber se é contato novo, então não arrisca
 * reenviar a cada mensagem enquanto a service_role key não é preenchida).
 */
async function reivindicarBoasVindas(waId: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;

  const { data, error } = await supabaseAdmin
    .from("whatsapp_contatos")
    .update({ boas_vindas_enviada_em: new Date().toISOString() })
    .eq("wa_id", waId)
    .is("boas_vindas_enviada_em", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[whatsapp/webhook] erro ao reivindicar boas-vindas:", error);
    return false;
  }

  return Boolean(data);
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
 * Envia a mensagem de boas-vindas com os 2 botões (grupo VIP / falar com
 * vendedor) e registra no Chatwoot uma nota privada confirmando o envio. O
 * contato já foi marcado como atendido antes desta função rodar, em
 * reivindicarBoasVindas. Os links de cada opção só são enviados depois,
 * quando a pessoa clica no botão (ver processarCliqueBotao).
 */
async function enviarBoasVindas(waId: string): Promise<void> {
  const sucesso = await enviarMensagemBotoes(waId, MENSAGEM_1_BOAS_VINDAS, [
    { id: BOTAO_ID_GRUPO, title: "Entrar no grupo" },
    { id: BOTAO_ID_VENDEDOR, title: "Falar com vendedor" },
  ]);

  await registrarConfirmacaoNoChatwoot(waId, [sucesso]);
}

async function enviarMensagemTexto(waId: string, texto: string): Promise<boolean> {
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "text",
      text: { body: texto },
    });
    await registrarMensagem(waId, "enviada", "text", texto, waMessageId);
    return true;
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao enviar mensagem de texto:", erro);
    return false;
  }
}

/** Botões de resposta rápida — a Cloud API limita a 3 por mensagem e 20 caracteres por título. */
async function enviarMensagemBotoes(
  waId: string,
  texto: string,
  botoes: { id: string; title: string }[],
): Promise<boolean> {
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: texto },
        action: {
          buttons: botoes.map((botao) => ({ type: "reply", reply: botao })),
        },
      },
    });
    await registrarMensagem(waId, "enviada", "interactive", texto, waMessageId);
    return true;
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao enviar mensagem com botões:", erro);
    return false;
  }
}

const ROTULOS_CONFIRMACAO_CHATWOOT = ["Mensagem de boas-vindas (com botões)"];

type ChatwootContatoBusca = { payload?: { id: number }[] };
type ChatwootConversa = { id: number; inbox_id: number };
type ChatwootConversasResposta = { payload?: ChatwootConversa[] };

/**
 * Registra, como nota privada na conversa do Chatwoot (nunca dispara reenvio
 * real ao cliente — sempre `private: true`), um resumo de quais mensagens da
 * sequência de boas-vindas foram enviadas com sucesso. Só existe pra dar
 * visibilidade ao atendente de que a automação rodou; falha aqui nunca deve
 * afetar o fluxo de envio real, então é sempre best-effort.
 */
async function registrarConfirmacaoNoChatwoot(waId: string, resultados: boolean[]): Promise<void> {
  if (!CHATWOOT_BASE_URL || !CHATWOOT_API_ACCESS_TOKEN || !CHATWOOT_ACCOUNT_ID) return;

  try {
    const conversationId = await buscarConversaChatwoot(waId);
    if (!conversationId) return;

    const linhas = ROTULOS_CONFIRMACAO_CHATWOOT.map(
      (rotulo, indice) => `${resultados[indice] ? "✅" : "❌"} ${rotulo}`,
    );
    const sucesso = resultados.filter(Boolean).length;
    const conteudo = `🤖 Automação de boas-vindas — ${sucesso}/${resultados.length} enviadas:\n\n${linhas.join("\n")}`;

    const resposta = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", api_access_token: CHATWOOT_API_ACCESS_TOKEN },
        body: JSON.stringify({ content: conteudo, private: true }),
      },
    );

    if (!resposta.ok) {
      console.error(`[whatsapp/webhook] Chatwoot respondeu ${resposta.status} ao registrar confirmação`);
    }
  } catch (erro) {
    console.error("[whatsapp/webhook] erro ao registrar confirmação no Chatwoot:", erro);
  }
}

/** Acha a conversa mais recente do contato no inbox de WhatsApp, via busca por telefone. */
async function buscarConversaChatwoot(waId: string): Promise<number | null> {
  if (!CHATWOOT_BASE_URL || !CHATWOOT_API_ACCESS_TOKEN || !CHATWOOT_ACCOUNT_ID) return null;

  const cabecalhos = { api_access_token: CHATWOOT_API_ACCESS_TOKEN };

  const respostaContato = await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/contacts/search?q=${encodeURIComponent(waId)}`,
    { headers: cabecalhos },
  );
  if (!respostaContato.ok) return null;
  const dadosContato = (await respostaContato.json()) as ChatwootContatoBusca;
  const contatoId = dadosContato.payload?.[0]?.id;
  if (!contatoId) return null;

  const respostaConversas = await fetch(
    `${CHATWOOT_BASE_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/contacts/${contatoId}/conversations`,
    { headers: cabecalhos },
  );
  if (!respostaConversas.ok) return null;
  const dadosConversas = (await respostaConversas.json()) as ChatwootConversasResposta;

  const inboxIdAlvo = CHATWOOT_INBOX_ID ? Number(CHATWOOT_INBOX_ID) : null;
  const conversas = (dadosConversas.payload ?? []).filter(
    (conversa) => inboxIdAlvo === null || conversa.inbox_id === inboxIdAlvo,
  );

  return conversas.sort((a, b) => b.id - a.id)[0]?.id ?? null;
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
