import type { ReactNode } from "react";
import Link from "next/link";
import {
  Baby,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  Home,
  LayoutDashboard,
  MessageCircle,
  Moon,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/careloop/theme-toggle";

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
  return (
    <main className="careloop-page min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 text-slate-950">
      <div className="mx-auto flex max-w-7xl gap-5 px-3 py-3 md:px-5 md:py-5">
        <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-72 shrink-0 rounded-[2rem] bg-slate-950 p-4 text-white shadow-2xl shadow-slate-200 lg:block">
          <Link href="/" className="mb-6 flex items-center gap-3 rounded-3xl bg-white/10 p-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-emerald-300 text-slate-950">
              <Baby className="size-6" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">CareLoop</p>
              <p className="text-xs text-slate-300">Daycare app</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-gradient-to-br from-sky-400 to-emerald-300 p-4 text-slate-950">
            <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-white/70">
              <Sparkles className="size-5" />
            </div>
            <p className="font-black">Simple by design</p>
            <p className="mt-1 text-xs font-medium text-slate-700">
              Bigger buttons, clear statuses, and parent-friendly screens.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="careloop-card mb-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-800">
                  <Moon className="size-4" />
                  {role}
                </div>
                <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                  {title}
                </h1>
                <p className="careloop-muted mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  {description}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <ThemeToggle />
                <Button className="h-12 rounded-full bg-slate-950 px-6 text-base font-bold text-white hover:bg-slate-800">
                  Demo mode
                </Button>
              </div>
            </div>
          </header>

          {children}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-2 py-2 shadow-2xl backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black text-slate-600 hover:bg-sky-50"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
