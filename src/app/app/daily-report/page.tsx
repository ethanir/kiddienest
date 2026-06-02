import { AppShell } from "@/components/careloop/app-shell";
import { DailyReportBuilder } from "@/components/careloop/daily-report-builder";
import { getRooms } from "@/app/app/rooms/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DailyReportPage() {
  const supabase = await createClient();

  // Staff see all children; a parent (via RLS) would only see their own.
  const [{ data: childRows }, rooms] = await Promise.all([
    supabase
      .from("children")
      .select("id, full_name, room, room_id, emoji, avatar_bg")
      .order("full_name"),
    getRooms(),
  ]);

  return (
    <AppShell
      role="Daily reports"
      title="Create daily update"
      description="Post meals, naps, photos, activities, notes, and incidents to a parent-friendly timeline."
    >
      <DailyReportBuilder childProfiles={childRows ?? []} rooms={rooms} />
    </AppShell>
  );
}
