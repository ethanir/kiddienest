import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Entry point for the app: routes each user to the right dashboard by role.
export default async function AppIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, intended_role, daycare_id")
    .eq("id", user.id)
    .single();

  if (profile?.role === "staff" || profile?.role === "admin") {
    redirect("/app/admin");
  }

  // Signed up as a daycare owner but hasn't paid yet → finish at billing.
  if (profile?.intended_role === "owner" && !profile?.daycare_id) {
    redirect("/app/locked");
  }

  redirect("/app/parent");
}
