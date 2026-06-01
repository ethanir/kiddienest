import { AppShell } from "@/components/careloop/app-shell";
import { CheckInBoard } from "@/components/careloop/check-in-board";
import { createClient } from "@/lib/supabase/server";

export default async function CheckInPage() {
  const supabase = await createClient();

  const { data: childRows } = await supabase
    .from("children")
    .select(
      "id, full_name, room, emoji, avatar_bg, allergies, attendance_status, checked_in_at, checked_out_at",
    )
    .order("full_name");

  return (
    <AppShell
      role="Check-in"
      title="Check in & out"
      description="Tap a child to mark them checked in, checked out, or absent. Status stays until you change it."
    >
      <CheckInBoard childProfiles={childRows ?? []} />
    </AppShell>
  );
}
