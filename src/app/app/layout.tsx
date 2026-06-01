import type { ReactNode } from "react";

import { RoleProvider } from "@/components/careloop/role-context";
import { getCurrentRole } from "@/lib/auth";

// Fetches the role once for everything under /app and shares it with the nav,
// so each role only sees its own links. (Section redirects live in middleware.)
export default async function AppLayout({ children }: { children: ReactNode }) {
  const role = await getCurrentRole();
  return <RoleProvider role={role}>{children}</RoleProvider>;
}
