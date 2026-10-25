import { saveSettings } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { requireAdmin } from "@/lib/auth";
import { settingsFields } from "@/lib/resources";
import { seedSettings } from "@/lib/seed";

export default async function SettingsPage() {
  const db = await requireAdmin();
  const { data } = await db.from("settings").select("*").eq("id", 1).maybeSingle();
  const row: Record<string, unknown> = data ?? seedSettings;
  return (
    <>
      <header className="ad-head">
        <div>
          <h1>Settings</h1>
          <p className="ad-sub">Hero text, contact details, links and your About section.</p>
        </div>
      </header>
      <div className="ad-card">
        <AdminForm action={saveSettings} fields={settingsFields} row={row} submitLabel="Save settings" />
      </div>
    </>
  );
}
