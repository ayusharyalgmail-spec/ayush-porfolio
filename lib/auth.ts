import { cache } from "react";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

/**
 * Server-side admin gate (defence in depth behind proxy.ts and RLS). Redirects unless the user is in public.admins.
 * Cached per request so layout + page share one check; the session is verified from the signed JWT (no extra network call).
 */
export const requireAdmin = cache(async () => {
  const db = await serverClient();
  if (!db) redirect("/admin/login");
  const { data } = await db.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect("/admin/login");
  const { data: row } = await db.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (!row) redirect("/admin/login?e=forbidden");
  return db;
});
