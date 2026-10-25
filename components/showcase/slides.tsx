"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * The six interactive product demos for the hero showcase.
 * Everything here is local React state with sample data: no network requests, no real payments, no storage.
 * Each demo plays a short entrance animation, then responds to the visitor; once they interact, the gentle
 * "hint" pulses stop (`.touched`). Controls are real <button>/<input> elements so keyboard and screen readers work.
 */
export type SlideDef = { id: string; label: string; summary: string; Component: () => ReactNode };

const d = (n: number) => ({ "--d": n }) as CSSProperties;
const fmt = (n: number) => n.toLocaleString("en-US");

const PATHS = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>,
  box: <><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /></>,
  bill: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6H18a2 2 0 0 0 2-1.5L21.5 8H6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
};
const Ic = ({ n }: { n: keyof typeof PATHS }) => (
  <svg viewBox="0 0 24 24" className="ic" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PATHS[n]}</svg>
);

/** Per-demo state: `touched` flips on the first interaction and switches off the idle hint animations. */
function useDemo() {
  const [touched, setTouched] = useState(false);
  return { cls: touched ? "touched" : "demo", mark: () => setTouched(true) };
}

/** A short-lived status message that cleans up its own timer. */
function useToast(ms = 2400) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef(0);
  const show = useCallback(
    (m: string) => {
      setMsg(m);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), ms);
    },
    [ms],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { msg, show };
}

function Win({ title, className, children }: { title: string; className: string; children: ReactNode }) {
  return (
    <div className={`win ${className}`}>
      <div className="w-bar" aria-hidden="true"><i /><i /><i /><span>{title}</span></div>
      {children}
    </div>
  );
}

/** Segmented control: one pressed button at a time. */
function Seg<T extends string>({ label, value, options, onChange, hint }: { label: string; value: T; options: readonly (readonly [T, string])[]; onChange: (v: T) => void; hint?: T }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([id, text]) => (
        <button key={id} type="button" aria-pressed={value === id} className={hint === id && value !== id ? "hint" : undefined} onClick={() => onChange(id)}>{text}</button>
      ))}
    </div>
  );
}

const BARS = [42, 64, 50, 80, 68, 92, 74];

/* ───────────────────────── 1. Android app ───────────────────────── */
type OrderStatus = "new" | "packed" | "paid";
const NEXT: Record<OrderStatus, OrderStatus> = { new: "packed", packed: "paid", paid: "paid" };
const ORDER_LABEL: Record<OrderStatus, string> = { new: "New", packed: "Packed", paid: "Paid" };
const ORDER_CHIP: Record<OrderStatus, string> = { new: "b", packed: "a", paid: "g" };
type Tab = "home" | "orders" | "stats" | "me";

function AndroidSlide() {
  const { cls, mark } = useDemo();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("home");
  const [orders, setOrders] = useState<{ id: number; status: OrderStatus }[]>([
    { id: 1042, status: "paid" }, { id: 1043, status: "packed" }, { id: 1044, status: "new" }, { id: 1045, status: "new" },
  ]);
  const [filter, setFilter] = useState<"all" | "new" | "paid">("all");
  const [range, setRange] = useState<"week" | "month">("week");
  const [notify, setNotify] = useState(true);

  const open = orders.filter((o) => o.status !== "paid").length;
  const visible = orders.filter((o) => filter === "all" || o.status === filter);
  const advance = (id: number) => {
    const o = orders.find((x) => x.id === id);
    if (!o || o.status === "paid") return;
    const next = NEXT[o.status];
    setOrders((os) => os.map((x) => (x.id === id ? { ...x, status: next } : x)));
    toast.show(next === "paid" ? `✓ Order #${id} marked paid (demo)` : `Order #${id} is now ${ORDER_LABEL[next]}`);
  };
  const stats = range === "week" ? { total: "48k", bars: BARS, up: "▲ 12% vs last week" } : { total: "186k", bars: [58, 72, 66, 90], up: "▲ 9% vs last month" };
  const nav: [Tab, keyof typeof PATHS, string][] = [["home", "home", "Home"], ["orders", "list", "Orders"], ["stats", "chart", "Stats"], ["me", "user", "Profile"]];

  return (
    <div className={`s-android ${cls}`} onClickCapture={mark}>
      <div className="glow" />
      <div className="phone">
        <div className="ph-notch" />
        <div className="ph-status" aria-hidden="true"><span>9:41</span><span>5G ▮▮▮</span></div>
        <div className="ph-screen" key={tab}>
          {tab === "home" && (
            <>
              <div className="ph-head"><div><small>Good morning</small><b>Today&rsquo;s sales</b></div><i className="avatar">AA</i></div>
              <div className="ph-hero">
                <small>Total sales</small>
                <div className="big">Rs <b className="count-up" style={{ "--to": 48 } as CSSProperties} />k</div>
                <span className="up">▲ 12% vs yesterday</span>
                <div className="bars">{BARS.map((h, i) => <i key={i} style={{ height: `${h}%`, ...d(i) }} />)}</div>
              </div>
              <div className="ph-grid"><div><small>Orders today</small><b>126</b></div><div><small>Open orders</small><b>{open}</b></div></div>
              <ul className="ph-list">
                {orders.slice(0, 3).map((o) => (
                  <li key={o.id}><i className={`dot ${ORDER_CHIP[o.status]}`} /><span>Order #{o.id}</span><em className={`chip ${ORDER_CHIP[o.status]}`}>{ORDER_LABEL[o.status]}</em></li>
                ))}
              </ul>
            </>
          )}
          {tab === "orders" && (
            <>
              <div className="ph-head"><div><small>{open} open</small><b>Orders</b></div></div>
              <Seg label="Filter orders" value={filter} onChange={setFilter} options={[["all", "All"], ["new", "New"], ["paid", "Paid"]]} />
              <ul className="ph-list ph-tap">
                {visible.length === 0 && <li className="empty">No orders in this view</li>}
                {visible.map((o, i) => (
                  <li key={o.id}>
                    <button type="button" onClick={() => advance(o.id)} disabled={o.status === "paid"} aria-label={`Order ${o.id}, ${ORDER_LABEL[o.status]}${o.status === "paid" ? "" : ". Tap to advance status"}`} className={i === 0 && o.status !== "paid" ? "hint" : undefined}>
                      <i className={`dot ${ORDER_CHIP[o.status]}`} /><span>Order #{o.id}</span><em className={`chip ${ORDER_CHIP[o.status]}`}>{ORDER_LABEL[o.status]}</em>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="ph-help">Tap an order to move it forward.</p>
            </>
          )}
          {tab === "stats" && (
            <>
              <div className="ph-head"><div><small>Sales</small><b>Overview</b></div></div>
              <Seg label="Time range" value={range} onChange={setRange} options={[["week", "Week"], ["month", "Month"]]} />
              <div className="ph-hero" key={range}>
                <small>Total</small>
                <div className="big">Rs {stats.total}</div>
                <span className="up">{stats.up}</span>
                <div className="bars">{stats.bars.map((h, i) => <i key={i} style={{ height: `${h}%`, ...d(i) }} />)}</div>
              </div>
            </>
          )}
          {tab === "me" && (
            <>
              <div className="ph-head"><div><small>Account</small><b>Profile</b></div></div>
              <div className="ph-card"><i className="avatar big-av">AA</i><div><b>Shop owner</b><small>Sample account</small></div></div>
              <button type="button" role="switch" aria-checked={notify} className="ph-switch" onClick={() => { setNotify((n) => !n); toast.show(notify ? "Notifications off" : "Notifications on"); }}>
                <span>Order notifications</span><i aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        {toast.msg && <div className="ph-toast" role="status">{toast.msg}</div>}
        <nav className="ph-nav" aria-label="App sections">
          {nav.map(([id, icon, label]) => (
            <button key={id} type="button" aria-label={label} aria-current={tab === id ? "page" : undefined} className={id === "orders" && tab !== id ? "hint" : undefined} onClick={() => setTab(id)}>
              <Ic n={icon} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ───────────────────────── 2. Desktop software ───────────────────────── */
type Bill = { id: number; cust: string; amt: number; status: "paid" | "pending" };
type View = "dash" | "billing" | "stock" | "reports";

function DesktopSlide() {
  const { cls, mark } = useDemo();
  const toast = useToast();
  const [view, setView] = useState<View>("billing");
  const [bills, setBills] = useState<Bill[]>([
    { id: 2085, cust: "Sita Traders", amt: 12400, status: "paid" },
    { id: 2086, cust: "Ram Hardware", amt: 8950, status: "pending" },
    { id: 2087, cust: "Himal Stores", amt: 21300, status: "pending" },
    { id: 2088, cust: "Gita Mart", amt: 4200, status: "paid" },
  ]);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [sel, setSel] = useState<number | null>(2087);
  const [modal, setModal] = useState(false);
  const [cust, setCust] = useState("Gita Mart");
  const [amt, setAmt] = useState("5000");
  const [stock, setStock] = useState([{ name: "Steel pipe 2in", n: 84 }, { name: "Cement 50kg", n: 31 }, { name: "Paint 4L", n: 12 }, { name: "Wire 1.5mm", n: 56 }]);

  const shown = bills.filter((b) => filter === "all" || b.status === filter);
  const selected = bills.find((b) => b.id === sel) ?? null;
  const total = bills.reduce((s, b) => s + b.amt, 0);
  const paid = bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.amt, 0);
  const createBill = () => {
    const n = Math.max(1, Math.min(1_000_000, Math.round(Number(amt) || 0)));
    const id = Math.max(...bills.map((b) => b.id)) + 1;
    setBills((bs) => [...bs, { id, cust, amt: n, status: "pending" }]);
    setSel(id);
    setFilter("all");
    setModal(false);
    toast.show(`Bill #${id} created (demo)`);
  };
  const markPaid = (id: number) => {
    setBills((bs) => bs.map((b) => (b.id === id ? { ...b, status: "paid" } : b)));
    toast.show(`Bill #${id} marked as paid (demo)`);
  };
  const side: [View, keyof typeof PATHS, string][] = [["dash", "grid", "Dashboard"], ["billing", "bill", "Billing"], ["stock", "box", "Inventory"], ["reports", "chart", "Reports"]];

  return (
    <Win title="BillDesk · Billing" className={`s-desk ${cls}`}>
      <div className="w-body" onClickCapture={mark} onKeyDown={(e) => e.key === "Escape" && setModal(false)}>
        <aside aria-label="BillDesk sections">
          <b className="brand">BillDesk</b>
          {side.map(([id, icon, label]) => (
            <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}><Ic n={icon} />{label}</button>
          ))}
        </aside>
        <main className="screen" key={view}>
          {view === "billing" && (
            <>
              <div className="w-head">
                <b>Bills</b>
                <Seg label="Filter bills" value={filter} onChange={setFilter} options={[["all", "All"], ["paid", "Paid"], ["pending", "Pending"]]} />
                <span className="gap" />
                <button type="button" className="btn-s ghost" onClick={() => toast.show("Print preview opened (demo)")}>Print</button>
                <button type="button" className={`btn-s${cls === "demo" ? " hint" : ""}`} onClick={() => setModal(true)}>+ New bill</button>
              </div>
              <div className="bl">
                <div className="grid-t" role="group" aria-label="Bills">
                  <div className="tr th"><span>Bill</span><span>Customer</span><span>Amount</span><span>Status</span></div>
                  {shown.length === 0 && <div className="tr empty"><span>No bills in this view</span></div>}
                  {shown.map((b) => (
                    <button key={b.id} type="button" className="tr row" aria-pressed={sel === b.id} onClick={() => setSel(b.id)}>
                      <span>#{b.id}</span><span className="ell">{b.cust}</span><span>Rs {fmt(b.amt)}</span>
                      <span><em className={`chip ${b.status === "paid" ? "g" : "a"}`}>{b.status === "paid" ? "Paid" : "Pending"}</em></span>
                    </button>
                  ))}
                </div>
                {selected && (
                  <div className="w-panel" role="group" aria-label={`Bill ${selected.id} details`}>
                    <div><b>Bill #{selected.id}</b><small>{selected.cust}</small></div>
                    <div className="w-sum">
                      <p><span>Subtotal</span><span>Rs {fmt(Math.round(selected.amt / 1.13))}</span></p>
                      <p><span>VAT 13%</span><span>Rs {fmt(selected.amt - Math.round(selected.amt / 1.13))}</span></p>
                      <p className="tot"><span>Total</span><span>Rs {fmt(selected.amt)}</span></p>
                    </div>
                    {selected.status === "pending" ? <button type="button" className="btn-s" onClick={() => markPaid(selected.id)}>Mark as paid</button> : <em className="chip g">Paid</em>}
                  </div>
                )}
              </div>
            </>
          )}
          {view === "dash" && (
            <>
              <div className="w-head"><b>Dashboard</b></div>
              <div className="mini-kpis">
                <div><small>Billed</small><b>Rs {fmt(total)}</b></div>
                <div><small>Collected</small><b>Rs {fmt(paid)}</b></div>
                <div><small>Outstanding</small><b>Rs {fmt(total - paid)}</b></div>
              </div>
              <p className="note-s">Figures update as you create bills or mark them as paid in Billing.</p>
            </>
          )}
          {view === "stock" && (
            <>
              <div className="w-head"><b>Inventory</b></div>
              <ul className="stock">
                {stock.map((s, i) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <i className="stock-bar"><u style={{ width: `${Math.min(100, s.n)}%` }} className={s.n < 35 ? "low" : undefined} /></i>
                    <em className={`chip ${s.n < 35 ? "a" : "g"}`}>{s.n < 35 ? "Low" : "OK"} · {s.n}</em>
                    <button type="button" className="btn-s ghost" aria-label={`Restock ${s.name} by 10`} onClick={() => setStock((st) => st.map((x, j) => (j === i ? { ...x, n: x.n + 10 } : x)))}>+10</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {view === "reports" && (
            <>
              <div className="w-head"><b>Reports</b></div>
              <div className="rep">
                <small>Collected vs outstanding</small>
                <div className="stack"><i style={{ width: `${total ? (paid / total) * 100 : 0}%` }} className="g" /><i style={{ width: `${total ? ((total - paid) / total) * 100 : 0}%` }} className="a" /></div>
                <p><span><i className="dot g" /> Collected Rs {fmt(paid)}</span><span><i className="dot a" /> Outstanding Rs {fmt(total - paid)}</span></p>
                <div className="bars">{BARS.map((h, i) => <i key={i} style={{ height: `${h}%`, ...d(i) }} />)}</div>
              </div>
            </>
          )}
        </main>
        {modal && (
          <div className="modal" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <form role="dialog" aria-modal="true" aria-label="New bill" onSubmit={(e) => { e.preventDefault(); createBill(); }}>
              <b>New bill</b>
              <label>Customer
                <select value={cust} onChange={(e) => setCust(e.target.value)} autoFocus>
                  {["Gita Mart", "Tara Electric", "Mount Supplies"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>Amount (Rs)
                <input type="number" inputMode="numeric" min={1} max={1000000} value={amt} onChange={(e) => setAmt(e.target.value)} />
              </label>
              <div className="m-actions">
                <button type="button" className="btn-s ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn-s">Create bill</button>
              </div>
              <small>Demo only: nothing is saved or sent.</small>
            </form>
          </div>
        )}
        {toast.msg && <div className="toast" role="status">{toast.msg}</div>}
      </div>
    </Win>
  );
}

/* ───────────────────────── 3. Backend API ───────────────────────── */
type Endpoint = { id: string; method: "GET" | "POST" | "DELETE"; path: string; status: number; text: string; ms: number; body: string[] };
const ENDPOINTS: Endpoint[] = [
  { id: "products", method: "GET", path: "/api/products", status: 200, text: "OK", ms: 42, body: ["{", '  "items": [', '    { "id": 1, "name": "Steel pipe 2in", "stock": 84 },', '    { "id": 2, "name": "Cement 50kg", "stock": 31 }', "  ],", '  "total": 128', "}"] },
  { id: "orders", method: "POST", path: "/api/orders", status: 201, text: "Created", ms: 88, body: ["{", '  "id": 1046,', '  "status": "created",', '  "items": 3,', '  "total": 5200', "}"] },
  { id: "analytics", method: "GET", path: "/api/analytics", status: 200, text: "OK", ms: 64, body: ["{", '  "revenue": 48250,', '  "orders": 126,', '  "growth": 0.12,', '  "period": "7d"', "}"] },
  { id: "delete", method: "DELETE", path: "/api/orders/1046", status: 204, text: "No Content", ms: 31, body: ["// 204 responses have no body"] },
];
const METHOD_CLASS = { GET: "get", POST: "post", DELETE: "del" } as const;

function ApiSlide() {
  const { cls, mark } = useDemo();
  const [sel, setSel] = useState("products");
  const [shown, setShown] = useState<{ id: string; n: number } | null>({ id: "products", n: 0 });
  const [loading, setLoading] = useState(false);
  const timer = useRef(0);
  const ep = ENDPOINTS.find((e) => e.id === sel) ?? ENDPOINTS[0]!;
  const res = shown ? ENDPOINTS.find((e) => e.id === shown.id) : null;

  useEffect(() => () => window.clearTimeout(timer.current), []);
  const send = () => {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setShown((s) => ({ id: sel, n: (s?.n ?? 0) + 1 }));
    }, 450);
  };
  const choose = (id: string) => {
    window.clearTimeout(timer.current);
    setLoading(false);
    setSel(id);
  };

  return (
    <Win title="api-console" className={`s-api ${cls}`}>
      <div className="api-body" onClickCapture={mark}>
        <ul className="eps" aria-label="Endpoints">
          {ENDPOINTS.map((e) => (
            <li key={e.id}>
              <button type="button" aria-pressed={sel === e.id} onClick={() => choose(e.id)}>
                <span className={`m ${METHOD_CLASS[e.method]}`}>{e.method}</span><code>{e.path}</code>
              </button>
            </li>
          ))}
        </ul>
        <div className="req">
          <span className={`m ${METHOD_CLASS[ep.method]}`}>{ep.method}</span><code>{ep.path}</code>
          <button type="button" className={`btn-s${cls === "demo" ? " hint" : ""}`} onClick={send} disabled={loading}>{loading ? "Sending…" : "Send request"}</button>
        </div>
        <div className="resp" aria-live="polite">
          {loading ? (
            <p className="r-wait">Waiting for response…</p>
          ) : res && shown && res.id === sel ? (
            <>
              <div className="r-head"><span className={res.status < 300 ? "ok" : "bad"}>{res.status} {res.text}</span><span>{res.ms} ms</span><span>application/json</span></div>
              <pre key={`${shown.id}-${shown.n}`}><code>{res.body.map((line, i) => <span key={i} style={d(i)}>{line}</span>)}</code></pre>
            </>
          ) : (
            <p className="r-wait">Choose <b>Send request</b> to call {ep.method} {ep.path}.</p>
          )}
          <p className="note-s">Simulated responses. No network request is made.</p>
        </div>
      </div>
    </Win>
  );
}

/* ───────────────────────── 4. Analytics dashboard ───────────────────────── */
type Period = "7d" | "30d" | "12m";
const PERIODS: Record<Period, { rev: string; orders: string; cust: string; conv: string; delta: string[]; series: number[]; bars: number[]; labels: string[]; revNum: number; note: string }> = {
  "7d": { rev: "Rs 482k", orders: "1,260", cust: "842", conv: "3.8%", delta: ["▲ 12%", "▲ 8%", "▲ 5%", "▼ 0.2"], series: [38, 52, 44, 68, 60, 84, 72], bars: [42, 64, 50, 80, 68, 92, 74], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], revNum: 482, note: "Best day: Saturday" },
  "30d": { rev: "Rs 1.9M", orders: "5,180", cust: "2,310", conv: "3.5%", delta: ["▲ 9%", "▲ 6%", "▲ 11%", "▼ 0.1"], series: [30, 44, 40, 58, 66, 62, 80], bars: [48, 56, 62, 58, 74, 70, 88], labels: ["Wk 1", "Wk 1", "Wk 2", "Wk 2", "Wk 3", "Wk 3", "Wk 4"], revNum: 1920, note: "Best stretch: week 4" },
  "12m": { rev: "Rs 21.4M", orders: "61,300", cust: "14,900", conv: "3.2%", delta: ["▲ 21%", "▲ 17%", "▲ 24%", "▲ 0.3"], series: [26, 34, 42, 38, 56, 70, 86], bars: [30, 38, 46, 44, 62, 76, 90], labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"], revNum: 21400, note: "Best month: December" },
};
const KPI_KEYS = [["Revenue", "rev"], ["Orders", "orders"], ["Customers", "cust"], ["Conversion", "conv"]] as const;
const pointXY = (v: number, i: number) => [(i * 300) / 6, 104 - (v / 100) * 92] as const;
const curve = (series: number[]) =>
  series.reduce((p, v, i) => {
    const [x, y] = pointXY(v, i);
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = pointXY(series[i - 1]!, i - 1);
    const mx = (px + x) / 2;
    return `${p} C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }, "");

function DashSlide() {
  const { cls, mark } = useDemo();
  const [period, setPeriod] = useState<Period>("7d");
  const [pt, setPt] = useState<number | null>(null);
  const [kpi, setKpi] = useState<number | null>(null);
  const p = PERIODS[period];
  const sum = p.series.reduce((a, b) => a + b, 0);
  const line = curve(p.series);
  const activity = [["g", "New order #1046", "2m"], ["b", "Customer signed up", "9m"], ["a", "Low stock: Cement 50kg", "21m"]] as const;

  return (
    <Win title="Analytics · sample data" className={`s-dash ${cls}`}>
      <div className="d-body" onClickCapture={mark}>
        <div className="d-bar">
          <Seg label="Time period" value={period} onChange={(v) => { setPeriod(v); setPt(null); }} hint="30d" options={[["7d", "7 days"], ["30d", "30 days"], ["12m", "12 months"]]} />
        </div>
        <div className="kpis" key={period}>
          {KPI_KEYS.map(([label, key], i) => (
            <button key={key} type="button" aria-pressed={kpi === i} onClick={() => setKpi(kpi === i ? null : i)}>
              <small>{label}</small><b>{p[key]}</b><em className={p.delta[i]!.startsWith("▲") ? "up" : "dn"}>{p.delta[i]}</em>
            </button>
          ))}
        </div>
        <div className="d-row">
          <div className="panel chart">
            <small>Revenue</small>
            <div className="plot" key={`${period}-plot`}>
              <svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="g-dash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7297ff" stopOpacity=".45" /><stop offset="1" stopColor="#7297ff" stopOpacity="0" /></linearGradient></defs>
                <path className="area" d={`${line} L300 110 L0 110 Z`} fill="url(#g-dash)" />
                <path className="line" pathLength="1" d={line} fill="none" stroke="#7297ff" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              {p.series.map((v, i) => {
                const [x, y] = pointXY(v, i);
                return (
                  <button key={i} type="button" className="pt-btn" aria-pressed={pt === i} aria-label={`${p.labels[i]}: Rs ${Math.round((p.revNum * v) / sum)}k`} style={{ left: `${(x / 300) * 100}%`, top: `${(y / 110) * 100}%` }} onClick={() => setPt(pt === i ? null : i)} />
                );
              })}
              {pt !== null && (
                <div className="tip" style={{ left: `${(pointXY(p.series[pt]!, pt)[0] / 300) * 100}%`, top: `${(pointXY(p.series[pt]!, pt)[1] / 110) * 100}%` }} role="status">
                  {p.labels[pt]} · Rs {Math.round((p.revNum * p.series[pt]!) / sum)}k
                </div>
              )}
            </div>
          </div>
          <div className="panel bars2">
            <small>Orders</small>
            <div className="bars" key={`${period}-bars`}>{p.bars.map((h, i) => <i key={i} className={pt === i ? "sel" : undefined} style={{ height: `${h}%`, ...d(i) }} />)}</div>
          </div>
        </div>
        <div className="panel activity" aria-live="polite">
          {kpi !== null ? (
            <p className="detail"><b>{KPI_KEYS[kpi]![0]}</b> {p[KPI_KEYS[kpi]![1]]} ({p.delta[kpi]}) · {p.note}</p>
          ) : (
            activity.map(([c, text, t]) => <p key={text}><i className={`dot ${c}`} />{text} <span>{t}</span></p>)
          )}
        </div>
      </div>
    </Win>
  );
}

/* ───────────────────────── 5. Finance and billing ───────────────────────── */
type InvStatus = "draft" | "pending" | "paid" | "overdue";
const INV_CHIP: Record<InvStatus, string> = { draft: "m", pending: "a", paid: "g", overdue: "r" };
const INV_LABEL: Record<InvStatus, string> = { draft: "Draft", pending: "Pending", paid: "Paid", overdue: "Overdue" };

function FinanceSlide() {
  const { cls, mark } = useDemo();
  const toast = useToast(3200);
  const [inv, setInv] = useState<{ id: number; client: string; amt: number; st: InvStatus }[]>([
    { id: 231, client: "Sita Traders", amt: 12400, st: "paid" },
    { id: 232, client: "Ram Hardware", amt: 8950, st: "pending" },
    { id: 233, client: "Himal Stores", amt: 21300, st: "overdue" },
    { id: 234, client: "Gita Mart", amt: 4200, st: "draft" },
    { id: 235, client: "Tara Electric", amt: 15750, st: "paid" },
  ]);
  const [sel, setSel] = useState(232);
  const cur = inv.find((i) => i.id === sel) ?? inv[0]!;
  const received = 128000 + inv.filter((i) => i.st === "paid").reduce((s, i) => s + i.amt, 0);
  const outstanding = inv.filter((i) => i.st === "pending" || i.st === "overdue").reduce((s, i) => s + i.amt, 0);
  const setStatus = (st: InvStatus) => setInv((xs) => xs.map((x) => (x.id === cur.id ? { ...x, st } : x)));
  const confirm = () => {
    setStatus("paid");
    toast.show(`Simulated: INV-0${cur.id} marked paid. No real payment was made.`);
  };
  const counts = (["paid", "pending", "overdue", "draft"] as const).map((s) => [s, inv.filter((i) => i.st === s).length] as const);

  return (
    <Win title="Invoicer · sample data" className={`s-fin ${cls}`}>
      <div className="f-body" onClickCapture={mark}>
        <div className="inv" role="group" aria-label="Invoices">
          <div className="tr th"><span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span></div>
          {inv.map((i) => (
            <button key={i.id} type="button" className="tr row" aria-pressed={sel === i.id} onClick={() => setSel(i.id)}>
              <span>INV-0{i.id}</span><span className="ell">{i.client}</span><span>Rs {fmt(i.amt)}</span>
              <span><em className={`chip ${INV_CHIP[i.st]}`} key={i.st}>{INV_LABEL[i.st]}</em></span>
            </button>
          ))}
        </div>
        <div className="f-side">
          <div className="sum">
            <small>Received this month</small>
            <b key={received}>Rs {fmt(received)}</b>
            <p><span>Outstanding</span><span key={outstanding}>Rs {fmt(outstanding)}</span></p>
            <div className="stack" aria-hidden="true">{counts.map(([s, n]) => <i key={s} className={INV_CHIP[s]} style={{ flex: n }} />)}</div>
          </div>
          <div className="panel detail-card">
            <small>INV-0{cur.id} · {cur.client}</small>
            <Seg label="Invoice status" value={cur.st} onChange={setStatus} options={[["draft", "Draft"], ["pending", "Pending"], ["paid", "Paid"], ["overdue", "Late"]]} />
            <button type="button" className={`btn-s${cls === "demo" && cur.st !== "paid" ? " hint" : ""}`} disabled={cur.st === "paid"} onClick={confirm}>{cur.st === "paid" ? "Payment confirmed" : "Confirm payment (simulated)"}</button>
          </div>
        </div>
        {toast.msg && <div className="toast" role="status">{toast.msg}</div>}
      </div>
    </Win>
  );
}

/* ───────────────────────── 6. E-commerce ───────────────────────── */
type Product = { id: string; name: string; price: number; left?: number; blurb: string };
const PRODUCTS: Product[] = [
  { id: "bag", name: "Canvas backpack", price: 2490, blurb: "Water-resistant canvas, 20 L, padded laptop sleeve." },
  { id: "bottle", name: "Steel bottle", price: 890, left: 3, blurb: "Insulated 750 ml bottle. Keeps drinks cold for a day." },
  { id: "buds", name: "Wireless earbuds", price: 3990, blurb: "Bluetooth earbuds with a charging case." },
  { id: "lamp", name: "Desk lamp", price: 1750, blurb: "Adjustable warm-light LED desk lamp." },
];
const THUMB: Record<string, ReactNode> = {
  bag: <><rect width="80" height="60" fill="#22304f" /><rect x="24" y="16" width="32" height="34" rx="6" fill="#7297ff" /><path d="M32 18c0-9 16-9 16 0" fill="none" stroke="#dbe5ff" strokeWidth="3" /></>,
  bottle: <><rect width="80" height="60" fill="#2c2a44" /><rect x="32" y="8" width="16" height="8" rx="2" fill="#b9a7ff" /><rect x="28" y="14" width="24" height="38" rx="8" fill="#8f7cf0" /></>,
  buds: <><rect width="80" height="60" fill="#1f3a3a" /><circle cx="28" cy="32" r="11" fill="#4de0b0" /><circle cx="52" cy="32" r="11" fill="#39b88f" /><path d="M28 21c0-12 24-12 24 0" fill="none" stroke="#c8f5e6" strokeWidth="3" /></>,
  lamp: <><rect width="80" height="60" fill="#3a2f22" /><path d="M40 8l16 22H24z" fill="#ffb454" /><rect x="38" y="30" width="4" height="18" fill="#e8d4b0" /><rect x="28" y="48" width="24" height="4" rx="2" fill="#e8d4b0" /></>,
};
const Thumb = ({ id }: { id: string }) => <svg viewBox="0 0 80 60" aria-hidden="true">{THUMB[id]}</svg>;
const STEPS = ["Placed", "Packed", "Shipped"] as const;

function StoreSlide() {
  const { cls, mark } = useDemo();
  const toast = useToast();
  const [cart, setCart] = useState<Record<string, number>>({ bag: 1 });
  const [sel, setSel] = useState("bottle");
  const [panel, setPanel] = useState<"details" | "cart">("details");
  const [order, setOrder] = useState<{ no: number; step: number } | null>(null);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const lines = PRODUCTS.filter((p) => cart[p.id]);
  const total = lines.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const cur = PRODUCTS.find((p) => p.id === sel) ?? PRODUCTS[0]!;
  const limit = (p: Product) => p.left ?? 9;
  const add = (p: Product, by = 1) => {
    const have = cart[p.id] ?? 0;
    const next = Math.max(0, Math.min(limit(p), have + by));
    if (next === have) return toast.show(by > 0 ? `Only ${limit(p)} in stock` : "Already removed");
    setCart((c) => {
      const n = { ...c, [p.id]: next };
      if (next === 0) delete n[p.id];
      return n;
    });
    if (by > 0) toast.show(`${p.name} added to cart`);
  };

  return (
    <Win title="Storefront · sample data" className={`s-shop ${cls}`}>
      <div className="sh-body" onClickCapture={mark}>
        <div className="sh-top">
          <b>North&amp;Co</b>
          <span className="search" aria-hidden="true"><Ic n="search" />Search products</span>
          <button type="button" className="cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`} aria-pressed={panel === "cart"} onClick={() => setPanel(panel === "cart" ? "details" : "cart")}>
            <Ic n="cart" /><i className="cart-badge" key={count}>{count}</i>
          </button>
        </div>
        <div className="sh-main">
          <div className="prods">
            {PRODUCTS.map((p) => (
              <div key={p.id} className={`p${sel === p.id ? " on" : ""}`}>
                <button type="button" className="p-open" aria-pressed={sel === p.id} aria-label={`View ${p.name}`} onClick={() => { setSel(p.id); setPanel("details"); }}>
                  <Thumb id={p.id} /><b>{p.name}</b><span>Rs {fmt(p.price)}</span>
                  <em className={`chip ${p.left ? "a" : "g"}`}>{p.left ? `Only ${p.left} left` : "In stock"}</em>
                </button>
                <button type="button" className={`addbtn${cls === "demo" && p.id === "bottle" ? " hint" : ""}`} aria-label={`Add ${p.name} to cart`} onClick={() => add(p)}>Add</button>
              </div>
            ))}
          </div>
          <div className="order" key={`${panel}-${order?.no ?? 0}`}>
            {panel === "details" ? (
              <>
                <small>Product</small>
                <b>{cur.name}</b>
                <p className="blurb">{cur.blurb}</p>
                <p className="tot"><span>Price</span><span>Rs {fmt(cur.price)}</span></p>
                <div className="qty" role="group" aria-label={`Quantity of ${cur.name}`}>
                  <button type="button" aria-label="Decrease quantity" onClick={() => add(cur, -1)} disabled={!cart[cur.id]}>−</button>
                  <output aria-live="polite">{cart[cur.id] ?? 0}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => add(cur, 1)} disabled={(cart[cur.id] ?? 0) >= limit(cur)}>+</button>
                </div>
              </>
            ) : order ? (
              <>
                <small>Order #{order.no} (demo)</small>
                <b>{STEPS[order.step]}</b>
                <div className="steps" aria-hidden="true">{STEPS.map((s, i) => <i key={s} className={i <= order.step ? "on" : undefined} />)}</div>
                <div className="step-l" aria-hidden="true">{STEPS.map((s, i) => <span key={s} className={i === order.step ? "now" : undefined}>{s}</span>)}</div>
                <button type="button" className="btn-s" disabled={order.step === STEPS.length - 1} onClick={() => setOrder({ ...order, step: order.step + 1 })}>Advance status</button>
                <button type="button" className="btn-s ghost" onClick={() => { setOrder(null); setPanel("details"); }}>Done</button>
              </>
            ) : (
              <>
                <small>Your cart</small>
                {lines.length === 0 && <p className="blurb">Your cart is empty. Add a product to see it here.</p>}
                {lines.map((p) => (
                  <div className="line" key={p.id}>
                    <span>{p.name}</span>
                    <span className="qty sm">
                      <button type="button" aria-label={`Remove one ${p.name}`} onClick={() => add(p, -1)}>−</button>
                      <output>{cart[p.id]}</output>
                      <button type="button" aria-label={`Add one ${p.name}`} onClick={() => add(p, 1)} disabled={(cart[p.id] ?? 0) >= limit(p)}>+</button>
                    </span>
                  </div>
                ))}
                <p className="tot"><span>Total</span><span>Rs {fmt(total)}</span></p>
                <button type="button" className="btn-s" disabled={lines.length === 0} onClick={() => { setOrder({ no: 1046, step: 0 }); setCart({}); }}>Checkout (demo)</button>
              </>
            )}
          </div>
        </div>
        {toast.msg && <div className="toast" role="status">{toast.msg}</div>}
      </div>
    </Win>
  );
}

export const SLIDES: SlideDef[] = [
  { id: "android", label: "Android app", summary: "Interactive Android business app demo: switch between Home, Orders, Stats and Profile, filter orders, advance an order's status and change the chart range. Sample data.", Component: AndroidSlide },
  { id: "desktop", label: "Desktop software", summary: "Interactive desktop billing demo: use the sidebar, filter and select bills, create a bill in a dialog and mark a bill as paid. Sample data.", Component: DesktopSlide },
  { id: "api", label: "Backend API", summary: "Interactive API console demo: pick an endpoint such as GET /api/products or POST /api/orders and send a simulated request to see its status and JSON response.", Component: ApiSlide },
  { id: "dashboard", label: "Analytics dashboard", summary: "Interactive analytics dashboard demo: change the time period, select a data point or a metric card to see details. Sample data.", Component: DashSlide },
  { id: "finance", label: "Finance and billing", summary: "Interactive invoicing demo: select an invoice, change its status or confirm a simulated payment and watch the totals update. No real payments.", Component: FinanceSlide },
  { id: "store", label: "E-commerce platform", summary: "Interactive store demo: view a product, add it to the cart, change quantities, open the cart and check out with a simulated order. Sample data.", Component: StoreSlide },
];
