"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "@/components/admin/Toaster";
import type { Message } from "@/lib/schemas";

type Props = {
  messages: Message[];
  setReadAction: (id: string, read: boolean) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
};

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function Inbox({ messages, setReadAction, deleteAction }: Props) {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  const unread = messages.filter((m) => !m.read).length;
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => (tab === "all" || !m.read) && (!q || `${m.name} ${m.email} ${m.body}`.toLowerCase().includes(q)));
  }, [messages, tab, query]);
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  function open(m: Message) {
    setSelectedId(m.id);
    setConfirming(false);
    if (!m.read) start(() => setReadAction(m.id, true));
  }
  function toggle(m: Message) {
    start(async () => {
      await setReadAction(m.id, !m.read);
      toast(m.read ? "Marked as unread" : "Marked as read");
    });
  }
  function remove(m: Message) {
    setSelectedId(null);
    setConfirming(false);
    start(async () => {
      await deleteAction(m.id);
      toast("Message deleted");
    });
  }

  return (
    <>
      <header className="ad-head">
        <div>
          <h1>Messages</h1>
          <p className="ad-sub">{messages.length} total · {unread} unread</p>
        </div>
      </header>
      <div className="ad-tools">
        <input type="search" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="ad-seg" role="group" aria-label="Filter messages">
          <button type="button" aria-pressed={tab === "all"} onClick={() => setTab("all")}>All</button>
          <button type="button" aria-pressed={tab === "unread"} onClick={() => setTab("unread")}>Unread ({unread})</button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="ad-empty"><p>No messages yet. Messages from your contact form will appear here.</p></div>
      ) : (
        <div className="ad-inbox" aria-busy={pending}>
          <ul className="ad-msgs">
            {list.length === 0 && <li className="ad-empty"><p>Nothing matches.</p></li>}
            {list.map((m) => (
              <li key={m.id}>
                <button type="button" className="ad-msg" aria-current={m.id === selectedId ? "true" : undefined} data-unread={!m.read} onClick={() => open(m)}>
                  <span className="ad-msg-top"><strong>{m.name}</strong><time dateTime={m.created_at}>{when(m.created_at)}</time></span>
                  {m.subject && <span className="ad-subject">{m.subject}</span>}
                  <span className="ad-msg-body">{m.body}</span>
                  {!m.read && <span className="ad-dot" aria-label="Unread" />}
                </button>
              </li>
            ))}
          </ul>
          <section className="ad-detail" aria-live="polite">
            {selected ? (
              <>
                <div className="ad-detail-head">
                  <div>
                    <h2>{selected.name}</h2>
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                    <p className="ad-sub">{when(selected.created_at)}</p>
                  </div>
                  <button type="button" className="ad-btn" onClick={() => setSelectedId(null)}>Back<span className="sr-only"> to list</span></button>
                </div>
                {selected.subject && <h3 className="ad-subject-h">{selected.subject}</h3>}
                <p className="ad-body">{selected.body}</p>
                <div className="ad-detail-actions">
                  <a className="ad-btn primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(selected.subject ? `Re: ${selected.subject}` : "Re: your message to Ayush Aryal")}`}>Reply by email</a>
                  <button type="button" className="ad-btn" onClick={() => toggle(selected)}>Mark as {selected.read ? "unread" : "read"}</button>
                  {confirming ? (
                    <>
                      <button type="button" className="ad-btn danger solid" onClick={() => remove(selected)}>Confirm delete</button>
                      <button type="button" className="ad-btn" onClick={() => setConfirming(false)}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" className="ad-btn danger" onClick={() => setConfirming(true)}>Delete</button>
                  )}
                </div>
              </>
            ) : (
              <div className="ad-empty"><p>Select a message to read it.</p></div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
