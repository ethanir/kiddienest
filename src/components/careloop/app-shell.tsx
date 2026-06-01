"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  Heart,
  Home,
  LayoutDashboard,
  MessageCircle,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import { ThemeToggle } from "@/components/careloop/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/app/parent", label: "Parent", icon: Baby },
  { href: "/app/admin", label: "Admin", icon: LayoutDashboard },
  { href: "/app/staff", label: "Staff", icon: UsersRound },
  { href: "/app/check-in", label: "Check-in", icon: CheckCircle2 },
  { href: "/app/daily-report", label: "Reports", icon: ClipboardList },
  { href: "/app/children", label: "Children", icon: Baby },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/forms", label: "Forms", icon: FileSignature },
  { href: "/app/incidents", label: "Incidents", icon: ShieldAlert },
];

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
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-3 py-3 md:px-6 md:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-48px)] w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:flex dark:border-slate-800 dark:bg-slate-900">
          <Link href="/" className="mb-6 flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Heart className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">CareLoop</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare app</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between dark:border-slate-800">
            <div>
              <span className="mb-2 inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {role}
              </span>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-400">
                {description}
              </p>
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </header>

          {children}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
