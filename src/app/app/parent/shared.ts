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
// Limited to one row because that's all the parent screens currently use.
export async function loadParentChild(): Promise<ParentChild | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("children")
    .select(
      "id, full_name, room, emoji, avatar_bg, allergies, attendance_status, checked_in_at, checked_out_at",
    )
    .order("full_name")
    .limit(1);

  return (data?.[0] as ParentChild | undefined) ?? null;
}
