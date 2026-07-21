import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { resolvedSupabaseUrl, resolvedSupabaseAnonKey } from "@/lib/env";
import type { Database } from "@/lib/types";

/** Client para uso em Server Components/Actions — lê/escreve a sessão via cookies. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component (sem acesso de escrita
          // a cookies) — o middleware já cuida de renovar a sessão.
        }
      },
    },
  });
}
