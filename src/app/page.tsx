import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Heart,
  Moon,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/careloop/theme-toggle";

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
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
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
            <Link
              href="/app"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
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
      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 pb-16 pt-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-12">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex animate-in fade-in-0 slide-in-from-bottom-2 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm duration-700 [animation-fill-mode:both] dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <Heart className="size-3.5 text-emerald-500" />
            Daycare updates made simple
          </span>

          <h1
            className="mt-6 animate-in fade-in-0 slide-in-from-bottom-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight duration-700 [animation-fill-mode:both] sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Your daycare&apos;s whole day, in one calm place.
          </h1>

          <p
            className="mx-auto mt-5 max-w-md animate-in fade-in-0 slide-in-from-bottom-3 text-base leading-7 text-slate-500 duration-700 [animation-fill-mode:both] lg:mx-0 dark:text-slate-400"
            style={{ animationDelay: "160ms" }}
          >
            Check-ins, daily updates, photos, and messages — flowing live to parents, effortless for
            your staff. The warmth of a handwritten note, without the paper.
          </p>

          <div
            className="mt-8 flex animate-in fade-in-0 slide-in-from-bottom-3 flex-col items-center justify-center gap-3 duration-700 [animation-fill-mode:both] sm:flex-row lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
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
          </div>

          <div
            className="mt-7 flex animate-in fade-in-0 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 duration-1000 [animation-fill-mode:both] lg:justify-start dark:text-slate-500"
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

        {/* Right: product mockup */}
        <div
          className="relative mx-auto w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-1000 [animation-fill-mode:both]"
          style={{ animationDelay: "200ms" }}
        >
          {/* glow behind card */}
          <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[2rem] bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
            {/* mock header */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Parent portal
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Today</span>
            </div>

            {/* child card */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="flex size-12 items-center justify-center rounded-xl bg-pink-100 text-2xl">😊</span>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight">Mia Johnson</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Toddler Room</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Checked in
              </span>
            </div>

            {/* timeline */}
            <p className="mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Today&apos;s timeline
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Utensils className="size-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Meal update</p>
                    <span className="text-[11px] text-slate-400">12:30 PM</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Ate most of lunch and drank water.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Moon className="size-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Nap started</p>
                    <span className="text-[11px] text-slate-400">1:05 PM</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Settled down calmly for nap time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  <Camera className="size-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Photo shared</p>
                    <span className="text-[11px] text-slate-400">2:13 PM</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">A new classroom photo for the family.</p>
                </div>
              </div>
            </div>
          </div>

          {/* floating accent chip */}
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:block dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Heart className="size-4" />
              </span>
              <div className="pr-1">
                <p className="text-[11px] font-semibold leading-tight">New update</p>
                <p className="text-[10px] leading-tight text-slate-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip + pricing */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 md:px-8">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm md:grid-cols-2 md:items-center md:gap-8 md:p-8 dark:border-slate-800 dark:bg-slate-900/70">
          {/* features */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Everything a small daycare needs.</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The day-to-day essentials, in one clean app — nothing your team has to learn.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
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
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-end justify-center gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">$59</span>
              <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">/ month</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Per daycare · unlimited children &amp; staff · free for parents
            </p>
            <Link
              href="/login"
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Get started
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
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-4 bg-current" style={emblemStyle} />
            </span>
            <span className="text-sm font-semibold tracking-tight">KiddieNest</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} KiddieNest · Daycare updates made simple</p>
        </div>
      </footer>
    </main>
  );
}
