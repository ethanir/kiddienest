import type { ReactNode } from "react";

import { RoleProvider } from "@/components/careloop/role-context";
import { AppChrome } from "@/components/careloop/app-chrome";
import { getCurrentRole } from "@/lib/auth";

// Fetches the role once for everything under /app and shares it with the nav.
// <AppChrome> renders the persistent staff chrome (sidebar + mobile nav) and
// stays mounted across navigations, so switching staff screens is instant. It
// renders bare on the parent routes, which bring their own shell.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const role = await getCurrentRole();
  return (
    <RoleProvider role={role}>
      <AppChrome>{children}</AppChrome>
    </RoleProvider>
  );
}
