"use client";

import Script from "next/script";
import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/(site)/actions";

const initial: ContactState = { ok: false };
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const err = (k: "name" | "email" | "body") => state.errors?.[k]?.[0];
  const val = (k: "name" | "email" | "body") => (state.ok ? "" : (state.values?.[k] ?? ""));
  // Remount after a successful send so the fields clear; failures keep the typed values.
  const formKey = state.ok ? "sent" : "draft";

  return (
    <form key={formKey} action={action} className="form" aria-busy={pending}>
      <label>
        Name
        <input name="name" defaultValue={val("name")} autoComplete="name" required maxLength={80} aria-invalid={!!err("name")} aria-describedby={err("name") ? "e-name" : undefined} />
        {err("name") && <span id="e-name" className="err">{err("name")}</span>}
      </label>
      <label>
        Email
        <input name="email" type="email" defaultValue={val("email")} autoComplete="email" required maxLength={120} aria-invalid={!!err("email")} aria-describedby={err("email") ? "e-email" : undefined} />
        {err("email") && <span id="e-email" className="err">{err("email")}</span>}
      </label>
      <label>
        Subject (optional)
        <input name="subject" defaultValue={state.ok ? "" : (state.values?.subject ?? "")} maxLength={120} />
      </label>
      <label>
        What do you need built?
        <textarea name="body" defaultValue={val("body")} required minLength={10} maxLength={2000} aria-invalid={!!err("body")} aria-describedby={err("body") ? "e-body" : undefined} />
        {err("body") && <span id="e-body" className="err">{err("body")}</span>}
      </label>
      <div className="hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {siteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      )}
      <button type="submit" className="btn main" data-magnetic disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
      <p role="status" aria-live="polite" className={state.ok ? "ok" : "err"}>{state.message}</p>
    </form>
  );
}
