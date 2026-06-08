"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  CheckCircle2,
  DoorOpen,
  ClipboardList,
  FileSignature,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  ShieldAlert,
  UsersRound,
  X,
} from "lucide-react";

import { useRole } from "@/components/careloop/role-context";
import { ThemeToggle } from "@/components/careloop/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Baby;
  roles: string[];
  soon?: boolean;
};

const navItems: NavItem[] = [
  { href: "/app/parent", label: "My child", icon: Baby, roles: ["parent"] },
  { href: "/app/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["staff", "admin"] },
  { href: "/app/check-in", label: "Check-in", icon: CheckCircle2, roles: ["staff", "admin"] },
  { href: "/app/daily-report", label: "Reports", icon: ClipboardList, roles: ["staff", "admin"] },
  { href: "/app/messages", label: "Messages", icon: MessageCircle, roles: ["staff", "admin"] },
  { href: "/app/children", label: "Children", icon: Baby, roles: ["staff", "admin"] },
  { href: "/app/rooms", label: "Rooms", icon: DoorOpen, roles: ["admin"] },
  { href: "/app/incidents", label: "Incidents", icon: ShieldAlert, roles: ["staff", "admin"] },
  { href: "/app/staff", label: "Staff", icon: UsersRound, roles: ["staff", "admin"] },
  { href: "/app/forms", label: "Forms", icon: FileSignature, roles: ["staff", "admin"], soon: true },
];

// The four destinations that live in the mobile bottom bar; everything else for
// the role goes into the "More" sheet, so nothing is ever unreachable.
const MOBILE_PRIMARY = [
  "/app/admin",
  "/app/check-in",
  "/app/daily-report",
  "/app/messages",
];

// Routes that get the staff chrome (sidebar + mobile nav). Parent routes and the
// /app index render bare — the parent area brings its own shell.
const STAFF_PREFIXES = [
  "/app/admin",
  "/app/check-in",
  "/app/daily-report",
  "/app/messages",
  "/app/children",
  "/app/rooms",
  "/app/incidents",
  "/app/staff",
  "/app/forms",
];

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

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const userRole = useRole();
  const [email, setEmail] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  // Close the More sheet whenever the route changes.
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (moreOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [moreOpen]);

  // Make the mobile More sheet a fully keyboard-accessible dialog: focus moves
  // into it on open, Escape closes it, Tab is trapped within it, and focus
  // returns to whatever opened it on close.
  useEffect(() => {
    if (!moreOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        moreSheetRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    getFocusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [moreOpen]);

  const showChrome = STAFF_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Non-staff routes (parent area, /app index) render without the staff chrome.
  if (!showChrome) {
    return <>{children}</>;
  }

  const visibleNav = navItems.filter((item) => item.roles.includes(userRole ?? "parent"));
  const primaryNav = MOBILE_PRIMARY.map((href) => visibleNav.find((i) => i.href === href)).filter(
    (i): i is NavItem => Boolean(i),
  );
  const moreNav = visibleNav.filter((i) => !MOBILE_PRIMARY.includes(i.href));

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  const moreActive = moreNav.some((i) => isActive(i.href));

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex gap-6 px-3 py-3 md:px-6 md:py-6">
        {/* ===== Desktop sidebar ===== */}
        <aside className="sticky top-6 hidden h-[calc(100vh-48px)] w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:flex dark:border-slate-800 dark:bg-slate-900">
          <Link href="/app" className="mb-6 flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-7 bg-current" style={emblemStyle} />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare app</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {visibleNav.map((item) => {
              if (item.soon) {
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
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
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
              <p className="min-w-0 flex-1 truncate text-sm font-medium" title={email ?? undefined}>
                {email ?? "Loading…"}
              </p>
            </div>
            <ThemeToggle className="mt-3 w-full justify-center" />
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

        {/* ===== Main column ===== */}
        <section className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</section>
      </div>

      {/* ===== Mobile bottom bar ===== */}
      {primaryNav.length > 0 ? (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/95"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around">
            {primaryNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
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
                    <item.icon className="size-[21px]" strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {item.label}
                </Link>
              );
            })}

            {moreNav.length > 0 ? (
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
                className={cn(
                  "flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  moreActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors",
                    moreActive ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-transparent",
                  )}
                >
                  <MoreHorizontal className="size-[21px]" strokeWidth={moreActive ? 2.4 : 2} />
                </span>
                More
              </button>
            ) : null}
          </div>
        </nav>
      ) : null}

      {/* ===== Mobile "More" sheet ===== */}
      {moreOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 animate-in fade-in-0 bg-slate-900/50 backdrop-blur-sm duration-200"
          />
          <div
            ref={moreSheetRef}
            className="absolute inset-x-0 bottom-0 animate-in slide-in-from-bottom-4 rounded-t-3xl border-t border-slate-200 bg-white pt-2 duration-300 dark:border-slate-800 dark:bg-slate-900"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
          >
            <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-base font-semibold tracking-tight">More</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-3 pb-2">
              {moreNav.map((item) => {
                const active = isActive(item.href);
                if (item.soon) {
                  return (
                    <div
                      key={item.href}
                      aria-disabled="true"
                      className="flex cursor-not-allowed select-none items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-400 dark:text-slate-600"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                        <item.icon className="size-5" />
                      </span>
                      <span className="flex-1 text-[15px] font-medium">{item.label}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        <Lock className="size-3" />
                        Soon
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors",
                      active
                        ? "bg-emerald-50 dark:bg-emerald-500/10"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                      )}
                    >
                      <item.icon className="size-5" />
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-[15px] font-medium",
                        active ? "text-emerald-700 dark:text-emerald-400" : "",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-1 border-t border-slate-200 px-5 pt-4 dark:border-slate-800">
              <ThemeToggle className="mb-3 w-full justify-center" />
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {email ? email[0]?.toUpperCase() : "·"}
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium" title={email ?? undefined}>
                  {email ?? "Signed in"}
                </p>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
