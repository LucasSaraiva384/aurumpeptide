import { createBrowserClient } from "@supabase/ssr";
import { resolvedSupabaseUrl, resolvedSupabaseAnonKey } from "@/lib/env";
import type { Database } from "@/lib/types";

/** Client para uso em Client Components — carrega a sessão dos cookies do navegador. */
export function createClient() {
  return createBrowserClient<Database>(resolvedSupabaseUrl, resolvedSupabaseAnonKey);
}
