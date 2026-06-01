import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in? Skip the landing and go straight to the app.
  if (user) redirect("/app");

  return (
    <main className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Heart className="size-6" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare updates made simple</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-center text-2xl font-semibold tracking-tight">
              Your child&apos;s day, in one calm place.
            </h1>
            <p className="mt-3 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
              Check-ins, daily updates, photos, and messages from the classroom — live, private,
              and simple.
            </p>

            <Link
              href="/login"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Sign in
              <ArrowRight className="size-4" />
            </Link>

            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              New to KiddieNest?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5" /> Live updates
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Private &amp; secure
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Simple
            </span>
          </div>
        </div>
      </div>

      <footer className="px-6 pb-8 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} KiddieNest
      </footer>
    </main>
  );
}
