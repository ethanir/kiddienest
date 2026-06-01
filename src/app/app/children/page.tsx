import { AppShell } from "@/components/careloop/app-shell";
import { ChildrenManager } from "@/components/careloop/children-manager";
import { createClient } from "@/lib/supabase/server";

export default async function ChildrenPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("children")
    .select("id, full_name, room, birthdate, allergies, emoji, avatar_bg, attendance_status")
    .order("full_name");

  return (
    <AppShell
      role="Child records"
      title="Child profiles"
      description="Add and manage the children in your care — names, rooms, birthdays, and allergies."
    >
      <ChildrenManager initialChildren={data ?? []} />
    </AppShell>
  );
}
