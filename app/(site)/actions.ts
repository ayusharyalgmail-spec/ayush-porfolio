"use server";

import { z } from "zod";
import { contactSchema } from "@/lib/schemas";
import { publicClient } from "@/lib/supabase/public";

type Field = "name" | "email" | "body" | "subject";
export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<Field, string[]>>;
  /** Echoed back so a failed submit never wipes what the visitor typed. */
  values?: Partial<Record<Field, string>>;
};

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

async function verifyTurnstile(secret: string, response: string): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response }),
      cache: "no-store",
    });
    const json: unknown = await res.json();
    return z.object({ success: z.boolean() }).safeParse(json).data?.success === true;
  } catch {
    return false;
  }
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = { name: text(formData.get("name")), email: text(formData.get("email")), subject: text(formData.get("subject")), body: text(formData.get("body")) };
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, values, errors: z.flattenError(parsed.error).fieldErrors };
  const { name, email, body, website, subject } = parsed.data;
  if (website) return { ok: true, message: "Thanks! I will reply soon." }; // honeypot hit: pretend success

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    const token = text(formData.get("cf-turnstile-response"));
    const ok = token ? await verifyTurnstile(secret, token) : false;
    if (!ok) return { ok: false, values, message: "Please complete the spam check and try again." };
  }

  const db = publicClient();
  if (!db) return { ok: false, values, message: "The contact form is not available right now. Please email me instead." };
  const { error } = await db.from("messages").insert({ name, email, body, subject: subject || null });
  if (error) {
    console.error("[sendMessage]", error.message);
    const limited = error.message.includes("rate_limited");
    return {
      ok: false,
      values,
      message: limited ? "You are sending messages too quickly. Please wait a minute and try again." : "Sorry, your message could not be sent. Your text is still here, so please try again.",
    };
  }
  return { ok: true, message: "Thanks! Your message is in. I will reply soon." };
}
