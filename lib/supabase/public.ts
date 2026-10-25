import { createClient } from "@supabase/supabase-js";

/** Cookie-less anon client for public reads (keeps pages statically cacheable). Null when env is missing. */
export function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
