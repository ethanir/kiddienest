import { AppShell } from "@/components/careloop/app-shell";
import { ChildrenManager } from "@/components/careloop/children-manager";
import { getRooms } from "@/app/app/rooms/actions";
import { createClient } from "@/lib/supabase/server";

export default async function ChildrenPage() {
  const supabase = await createClient();

  const [{ data }, rooms] = await Promise.all([
    supabase
      .from("children")
      .select(
        "id, full_name, room, room_id, birthdate, allergies, emoji, avatar_bg, attendance_status",
      )
      .order("full_name"),
    getRooms(),
  ]);

  return (
    <AppShell
      role="Child records"
      title="Child profiles"
      description="Add and manage the children in your care — names, rooms, birthdays, and allergies."
    >
      <ChildrenManager initialChildren={data ?? []} rooms={rooms} />
    </AppShell>
  );
}
