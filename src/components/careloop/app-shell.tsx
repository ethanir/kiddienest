"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import { ThemeToggle } from "@/components/careloop/theme-toggle";
import { useRole } from "@/components/careloop/role-context";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/parent", label: "My child", icon: Baby, roles: ["parent"] },
  { href: "/app/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["staff", "admin"] },
  { href: "/app/check-in", label: "Check-in", icon: CheckCircle2, roles: ["staff", "admin"] },
  { href: "/app/daily-report", label: "Reports", icon: ClipboardList, roles: ["staff", "admin"] },
  { href: "/app/children", label: "Children", icon: Baby, roles: ["staff", "admin"] },
  { href: "/app/staff", label: "Staff", icon: UsersRound, roles: ["staff", "admin"] },
  { href: "/app/messages", label: "Messages", icon: MessageCircle, roles: ["staff", "admin"] },
  { href: "/app/forms", label: "Forms", icon: FileSignature, roles: ["staff", "admin"] },
  { href: "/app/incidents", label: "Incidents", icon: ShieldAlert, roles: ["staff", "admin"] },
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
  const userRole = useRole();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const visibleNav = navItems.filter((item) => item.roles.includes(userRole ?? "parent"));
  const mobileNav = visibleNav.filter((item) => item.href !== "/app/forms").slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-3 py-3 md:px-6 md:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-48px)] w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:flex dark:border-slate-800 dark:bg-slate-900">
          <Link href="/app" className="mb-6 flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Heart className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare app</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {visibleNav.map((item) => {
              if (item.href === "/app/forms") {
                return (
                  <div
                    key={item.href}
                    aria-disabled="true"
                    title="Coming soon"
                    className="flex cursor-not-allowed select-none items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 dark:text-slate-600"
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <Lock className="size-3" />
                      Soon
                    </span>
                  </div>
                );
              }
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

          <div className="mt-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {email ? email[0]?.toUpperCase() : "·"}
              </div>
              <p
                className="min-w-0 flex-1 truncate text-sm font-medium"
                title={email ?? undefined}
              >
                {email ?? "Loading…"}
              </p>
            </div>
            <form action={signOut} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
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
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <form action={signOut} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <LogOut className="size-5" />
                </button>
              </form>
            </div>
          </header>

          {children}
        </section>
      </div>

      {mobileNav.length > 0 ? (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
            {mobileNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
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
      ) : null}
    </main>
  );
}
