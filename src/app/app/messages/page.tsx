import { AppShell } from "@/components/careloop/app-shell";
import { StaffMessages } from "@/components/careloop/staff-messages";
import { getRooms } from "@/app/app/rooms/actions";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createClient();

  const [{ data }, rooms] = await Promise.all([
    supabase
      .from("children")
      .select("id, full_name, room, room_id, emoji, avatar_bg")
      .order("full_name"),
    getRooms(),
  ]);

  return (
    <AppShell
      role="Messages"
      title="Messages"
      description="Message families directly. Pick a child to open their conversation."
    >
      <StaffMessages children={data ?? []} rooms={rooms} />
    </AppShell>
  );
}
