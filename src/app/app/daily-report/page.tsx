import { AppShell } from "@/components/careloop/app-shell";
import { DailyReportBuilder } from "@/components/careloop/daily-report-builder";
import { createClient } from "@/lib/supabase/server";

export default async function DailyReportPage() {
  const supabase = await createClient();

  // Staff see all children; a parent (via RLS) would only see their own.
  const { data: childRows } = await supabase
    .from("children")
    .select("id, full_name, room, emoji, avatar_bg")
    .order("full_name");

  return (
    <AppShell
      role="Daily reports"
      title="Create daily update"
      description="Post meals, naps, photos, activities, notes, and incidents to a parent-friendly timeline."
    >
      <DailyReportBuilder childProfiles={childRows ?? []} />
    </AppShell>
  );
}
