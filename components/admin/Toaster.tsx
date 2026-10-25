"use client";

import { useSyncExternalStore } from "react";

type Toast = { id: number; msg: string; kind: "ok" | "error" };

let items: Toast[] = [];
let counter = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

/** Shows a short confirmation or error message. Safe to call from any admin client component. */
export function toast(msg: string, kind: Toast["kind"] = "ok") {
  const id = ++counter;
  items = [...items, { id, msg, kind }];
  emit();
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 4200);
}

export function Toaster() {
  const list = useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => items,
    () => items,
  );
  return (
    <div className="ad-toasts" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={`ad-toast ${t.kind}`}>{t.msg}</div>
      ))}
    </div>
  );
}
