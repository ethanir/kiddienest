import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/careloop/theme-toggle";

// The app chrome (desktop sidebar, mobile bottom bar, "More" sheet) lives in the
// /app layout via <AppChrome> so it stays mounted across navigations. AppShell
// now renders only a slim utility bar holding the theme toggle — per-page titles
// and descriptions were removed for a cleaner, denser layout. The title /
// description / role props are still accepted so every page compiles unchanged;
// they are intentionally not rendered. (A future help button can live here too.)
export function AppShell({
  children,
}: {
  title?: string;
  description?: string;
  role?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="mb-4 flex justify-end md:mb-5">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
