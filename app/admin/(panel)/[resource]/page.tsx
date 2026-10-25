import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteRow, saveRow, setPublished } from "@/app/admin/actions";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { requireAdmin } from "@/lib/auth";
import { isResourceKey, resources } from "@/lib/resources";

const rowsSchema = z.array(z.record(z.string(), z.unknown()));

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const db = await requireAdmin();
  const cfg = resources[resource];
  const { data } = await db.from(resource).select("*").order("sort_order");
  const rows = rowsSchema.parse(data ?? []);

  return (
    <ResourceManager
      label={cfg.label}
      singular={cfg.singular}
      titleKey={cfg.titleKey}
      fields={cfg.fields}
      rows={rows}
      saveAction={saveRow.bind(null, resource)}
      deleteAction={deleteRow.bind(null, resource)}
      publishAction={setPublished.bind(null, resource)}
    />
  );
}
