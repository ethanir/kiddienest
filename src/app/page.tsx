import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Heart,
  MessageCircle,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/careloop/theme-toggle";
import { emblemStyle } from "@/lib/ui";

const dotGrid = {
  backgroundImage: "radial-gradient(rgb(100 116 139) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
} as const;

const features = [
  { icon: CheckCircle2, label: "Check-in & out", tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { icon: ClipboardList, label: "Daily updates", tint: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
  { icon: MessageCircle, label: "Family messaging", tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { icon: ShieldAlert, label: "Incident reports", tint: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = Boolean(user);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-24 size-[520px] rounded-full bg-emerald-300/30 blur-[130px] dark:bg-emerald-500/10" />
        <div className="absolute top-32 -left-40 size-[460px] rounded-full bg-sky-200/40 blur-[130px] dark:bg-sky-500/10" />
        <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.05]" style={dotGrid} />
      </div>

      {/* Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <span aria-hidden className="size-6 bg-current" style={emblemStyle} />
          </span>
          <span className="text-base font-semibold tracking-tight">KiddieNest</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {signedIn ? (
            <>
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Signed in
              </span>
              <Link
                href="/app"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-10 items-center rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-8 px-6 pb-4 pt-3 md:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pt-3">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex animate-in fade-in-0 slide-in-from-bottom-2 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm duration-700 [animation-fill-mode:both] dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <Heart className="size-3.5 text-emerald-500" />
            Daycare updates made simple
          </span>

          <h1
            className="mt-4 animate-in fade-in-0 slide-in-from-bottom-3 text-balance text-4xl font-semibold leading-[1.03] tracking-tight duration-700 [animation-fill-mode:both] sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Your daycare&apos;s whole day, in one calm place.
          </h1>

          <p
            className="mx-auto mt-3 max-w-lg animate-in fade-in-0 slide-in-from-bottom-3 text-base leading-7 text-slate-500 duration-700 [animation-fill-mode:both] lg:mx-0 dark:text-slate-400"
            style={{ animationDelay: "160ms" }}
          >
            Check-ins, daily updates, photos, and messages — flowing live to parents, effortless for
            your staff. The warmth of a handwritten note, without the paper.
          </p>

          <div
            className="mt-5 flex animate-in fade-in-0 slide-in-from-bottom-3 flex-col items-center justify-center gap-3 duration-700 [animation-fill-mode:both] sm:flex-row lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
            {signedIn ? (
              <Link
                href="/app"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 sm:w-auto"
              >
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 sm:w-auto"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <div
            className="mt-4 flex animate-in fade-in-0 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 duration-1000 [animation-fill-mode:both] lg:justify-start dark:text-slate-500"
            style={{ animationDelay: "400ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5" /> Live updates
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Private &amp; secure
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Free for parents
            </span>
          </div>
        </div>

        {/* Right: device showcase — laptop (staff dashboard) + phone (parent view) */}
        <div
          className="relative mx-auto w-full max-w-[560px] animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-1000 [animation-fill-mode:both] lg:mx-0 lg:ml-auto"
          style={{ animationDelay: "200ms" }}
        >
          {/* soft glow behind the devices */}
          <div className="absolute inset-0 -z-10 translate-y-8 scale-90 rounded-[3rem] bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />

          {/* ===== Laptop ===== */}
          <div className="relative">
            {/* screen */}
            <div className="overflow-hidden rounded-t-xl border border-slate-300 bg-slate-800 p-1.5 shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:shadow-black/40">
              <div className="overflow-hidden rounded-md bg-white dark:bg-slate-900">
                {/* browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60">
                  <span className="size-2 rounded-full bg-rose-300" />
                  <span className="size-2 rounded-full bg-amber-300" />
                  <span className="size-2 rounded-full bg-emerald-300" />
                  <span className="ml-2 flex-1 rounded-md bg-white px-2 py-0.5 text-[9px] text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
                    kiddienestapp.com
                  </span>
                </div>

                {/* dashboard body */}
                <div className="flex h-[270px]">
                  {/* sidebar */}
                  <div className="hidden w-32 shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50/60 p-2.5 sm:flex dark:border-slate-800 dark:bg-slate-800/30">
                    <div className="mb-1 flex items-center gap-1.5 px-1">
                      <span className="flex size-5 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        <span aria-hidden className="size-3 bg-current" style={emblemStyle} />
                      </span>
                      <span className="text-[10px] font-semibold tracking-tight">KiddieNest</span>
                    </div>
                    {[
                      { label: "Dashboard", active: true },
                      { label: "Check-in", active: false },
                      { label: "Children", active: false },
                      { label: "Messages", active: false },
                      { label: "Incidents", active: false },
                    ].map((it) => (
                      <div
                        key={it.label}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                          it.active
                            ? "bg-emerald-600 text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {it.label}
                      </div>
                    ))}
                  </div>

                  {/* main */}
                  <div className="flex-1 overflow-hidden p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-tight">Good morning, Sarah</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Sunrise Daycare · 24 children today</p>
                      </div>
                      <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700 sm:inline dark:bg-emerald-500/10 dark:text-emerald-400">
                        18 checked in
                      </span>
                    </div>

                    {/* stat tiles */}
                    <div className="mt-2.5 grid grid-cols-3 gap-2">
                      {[
                        { n: "18", l: "Present", tint: "text-emerald-600 dark:text-emerald-400" },
                        { n: "6", l: "Absent", tint: "text-slate-400" },
                        { n: "4", l: "Updates", tint: "text-sky-600 dark:text-sky-400" },
                      ].map((s) => (
                        <div key={s.l} className="rounded-lg border border-slate-100 p-2 dark:border-slate-800">
                          <p className={`text-base font-bold leading-none ${s.tint}`}>{s.n}</p>
                          <p className="mt-1 text-[9px] text-slate-400 dark:text-slate-500">{s.l}</p>
                        </div>
                      ))}
                    </div>

                    {/* roster rows */}
                    <div className="mt-2.5 space-y-1.5">
                      {[
                        { e: "😊", n: "Mia Johnson", r: "Toddler Room", s: "Checked in" },
                        { e: "🦊", n: "Leo Parker", r: "Infant Room", s: "Napping" },
                        { e: "🌟", n: "Noah Lee", r: "Toddler Room", s: "Checked in" },
                      ].map((c) => (
                        <div key={c.n} className="flex items-center gap-2 rounded-lg border border-slate-100 p-1.5 dark:border-slate-800">
                          <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-sm dark:bg-slate-800">{c.e}</span>
                          <div className="flex-1 leading-tight">
                            <p className="text-[10px] font-semibold tracking-tight">{c.n}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500">{c.r}</p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {c.s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* laptop base */}
            <div className="relative mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-xl border border-t-0 border-slate-300 bg-gradient-to-b from-slate-200 to-slate-300 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
              <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-md bg-slate-300/80 dark:bg-slate-600" />
            </div>
          </div>

          {/* ===== Phone (overlapping lower-right) — parent view ===== */}
          <div className="absolute -bottom-6 -right-2 w-[136px] sm:-right-6 sm:w-[150px]">
            <div className="rounded-[1.6rem] border-[3px] border-slate-800 bg-slate-800 p-1 shadow-2xl shadow-slate-900/30 dark:border-slate-700 dark:shadow-black/50">
              <div className="overflow-hidden rounded-[1.3rem] bg-white dark:bg-slate-900">
                {/* notch */}
                <div className="flex justify-center bg-white pt-1.5 dark:bg-slate-900">
                  <span className="h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="px-2.5 pb-3 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    Parent portal
                  </span>
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/60">
                    <span className="flex size-6 items-center justify-center rounded-md bg-pink-100 text-sm">😊</span>
                    <div className="leading-tight">
                      <p className="text-[9px] font-semibold tracking-tight">Mia Johnson</p>
                      <p className="text-[8px] text-emerald-600 dark:text-emerald-400">● Checked in</p>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-start gap-1.5 rounded-lg border border-slate-100 p-1.5 dark:border-slate-800">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                        <Utensils className="size-2.5" />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[8.5px] font-medium">Lunch</p>
                        <p className="text-[8px] text-slate-400">Ate it all 🍝</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 rounded-lg border border-slate-100 p-1.5 dark:border-slate-800">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <Moon className="size-2.5" />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[8.5px] font-medium">Nap time</p>
                        <p className="text-[8px] text-slate-400">Slept 90 min</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 rounded-lg border border-slate-100 p-1.5 dark:border-slate-800">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                        <Camera className="size-2.5" />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[8.5px] font-medium">New photo</p>
                        <p className="text-[8px] text-slate-400">Story time 📸</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature strip + pricing */}
      <section className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-6 md:px-10">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm md:grid-cols-2 md:items-center md:gap-10 md:p-5 dark:border-slate-800 dark:bg-slate-900/70">
          {/* features */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Everything your daycare needs.</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The day-to-day essentials, in one clean app — nothing your team has to learn.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${f.tint}`}>
                    <f.icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* pricing */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-end justify-center gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">$59</span>
              <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">/ month</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Per daycare · unlimited children &amp; staff · free for parents
            </p>
            <Link
              href={signedIn ? "/app" : "/login"}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              {signedIn ? "Go to dashboard" : "Get started"}
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-2.5 text-[11px] text-slate-400 dark:text-slate-500">
              No per-child fees · cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/70 dark:border-slate-800/70">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-4 text-center md:px-10">
          <p className="text-xs text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} KiddieNest · Daycare updates made simple</p>
        </div>
      </footer>
    </main>
  );
}
