import type { ReactNode } from "react";

import { ParentShell } from "@/components/careloop/parent-shell";
import { createClient } from "@/lib/supabase/server";

// Wraps every parent tab. Because a layout is preserved across navigations
// between its child routes, the shell (header + bottom tabs) stays mounted and
// this code does NOT re-run on each tab switch — so tab changes are instant and
// we claim any pending guardian invites just once on entry.
export default async function ParentLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  await supabase.rpc("claim_guardian_invites");

  return <ParentShell>{children}</ParentShell>;
}
