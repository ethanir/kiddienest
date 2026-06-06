import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/careloop/theme-toggle";

// Renders just the per-page header (role badge + title + description). The app
// chrome — desktop sidebar, mobile bottom bar, and the "More" sheet — now lives
// in the /app layout via <AppChrome>, so it stays mounted across navigations and
// tab switches feel instant. Staff pages keep using <AppShell> exactly as before.
export function AppShell({
  title,
  description,
  role,
  children,
}: {
  title: string;
  description: string;
  role: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-5 md:mb-6 md:pb-6 dark:border-slate-800">
        <div className="min-w-0">
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            {role}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-600 sm:block md:text-base dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {children}
    </>
  );
}
