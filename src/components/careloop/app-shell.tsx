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
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-4 md:py-6">
        <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-64 shrink-0 rounded-[2rem] border bg-white p-4 shadow-sm lg:block">
          <Link href="/" className="mb-6 flex items-center gap-3 px-2">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Baby className="size-5" />
            </div>
            <div>
              <p className="font-bold">CareLoop</p>
              <p className="text-xs text-slate-500">Daycare app</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="mb-5 rounded-[2rem] border bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-700">{role}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-5xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
              </div>
              <Button className="rounded-full">Demo mode</Button>
            </div>
          </header>

          {children}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
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
