import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type ParentChild = {
  id: string;
  full_name: string;
  room: string | null;
  emoji: string;
  avatar_bg: string;
  allergies: string;
  attendance_status: "not_arrived" | "checked_in" | "checked_out";
  checked_in_at: string | null;
  checked_out_at: string | null;
};

// Loads the signed-in parent's first linked child (RLS guarantees it's theirs).
// Also claims any pending guardian invites first. Returns null if none linked.
export async function loadParentChild(): Promise<ParentChild | null> {
  const supabase = await createClient();
  await supabase.rpc("claim_guardian_invites");

  const { data } = await supabase
    .from("children")
    .select(
      "id, full_name, room, emoji, avatar_bg, allergies, attendance_status, checked_in_at, checked_out_at",
    )
    .order("full_name");

  return (data?.[0] as ParentChild | undefined) ?? null;
}

// Guards a parent route: ensures the user is signed in. (Section access is also
// enforced by middleware; this is a belt-and-suspenders for direct loads.)
export async function requireParentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}
