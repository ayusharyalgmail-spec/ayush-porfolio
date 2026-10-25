import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { messageRow } from "@/lib/schemas";

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Dashboard() {
  const db = await requireAdmin();
  const count = async (table: string, published?: boolean) => {
    const q = db.from(table).select("id", { count: "exact", head: true });
    const { count: n } = await (published === undefined ? q : q.eq("published", published));
    return n ?? 0;
  };
  const [projects, projectsLive, skills, testimonials, testimonialsLive, unread, recent, settings] = await Promise.all([
    count("projects"),
    count("projects", true),
    count("skills"),
    count("testimonials"),
    count("testimonials", true),
    db.from("messages").select("id", { count: "exact", head: true }).eq("read", false).then((r) => r.count ?? 0),
    db.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
    db.from("settings").select("github_url, instagram_url, photo_url, whatsapp, phone").eq("id", 1).maybeSingle(),
  ]);
  const messages = messageRow.array().parse(recent.data ?? []);
  const s = settings.data as Record<string, string | null> | null;

  const todo = [
    { done: Boolean(s?.github_url), text: "Add your GitHub link", href: "/admin/settings" },
    { done: Boolean(s?.instagram_url), text: "Add your Instagram link", href: "/admin/settings" },
    { done: Boolean(s?.photo_url), text: "Add a profile photo (shows on the About section)", href: "/admin/settings" },
    { done: testimonialsLive > 0, text: "Publish a real client testimonial", href: "/admin/testimonials" },
    { done: projects > 0 && projectsLive === projects, text: "Publish or remove draft projects", href: "/admin/projects" },
  ];

  return (
    <>
      <header className="ad-head">
        <div>
          <h1>Dashboard</h1>
          <p className="ad-sub">Changes you save here appear on the site within a minute.</p>
        </div>
        <a className="ad-btn" href="/" target="_blank" rel="noopener noreferrer">View site<span className="sr-only"> (opens in a new tab)</span></a>
      </header>

      <div className="ad-stats">
        <Link href="/admin/projects" className="ad-stat"><b>{projectsLive}</b><span>live projects{projects > projectsLive ? ` · ${projects - projectsLive} draft` : ""}</span></Link>
        <Link href="/admin/skills" className="ad-stat"><b>{skills}</b><span>skills</span></Link>
        <Link href="/admin/testimonials" className="ad-stat"><b>{testimonialsLive}</b><span>live testimonials{testimonials > testimonialsLive ? ` · ${testimonials - testimonialsLive} draft` : ""}</span></Link>
        <Link href="/admin/messages" className="ad-stat" data-hot={unread > 0}><b>{unread}</b><span>unread messages</span></Link>
      </div>

      <div className="ad-cols">
        <section className="ad-card" aria-labelledby="recent-title">
          <div className="ad-card-head"><h2 id="recent-title">Recent messages</h2><Link href="/admin/messages">Open inbox</Link></div>
          {messages.length === 0 ? (
            <p className="ad-empty-text">No messages yet. They will show up here when someone uses your contact form.</p>
          ) : (
            <ul className="ad-recent">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link href="/admin/messages" data-unread={!m.read}>
                    <span><strong>{m.name}</strong> <time dateTime={m.created_at}>{when(m.created_at)}</time></span>
                    <span className="ad-msg-body">{m.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ad-card" aria-labelledby="todo-title">
          <div className="ad-card-head"><h2 id="todo-title">Finish setting up</h2><span className="ad-sub">{todo.filter((t) => t.done).length}/{todo.length} done</span></div>
          <ul className="ad-todo">
            {todo.map((t) => (
              <li key={t.text} data-done={t.done}>
                <span aria-hidden="true">{t.done ? "✓" : "○"}</span>
                {t.done ? <s>{t.text}</s> : <Link href={t.href}>{t.text}</Link>}
                {t.done && <span className="sr-only"> (done)</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
