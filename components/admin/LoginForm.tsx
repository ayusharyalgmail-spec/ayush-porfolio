"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import type { FormState } from "@/lib/resources";

const initial: FormState = { ok: false };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  return (
    <form action={action} className="ad-form">
      <div className="ad-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="ad-field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} />
      </div>
      <button type="submit" className="ad-btn primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      <p role="alert" className="ad-err">{state.message}</p>
    </form>
  );
}
