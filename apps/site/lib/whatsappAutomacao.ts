import { isSupabaseAdminConfigured, supabaseAdmin, type WhatsappContato } from "@/lib/supabaseAdmin";

// Lógica de envio da automação de boas-vindas do WhatsApp, compartilhada pelos
// dois pontos de entrada que podem receber uma mensagem real de cliente:
//   - apps/site/app/api/whatsapp/webhook/route.ts — webhook oficial da Meta
//     (só recebe tráfego de admins/testers do app, hoje sem uso real — ver
//     apps/site/app/api/chatwoot/webhook/route.ts).
//   - apps/site/app/api/chatwoot/webhook/route.ts — webhook de saída do
//     Chatwoot self-hosted, que é quem de fato recebe as mensagens reais hoje
//     (o Chatwoot registra sua própria URL de callback direto na Meta,
//     sobrepondo a config a nível de app — descoberto em 2026-09-02).

const META_API_VERSION = process.env.META_API_VERSION || "v21.0";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_WHATSAPP_PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aurumpeptide.com.br";
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
const MENSAGEM_1_BOAS_VINDAS = `Olá! Tudo bem? 😊

Temos uma novidade para você! 🧬

Gostaria de conhecer a linha premium de peptídeos da Aurum Peptide?

Posso te enviar mais informações?`;

// Banner exibido como cabeçalho da mensagem de boas-vindas (ver enviarBoasVindas) — arquivo em apps/site/public/.
const URL_BANNER_BOAS_VINDAS = `${SITE_URL}/whatsapp-banner-boas-vindas.png`;

export const BOTAO_ID_GRUPO = "entrar_grupo";
export const BOTAO_ID_VENDEDOR = "falar_vendedor";
const TEXTO_BOTAO_GRUPO = "Entrar no grupo";
const TEXTO_BOTAO_VENDEDOR_QUICK_REPLY = "Falar com vendedor";

const MENSAGEM_GRUPO_VIP = `🚨 PROMOÇÃO AURUM PEPTIDE COMEÇOU! 🧬🔥

As condições especiais da Aurum Peptide já estão liberadas! 🤩

🔥 Peptídeos em destaque:
• GHK-Cu
• GLOW
• KLOW
• MOTS-C
• RETATRUTIDA
• TIRZEPATIDA

💎 Condições exclusivas por tempo limitado
⏳ Aproveite enquanto durarem os estoques!

👉 Confira todas as promoções pelo nosso grupo:

https://chat.whatsapp.com/JqgzFxfecrnCnJLrBNyEhb?s=cl&p=i&mlu=0

📋 Tabela completa e novidades fixadas no grupo!

Aurum Peptide — Ciência • Pureza • Excelência 🧬⚜️`;

const MENSAGEM_FALAR_VENDEDOR = "Perfeito! 🙌 Toque no botão abaixo pra falar direto com um vendedor:";
const TEXTO_BOTAO_VENDEDOR_CTA = "Fala com vendedor";
// Número do vendedor: +55 15 98189-0060.
const URL_WHATSAPP_VENDEDOR = "https://wa.me/5515981890060";

/**
 * Ponto de entrada único pra uma mensagem recebida de um cliente, seja ela
 * vinda do webhook da Meta ou do webhook de saída do Chatwoot. Registra a
 * mensagem, garante o contato, e decide entre reagir a um clique de botão ou
 * disparar a mensagem de boas-vindas (só na primeira mensagem de cada
 * contato).
 */
export async function processarMensagemRecebida(params: {
  waId: string;
  nomePerfil: string | null;
  tipo: string;
  corpo: string | null;
  waMessageId: string | null;
  botaoClicadoId?: string;
}): Promise<void> {
  const { waId, nomePerfil, tipo, corpo, waMessageId, botaoClicadoId } = params;

  await registrarMensagem(waId, "recebida", tipo, corpo, waMessageId);
  await buscarOuCriarContato(waId, nomePerfil);

  if (botaoClicadoId) {
    await processarCliqueBotao(waId, botaoClicadoId);
    return;
  }

  // Reivindica atomicamente o direito de enviar as boas-vindas (UPDATE
  // condicional no banco, não um "SELECT depois UPDATE" separado) — só quem
  // conseguir marcar a linha ainda não marcada deve enviar. Fecha a janela de
  // corrida caso o webhook (Meta ou Chatwoot) reentregue o mesmo evento antes
  // da primeira execução terminar.
  if (await reivindicarBoasVindas(waId)) {
    await enviarBoasVindas(waId);
  }
}

/**
 * Identifica se um texto recebido é a resposta de um dos botões da mensagem
 * de boas-vindas — usado pelo webhook do Chatwoot, que só expõe o título do
 * botão como texto puro (sem o id original do WhatsApp).
 */
export function identificarBotaoPeloTexto(texto: string | null | undefined): string | undefined {
  if (texto === TEXTO_BOTAO_GRUPO) return BOTAO_ID_GRUPO;
  if (texto === TEXTO_BOTAO_VENDEDOR_QUICK_REPLY) return BOTAO_ID_VENDEDOR;
  return undefined;
}

/** Reage ao clique num dos botões da mensagem de boas-vindas, enviando o link correspondente. */
async function processarCliqueBotao(waId: string, botaoId: string | undefined): Promise<void> {
  if (botaoId === BOTAO_ID_GRUPO) {
    // Link puro do grupo no corpo do texto — o próprio WhatsApp renderiza
    // como cartão nativo com botão "Entrar no grupo", sem precisar de botão
    // customizado aqui.
    await enviarMensagemTexto(waId, MENSAGEM_GRUPO_VIP);
  } else if (botaoId === BOTAO_ID_VENDEDOR) {
    await enviarMensagemCtaUrl(waId, MENSAGEM_FALAR_VENDEDOR, TEXTO_BOTAO_VENDEDOR_CTA, URL_WHATSAPP_VENDEDOR);
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
    console.error("[whatsappAutomacao] erro ao reivindicar boas-vindas:", error);
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
    console.error("[whatsappAutomacao] erro ao buscar contato:", erroBusca);
    return null;
  }

  if (existente) return existente;

  const { data: novo, error: erroInsercao } = await supabaseAdmin
    .from("whatsapp_contatos")
    .insert({ wa_id: waId, nome_perfil: nomePerfil })
    .select("*")
    .single();

  if (erroInsercao) {
    console.error("[whatsappAutomacao] erro ao criar contato:", erroInsercao);
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
    console.error("[whatsappAutomacao] erro ao registrar mensagem:", error);
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
  const sucesso = await enviarMensagemBotoes(waId, MENSAGEM_1_BOAS_VINDAS, URL_BANNER_BOAS_VINDAS, [
    { id: BOTAO_ID_GRUPO, title: TEXTO_BOTAO_GRUPO },
    { id: BOTAO_ID_VENDEDOR, title: TEXTO_BOTAO_VENDEDOR_QUICK_REPLY },
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
    console.error("[whatsappAutomacao] erro ao enviar mensagem de texto:", erro);
    return false;
  }
}

/** Botões de resposta rápida — a Cloud API limita a 3 por mensagem e 20 caracteres por título. */
async function enviarMensagemBotoes(
  waId: string,
  texto: string,
  urlImagemCabecalho: string,
  botoes: { id: string; title: string }[],
): Promise<boolean> {
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "interactive",
      interactive: {
        type: "button",
        header: { type: "image", image: { link: urlImagemCabecalho } },
        body: { text: texto },
        action: {
          buttons: botoes.map((botao) => ({ type: "reply", reply: botao })),
        },
      },
    });
    await registrarMensagem(waId, "enviada", "interactive", texto, waMessageId);
    return true;
  } catch (erro) {
    console.error("[whatsappAutomacao] erro ao enviar mensagem com botões:", erro);
    return false;
  }
}

/** Botão único que abre um link (ex.: WhatsApp do vendedor) — a Cloud API limita a 20 caracteres no texto do botão. */
async function enviarMensagemCtaUrl(waId: string, texto: string, textoBotao: string, url: string): Promise<boolean> {
  try {
    const waMessageId = await chamarGraphApiMensagens({
      messaging_product: "whatsapp",
      to: waId,
      type: "interactive",
      interactive: {
        type: "cta_url",
        body: { text: texto },
        action: {
          name: "cta_url",
          parameters: { display_text: textoBotao, url },
        },
      },
    });
    await registrarMensagem(waId, "enviada", "interactive", texto, waMessageId);
    return true;
  } catch (erro) {
    console.error("[whatsappAutomacao] erro ao enviar mensagem com botão de link:", erro);
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
      console.error(`[whatsappAutomacao] Chatwoot respondeu ${resposta.status} ao registrar confirmação`);
    }
  } catch (erro) {
    console.error("[whatsappAutomacao] erro ao registrar confirmação no Chatwoot:", erro);
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
