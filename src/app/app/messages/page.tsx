import { AppShell } from "@/components/careloop/app-shell";
import { StaffMessages } from "@/components/careloop/staff-messages";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("children")
    .select("id, full_name, room, emoji, avatar_bg")
    .order("full_name");

  return (
    <AppShell
      role="Messages"
      title="Messages"
      description="Message families directly. Pick a child to open their conversation."
    >
      <StaffMessages children={data ?? []} />
    </AppShell>
  );
}
