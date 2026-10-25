import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const db = await requireAdmin();
  const { count } = await db.from("messages").select("id", { count: "exact", head: true }).eq("read", false);
  return (
    <div className="ad">
      <AdminNav unread={count ?? 0} signOutAction={signOut} />
      <main className="ad-main">{children}</main>
    </div>
  );
}
