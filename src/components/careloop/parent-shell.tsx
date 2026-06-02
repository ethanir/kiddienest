"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, Home, LogOut, MessageCircle } from "lucide-react";

import { ThemeToggle } from "@/components/careloop/theme-toggle";
import { InstallPrompt } from "@/components/careloop/install-prompt";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

const emblemStyle = {
  maskImage: "url(/brand-emblem.png)",
  WebkitMaskImage: "url(/brand-emblem.png)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;

const TABS = [
  { href: "/app/parent", label: "Today", icon: Home },
  { href: "/app/parent/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/parent/child", label: "Child", icon: Baby },
];

export function ParentShell({
  childName,
  childEmoji,
  childBg,
  title,
  children,
}: {
  childName?: string;
  childEmoji?: string;
  childBg?: string;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ===== Top bar ===== */}
      <header
        className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/85"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/app/parent" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-5 bg-current" style={emblemStyle} />
            </span>
            <span className="text-sm font-semibold tracking-tight">KiddieNest</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Sign out"
                title={email ? `Sign out (${email})` : "Sign out"}
                className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <LogOut className="size-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ===== Content ===== */}
      <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5">
        <h1 className="sr-only">{title}</h1>
        {children}
      </main>

      {/* ===== Bottom tab bar ===== */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {TABS.map((tab) => {
            const active =
              tab.href === "/app/parent"
                ? pathname === "/app/parent"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[60px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors",
                    active ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-transparent",
                  )}
                >
                  <tab.icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
                </span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <InstallPrompt />
    </div>
  );
}
