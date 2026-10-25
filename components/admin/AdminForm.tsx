"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "@/components/admin/Toaster";
import type { Field, FormState } from "@/lib/resources";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: readonly Field[];
  row?: Record<string, unknown>;
  resetOnSuccess?: boolean;
  submitLabel?: string;
  /** Called after a successful save (e.g. to close the drawer). */
  onSaved?: () => void;
};

const initial: FormState = { ok: false };
const show = (v: unknown, multiline = false) => (Array.isArray(v) ? v.join(multiline ? "\n" : ", ") : v == null ? "" : String(v));

export function AdminForm({ action, fields, row, resetOnSuccess, submitLabel = "Save changes", onSaved }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === initial || !state.message) return;
    toast(state.message, state.ok ? "ok" : "error");
    if (state.ok) {
      if (resetOnSuccess) ref.current?.reset();
      onSaved?.();
    }
  }, [state, resetOnSuccess, onSaved]);

  // Consecutive fields with the same `group` share a titled section.
  const groups: { name?: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const last = groups[groups.length - 1];
    if (last && last.name === f.group) last.fields.push(f);
    else groups.push({ name: f.group, fields: [f] });
  }

  return (
    <form ref={ref} action={formAction} className="ad-form" noValidate>
      {typeof row?.id === "string" && <input type="hidden" name="id" value={row.id} />}
      <div className="ad-fields">
        {groups.map((g, gi) => (
          <fieldset key={gi} className="ad-group">
            {g.name && <legend>{g.name}</legend>}
            {g.fields.map((f) => {
              const id = `${row?.id ?? "new"}-${f.name}`;
              const err = state.errors?.[f.name]?.[0];
              const common = { id, name: f.name, "aria-invalid": !!err, "aria-describedby": err ? `${id}-e` : f.hint ? `${id}-h` : undefined } as const;
              if (f.type === "checkbox")
                return (
                  <label key={f.name} className="ad-check" htmlFor={id}>
                    <input {...common} type="checkbox" defaultChecked={row ? Boolean(row[f.name]) : f.name === "published" || f.name === "open_to_work"} />
                    <span>{f.label}</span>
                  </label>
                );
              return (
                <div key={f.name} className="ad-field">
                  <label htmlFor={id}>{f.label}{f.required && <abbr title="required" aria-label="required"> *</abbr>}</label>
                  {f.type === "textarea" ? (
                    <textarea {...common} rows={4} defaultValue={show(row?.[f.name], true)} />
                  ) : f.type === "select" ? (
                    <select {...common} defaultValue={show(row?.[f.name]) || f.options?.[0]}>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input {...common} type={f.type} defaultValue={show(row?.[f.name]) || (f.type === "number" ? "0" : "")} />
                  )}
                  {err ? <span id={`${id}-e`} className="ad-err">{err}</span> : f.hint ? <span id={`${id}-h`} className="ad-hint">{f.hint}</span> : null}
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>
      <div className="ad-formbar">
        {state.message && !state.ok && <span className="ad-err" role="alert">{state.message}</span>}
        <button type="submit" className="ad-btn primary" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
