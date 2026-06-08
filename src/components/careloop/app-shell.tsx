import type { ReactNode } from "react";

// The app chrome (desktop sidebar, mobile bottom bar, "More" sheet) lives in the
// /app layout via <AppChrome> so it stays mounted across navigations. The theme
// toggle now lives in the sidebar / mobile "More" sheet, so AppShell renders its
// children directly with no top utility bar — every page gains that vertical
// space back. The title / description / role props are still accepted so every
// page compiles unchanged; they are intentionally not rendered.
export function AppShell({
  children,
}: {
  title?: string;
  description?: string;
  role?: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}
