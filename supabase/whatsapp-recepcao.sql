-- Aurum Peptide — recepção automática de mensagens no WhatsApp Business
-- (Cloud API oficial da Meta)
--
-- O que este arquivo adiciona:
--   * whatsapp_contatos — um registro por número que já escreveu pra Aurum,
--     com controle de quando a mensagem de boas-vindas (texto + tabela de
--     preços em PDF) foi enviada, pra não reenviar a cada mensagem nova da
--     mesma pessoa;
--   * whatsapp_mensagens — log de toda mensagem recebida e enviada pelo
--     webhook, pra histórico/auditoria (não é usada hoje pra atendimento
--     dentro do produto).
--
-- Como aplicar: Supabase Dashboard > SQL Editor > New query, cole e rode
-- este arquivo inteiro (mesmo fluxo usado para catalogo.sql e seo.sql).
--
-- Acesso: só o service_role (usado pelo webhook, que roda server-side em
-- apps/site/app/api/whatsapp/webhook) lê/escreve estas tabelas — RLS
-- habilitada, sem policies para anon/authenticated.

create table if not exists whatsapp_contatos (
  id uuid primary key default gen_random_uuid(),
  wa_id text not null unique,
  nome_perfil text,
  primeira_mensagem_em timestamptz not null default now(),
  boas_vindas_enviada_em timestamptz
);

create table if not exists whatsapp_mensagens (
  id uuid primary key default gen_random_uuid(),
  wa_id text not null,
  direcao text not null check (direcao in ('recebida', 'enviada')),
  tipo text not null default 'text',
  corpo text,
  wa_message_id text,
  criado_em timestamptz not null default now()
);

create index if not exists whatsapp_mensagens_wa_id_idx on whatsapp_mensagens (wa_id, criado_em);

alter table whatsapp_contatos enable row level security;
alter table whatsapp_mensagens enable row level security;
-- Sem policies para anon/authenticated: só o service_role (usado pelo webhook,
-- que roda server-side em apps/site/app/api/whatsapp/webhook) acessa estas tabelas.
