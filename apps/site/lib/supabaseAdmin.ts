import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Sinaliza se a service_role key foi configurada. Diferente de
 * `isSupabaseConfigured` (lib/supabase.ts, cliente anon do site público,
 * somente leitura), este cliente bypassa RLS e é exclusivo de rotas
 * server-side que precisam escrever no banco — hoje, só o webhook do
 * WhatsApp (app/api/whatsapp/webhook). NUNCA importar em componente
 * cliente nem expor `SUPABASE_SERVICE_ROLE_KEY` com prefixo `NEXT_PUBLIC_`.
 */
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

export type WhatsappContato = {
  id: string;
  wa_id: string;
  nome_perfil: string | null;
  primeira_mensagem_em: string;
  boas_vindas_enviada_em: string | null;
};

export type WhatsappMensagem = {
  id: string;
  wa_id: string;
  direcao: "recebida" | "enviada";
  tipo: string;
  corpo: string | null;
  wa_message_id: string | null;
  criado_em: string;
};

// Tabelas de supabase/whatsapp-recepcao.sql. Não fazem parte do `Database`
// de lib/types.ts porque aquele tipo cobre só o catálogo público, lido com
// a chave anon (site é somente leitura — ver comentário em lib/types.ts).
// Este client escreve, então tem seu próprio generic de tabelas.
export type WhatsappDatabase = {
  public: {
    Tables: {
      whatsapp_contatos: {
        Row: WhatsappContato;
        Insert: Partial<WhatsappContato> & Pick<WhatsappContato, "wa_id">;
        Update: Partial<WhatsappContato>;
        Relationships: [];
      };
      whatsapp_mensagens: {
        Row: WhatsappMensagem;
        Insert: Partial<WhatsappMensagem> & Pick<WhatsappMensagem, "wa_id" | "direcao">;
        Update: Partial<WhatsappMensagem>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// Valor placeholder evita que `createClient` lance exceção de import quando
// a env var ainda não existe (dev local, build sem `.env.local`). Nenhuma
// chamada de rede é feita antes de uso — ver isSupabaseAdminConfigured.
export const supabaseAdmin = createClient<WhatsappDatabase>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceRoleKey || "placeholder-service-role-key",
);
