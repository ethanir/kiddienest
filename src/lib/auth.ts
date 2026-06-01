import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "staff" | "parent" | null;

// Reads the signed-in user's role from their profile. Returns null if not
// signed in or no profile row yet.
export async function getCurrentRole(): Promise<AppRole> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = data?.role;
  return role === "admin" || role === "staff" || role === "parent" ? role : null;
}
