"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { toast } from "@/components/admin/Toaster";
import type { Field, FormState } from "@/lib/resources";

type Row = Record<string, unknown>;
type Props = {
  label: string;
  singular: string;
  titleKey: string;
  fields: readonly Field[];
  rows: Row[];
  saveAction: (prev: FormState, formData: FormData) => Promise<FormState>;
  deleteAction: (id: string) => Promise<void>;
  publishAction: (id: string, value: boolean) => Promise<void>;
};

const SUBTITLE_KEYS = ["tagline", "description", "quote", "role"];
const str = (v: unknown) => (typeof v === "string" ? v : "");

export function ResourceManager({ label, singular, titleKey, fields, rows, saveAction, deleteAction, publishAction }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<{ row?: Row } | null>(null);
  const [removing, setRemoving] = useState<Row | null>(null);
  const [pending, start] = useTransition();
  const drawer = useRef<HTMLDialogElement>(null);
  const confirm = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    if (editing && !d.open) d.showModal();
    if (!editing && d.open) d.close();
  }, [editing]);
  useEffect(() => {
    const d = confirm.current;
    if (!d) return;
    if (removing && !d.open) d.showModal();
    if (!removing && d.open) d.close();
  }, [removing]);

  const closeDrawer = useCallback(() => setEditing(null), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status === "published" && !r.published) return false;
      if (status === "draft" && r.published) return false;
      if (!q) return true;
      return Object.values(r).some((v) => (typeof v === "string" ? v : Array.isArray(v) ? v.join(" ") : "").toLowerCase().includes(q));
    });
  }, [rows, query, status]);

  const subtitle = (r: Row) => {
    const key = SUBTITLE_KEYS.find((k) => str(r[k]));
    if (key) return str(r[key]);
    return Array.isArray(r.items) ? r.items.join(", ") : "";
  };

  function togglePublished(r: Row) {
    const next = !r.published;
    start(async () => {
      await publishAction(String(r.id), next);
      toast(next ? `${str(r[titleKey])} is now published` : `${str(r[titleKey])} moved to drafts`);
    });
  }

  function remove() {
    const r = removing;
    if (!r) return;
    setRemoving(null);
    start(async () => {
      await deleteAction(String(r.id));
      toast(`Deleted ${str(r[titleKey])}`);
    });
  }

  return (
    <>
      <header className="ad-head">
        <div>
          <h1>{label}</h1>
          <p className="ad-sub">{rows.length} total · {rows.filter((r) => r.published).length} published</p>
        </div>
        <button type="button" className="ad-btn primary" onClick={() => setEditing({})}>New {singular}</button>
      </header>

      <div className="ad-tools">
        <input type="search" placeholder={`Search ${label.toLowerCase()}`} aria-label={`Search ${label.toLowerCase()}`} value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="ad-seg" role="group" aria-label="Filter by status">
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{s[0]?.toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="ad-empty">
          <p>{rows.length === 0 ? `No ${label.toLowerCase()} yet.` : "Nothing matches your search or filter."}</p>
          {rows.length === 0 && <button type="button" className="ad-btn primary" onClick={() => setEditing({})}>Add the first {singular}</button>}
        </div>
      ) : (
        <ul className="ad-list" aria-busy={pending}>
          {visible.map((r) => (
            <li key={String(r.id)} className="ad-row">
              <div className="ad-row-main">
                <strong>{str(r[titleKey])}</strong>
                <span>{subtitle(r)}</span>
              </div>
              <label className="ad-switch">
                <input type="checkbox" checked={Boolean(r.published)} onChange={() => togglePublished(r)} aria-label={`Published: ${str(r[titleKey])}`} />
                <span aria-hidden="true" />
                <em>{r.published ? "Live" : "Draft"}</em>
              </label>
              <div className="ad-row-actions">
                <button type="button" className="ad-btn" onClick={() => setEditing({ row: r })}>Edit<span className="sr-only"> {str(r[titleKey])}</span></button>
                <button type="button" className="ad-btn danger" onClick={() => setRemoving(r)}>Delete<span className="sr-only"> {str(r[titleKey])}</span></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <dialog ref={drawer} className="ad-drawer" aria-labelledby="drawer-title" onClose={closeDrawer} onClick={(e) => e.target === drawer.current && closeDrawer()}>
        {editing && (
          <>
            <div className="ad-drawer-head">
              <h2 id="drawer-title">{editing.row ? `Edit ${singular}` : `New ${singular}`}</h2>
              <button type="button" className="ad-btn" onClick={closeDrawer}>Close</button>
            </div>
            <AdminForm key={editing.row ? String(editing.row.id) : "new"} action={saveAction} fields={fields} row={editing.row} submitLabel={editing.row ? "Save changes" : `Create ${singular}`} onSaved={closeDrawer} />
          </>
        )}
      </dialog>

      <dialog ref={confirm} className="ad-confirm" aria-labelledby="confirm-title" onClose={() => setRemoving(null)}>
        <h2 id="confirm-title">Delete {removing ? str(removing[titleKey]) : ""}?</h2>
        <p>This removes it from the site and can&apos;t be undone. Unpublish it instead if you might want it back.</p>
        <div className="ad-confirm-actions">
          <button type="button" className="ad-btn" onClick={() => setRemoving(null)}>Keep it</button>
          <button type="button" className="ad-btn danger solid" onClick={remove}>Delete {singular}</button>
        </div>
      </dialog>
    </>
  );
}
