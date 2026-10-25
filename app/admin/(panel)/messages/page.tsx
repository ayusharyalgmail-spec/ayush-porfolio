import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { Inbox } from "@/components/admin/Inbox";
import { requireAdmin } from "@/lib/auth";
import { messageRow } from "@/lib/schemas";

export default async function MessagesPage() {
  const db = await requireAdmin();
  const { data } = await db.from("messages").select("*").order("created_at", { ascending: false });
  return <Inbox messages={messageRow.array().parse(data ?? [])} setReadAction={setMessageRead} deleteAction={deleteMessage} />;
}
