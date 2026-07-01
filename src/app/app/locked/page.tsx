import { redirect } from "next/navigation";
import {
  ArrowRight,
  Baby,
  Camera,
  Check,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Moon,
  ShieldAlert,
  Sparkles,
  UsersRound,
  Utensils,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { startCheckout } from "@/lib/checkout";
import { emblemStyle } from "@/lib/ui";

const ACTIVE = new Set(["active", "trialing"]);

const INCLUDED = [
  "Unlimited children & staff — no per-child fees",
  "Check-in/out, daily updates, photos & messaging",
  "Incident reports parents acknowledge",
  "Your data fully isolated and private",
  "Free for every parent you invite",
];

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Check-in", icon: CheckCircle2 },
  { label: "Children", icon: Baby },
  { label: "Staff", icon: UsersRound },
  { label: "Messages", icon: MessageCircle },
  { label: "Incidents", icon: ShieldAlert },
];

const ROSTER = [
  { e: "😊", n: "Mia Johnson", r: "Toddler Room", s: "Checked in" },
  { e: "🦊", n: "Leo Parker", r: "Infant Room", s: "Napping" },
  { e: "🌟", n: "Noah Lee", r: "Toddler Room", s: "Checked in" },
  { e: "🐰", n: "Ava Chen", r: "Preschool", s: "Checked in" },
];

const TIMELINE = [
  { icon: Utensils, t: "Meal update", d: "Ate most of lunch", tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { icon: Moon, t: "Nap started", d: "Settled calmly", tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
  { icon: Camera, t: "Photo shared", d: "A new classroom photo", tint: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
];

export default async function LockedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // If they're actually provisioned/active now, send them into the app.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, daycare_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.daycare_id) {
    const { data: daycare } = await supabase
      .from("daycares")
      .select("subscription_status")
      .eq("id", profile.daycare_id)
      .maybeSingle();
    if (daycare && ACTIVE.has(daycare.subscription_status)) {
      redirect("/app");
    }
  }

  const settingUp = status === "success";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ===== Blurred mock dashboard (decorative, non-interactive) ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none blur-[6px] saturate-[0.85]"
      >
        <div className="mx-auto flex h-screen max-w-7xl gap-6 p-6">
          {/* sidebar */}
          <aside className="hidden h-full w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:flex dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3 px-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <span aria-hidden className="size-7 bg-current" style={emblemStyle} />
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight">KiddieNest</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daycare app</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {NAV.map((it) => (
                <div
                  key={it.label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    it.active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <it.icon className="size-5 shrink-0" />
                  <span>{it.label}</span>
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <LogOut className="size-5" />
              <span>Sign out</span>
            </div>
          </aside>

          {/* main */}
          <section className="flex-1 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Good morning, Sarah
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sunrise Daycare · 24 children today
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                18 checked in
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "18", l: "Present", tint: "text-emerald-600 dark:text-emerald-400" },
                { n: "6", l: "Absent", tint: "text-slate-400" },
                { n: "4", l: "Updates today", tint: "text-sky-600 dark:text-sky-400" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className={`text-3xl font-bold leading-none ${s.tint}`}>{s.n}</p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-3 text-sm font-semibold tracking-tight">Today&apos;s roster</p>
                <div className="space-y-2">
                  {ROSTER.map((c) => (
                    <div
                      key={c.n}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
                        {c.e}
                      </span>
                      <div className="flex-1 leading-tight">
                        <p className="text-sm font-semibold tracking-tight">{c.n}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{c.r}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {c.s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-3 text-sm font-semibold tracking-tight">Recent updates</p>
                <div className="space-y-2">
                  {TIMELINE.map((u) => (
                    <div
                      key={u.t}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800"
                    >
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${u.tint}`}>
                        <u.icon className="size-4" />
                      </span>
                      <div className="flex-1 leading-tight">
                        <p className="text-sm font-medium">{u.t}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{u.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* soft scrim over the blur so the overlay pops */}
      <div className="pointer-events-none absolute inset-0 bg-slate-50/55 dark:bg-slate-950/65" />

      {/* ===== Centered overlay ===== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        {settingUp ? (
          <SettingUpCard />
        ) : (
          <UnlockCard cancelled={status === "cancel"} />
        )}
      </div>
    </main>
  );
}

function UnlockCard({ cancelled }: { cancelled: boolean }) {
  return (
    <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-500 [animation-fill-mode:both]">
      {/* little lock chip */}
      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
          <Lock className="size-3.5" />
          Your daycare is ready to unlock
        </span>
      </div>

      {cancelled ? (
        <p className="mb-3 text-center text-xs text-slate-500 dark:text-slate-400">
          No problem — you haven&apos;t been charged. Subscribe whenever you&apos;re ready.
        </p>
      ) : null}

      {/* pricing card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative overflow-hidden bg-slate-900 px-7 py-6 text-white dark:bg-slate-800">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-emerald-500/30 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-white/15">
              <Sparkles className="size-3" />
              KiddieNest · Full plan
            </span>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold leading-none tracking-tight">$59</span>
              <span className="pb-1 text-sm text-slate-300">/ month</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Subscribe to unlock your dashboard · cancel anytime
            </p>
          </div>
        </div>

        <div className="px-7 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Everything included
          </p>
          <ul className="mt-3 space-y-3">
            {INCLUDED.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <form action={startCheckout} className="mt-6">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.99]"
            >
              Continue to payment — $59/month
              <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
            <Lock className="size-3" />
            Secure checkout by Stripe
          </p>
        </div>
      </div>

      {/* sign out */}
      <form action={signOut} className="mt-5 text-center">
        <button
          type="submit"
          className="text-sm text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

function SettingUpCard() {
  return (
    <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-500 [animation-fill-mode:both]">
      {/* auto-refresh while the webhook provisions the daycare */}
      <meta httpEquiv="refresh" content="3" />
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Payment received 🎉</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Setting up your daycare now — this only takes a moment. We&apos;ll take you to your
          dashboard automatically.
        </p>
      </div>
    </div>
  );
}
