import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { startCheckout } from "./actions";

const ACTIVE = new Set(["active", "trialing"]);

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

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

  const isActive = daycare ? ACTIVE.has(daycare.subscription_status) : false;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
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
        <div className={`${cardBase} p-8 shadow-sm`}>
          <h1 className="text-2xl font-semibold tracking-tight">Start your daycare</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Everything your small daycare needs, in one calm place — free for the parents you invite.
          </p>

          <div className="mt-6 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">$59</span>
            <span className="text-slate-500 dark:text-slate-400">/ month</span>
          </div>

          <ul className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            {[
              "Unlimited children & staff",
              "Check-in, daily updates, photos & messaging",
              "Incident reports parents acknowledge",
              "Your data fully isolated and private",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {f}
              </li>
            ))}
          </ul>

          <form action={startCheckout} className="mt-7">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Subscribe <ArrowRight className="size-4" />
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            Secure checkout by Stripe · cancel anytime
          </p>
        </div>
      )}
    </main>
  );
}
