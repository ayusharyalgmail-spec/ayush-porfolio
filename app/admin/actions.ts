"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { isResourceKey, resources, type FormState } from "@/lib/resources";
import { loginSchema, settingsSchema } from "@/lib/schemas";
import { serverClient } from "@/lib/supabase/server";

const idSchema = z.uuid();
const refresh = (path: string) => {
  revalidatePath("/");
  revalidatePath(path);
};
const failure = (error: z.ZodError): FormState => ({ ok: false, message: "Please fix the highlighted fields.", errors: z.flattenError(error).fieldErrors });

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Enter a valid email and a password of at least 8 characters." };
  const db = await serverClient();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { ok: false, message: "Invalid email or password." };
  const { data: row } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) {
    await db.auth.signOut();
    return { ok: false, message: "This account is not an administrator." };
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const db = await serverClient();
  await db?.auth.signOut();
  redirect("/admin/login");
}

export async function saveRow(resource: string, _prev: FormState, formData: FormData): Promise<FormState> {
  if (!isResourceKey(resource)) return { ok: false, message: "Unknown resource." };
  const db = await requireAdmin();
  const parsed = resources[resource].schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failure(parsed.error);
  const rawId = formData.get("id");
  const id = typeof rawId === "string" && rawId ? idSchema.safeParse(rawId) : null;
  if (id && !id.success) return { ok: false, message: "Invalid id." };
  const values: Record<string, unknown> = parsed.data;
  const { error } = id ? await db.from(resource).update(values).eq("id", id.data) : await db.from(resource).insert(values);
  if (error) return { ok: false, message: error.code === "23505" ? "That slug is already used." : "Could not save. Please try again." };
  refresh(`/admin/${resource}`);
  return { ok: true, message: "Saved." };
}

export async function deleteRow(resource: string, id: string): Promise<void> {
  if (!isResourceKey(resource) || !idSchema.safeParse(id).success) return;
  const db = await requireAdmin();
  await db.from(resource).delete().eq("id", id);
  refresh(`/admin/${resource}`);
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const db = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failure(parsed.error);
  const { error } = await db.from("settings").upsert({ id: 1, ...parsed.data });
  if (error) return { ok: false, message: "Could not save settings." };
  refresh("/admin/settings");
  return { ok: true, message: "Settings saved." };
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  if (!idSchema.safeParse(id).success) return;
  const db = await requireAdmin();
  await db.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string): Promise<void> {
  if (!idSchema.safeParse(id).success) return;
  const db = await requireAdmin();
  await db.from("messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function setPublished(resource: string, id: string, value: boolean): Promise<void> {
  if (!isResourceKey(resource) || !idSchema.safeParse(id).success) return;
  const db = await requireAdmin();
  await db.from(resource).update({ published: value }).eq("id", id);
  refresh(`/admin/${resource}`);
}
