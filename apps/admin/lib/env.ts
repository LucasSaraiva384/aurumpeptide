export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Sinaliza se o Supabase real foi configurado. Usado para evitar chamadas
 * de rede (e falhas de build/dev) quando apps/admin/.env.local ainda não
 * foi preenchido.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Placeholders evitam que os clients do Supabase lancem exceção de
// inicialização quando as env vars estão vazias.
export const resolvedSupabaseUrl = supabaseUrl || "https://placeholder.supabase.co";
export const resolvedSupabaseAnonKey = supabaseAnonKey || "placeholder-anon-key";
