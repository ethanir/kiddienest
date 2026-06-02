import Link from "next/link";
import { ArrowRight, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { startCheckout } from "./actions";

const ACTIVE = new Set(["active", "trialing"]);

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const INCLUDED = [
  "Unlimited children & staff — no per-child fees",
  "Check-in/out, daily updates, photos & messaging",
  "Incident reports parents acknowledge",
  "Your data fully isolated and private",
  "Free for every parent you invite",
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let daycare: { name: string; subscription_status: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("daycare_id")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.daycare_id) {
      const { data } = await supabase
        .from("daycares")
        .select("name, subscription_status")
        .eq("id", profile.daycare_id)
        .maybeSingle();
      daycare = data;
    }
  }

  const statusValue = daycare?.subscription_status ?? null;
  const isActive = statusValue ? ACTIVE.has(statusValue) : false;
  const isReactivation =
    statusValue === "past_due" ||
    statusValue === "canceled" ||
    statusValue === "unpaid";

  return (
    <main className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      {/* soft atmosphere so the page doesn't feel bare */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-emerald-300/20 blur-[120px] dark:bg-emerald-500/10" />
      </div>

      {status === "success" && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          Payment received — your daycare is being set up. This may take a few seconds; refresh
          shortly.
        </div>
      )}
      {status === "cancel" && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
          Checkout canceled — you haven&apos;t been charged.
        </div>
      )}
      {!isActive && isReactivation && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          {statusValue === "past_due"
            ? "Your last payment didn't go through, so access is paused. Reactivate below to restore your daycare."
            : "Your subscription has ended. Reactivate below to restore access to your daycare."}
        </div>
      )}

      {isActive ? (
        <div className={`${cardBase} p-8 text-center shadow-sm`}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            {daycare?.name ?? "Your daycare"} is active
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your subscription is {daycare?.subscription_status}. Thanks for using KiddieNest.
          </p>
          <Link
            href="/app"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Go to dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700 [animation-fill-mode:both]">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isReactivation ? "Reactivate your daycare" : "Start your daycare"}
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {isReactivation
                ? "Pick up right where you left off — your children and history are safe."
                : "One simple plan with everything in the box. Free for the parents you invite."}
            </p>
          </div>

          {/* ===== Pricing card ===== */}
          <div className={`${cardBase} overflow-hidden shadow-xl shadow-slate-900/5`}>
            {/* price header band */}
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
                  Billed monthly · one price per daycare · cancel anytime
                </p>
              </div>
            </div>

            {/* what's included */}
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
                  {isReactivation ? "Reactivate — $59/month" : "Subscribe — $59/month"}
                  <ArrowRight className="size-4" />
                </button>
              </form>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
                <Lock className="size-3" />
                Secure checkout by Stripe · cancel anytime
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
