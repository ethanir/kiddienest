import { AppShell } from "@/components/careloop/app-shell";
import { IncidentsManager } from "@/components/careloop/incidents-manager";
import { getIncidents } from "@/app/app/incidents/actions";
import { createClient } from "@/lib/supabase/server";

export default async function IncidentsPage() {
  const supabase = await createClient();

  const [{ data: children }, incidents] = await Promise.all([
    supabase.from("children").select("id, full_name, emoji, avatar_bg, room").order("full_name"),
    getIncidents(),
  ]);

  return (
    <AppShell
      role="Incidents"
      title="Incidents"
      description="Log injuries, illnesses, and behavior notes — and track which parents have acknowledged them."
    >
      <IncidentsManager initialIncidents={incidents} children={children ?? []} />
    </AppShell>
  );
}
