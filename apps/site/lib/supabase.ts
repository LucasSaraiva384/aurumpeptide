import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Sinaliza se as credenciais reais do Supabase foram configuradas. Usado
 * pelas páginas para não tentar consultar o banco (e falhar em runtime)
 * quando o app roda sem `.env.local` preenchido — ver apps/site/.env.local.example.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Valores placeholder evitam que `createClient` lance exceção de import
// quando as env vars ainda não existem (dev local sem chaves, ou build
// sem `.env.local`). Nenhuma chamada de rede é feita antes de uso.
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
