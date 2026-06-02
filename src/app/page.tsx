import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = Boolean(user);

  return (
    <main className="relative flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-7 bg-current" style={emblemStyle} />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight">KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare updates made simple</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {signedIn ? (
              <>
                <h1 className="text-center text-2xl font-semibold tracking-tight">Welcome back.</h1>
                <p className="mt-3 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Pick up right where you left off.
                </p>
                <Link
                  href="/app"
                  className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Go to dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-center text-2xl font-semibold tracking-tight">
                  The simple way to run your daycare.
                </h1>
                <p className="mt-3 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Check-ins, daily updates, photos, and messages — live for parents, effortless for
                  staff.
                </p>

                <div className="mt-7 rounded-2xl bg-slate-50 py-5 text-center dark:bg-slate-800/50">
                  <div className="flex items-end justify-center gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight">$59</span>
                    <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">/ month</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Per daycare · unlimited children &amp; staff · free for parents
                  </p>
                </div>

                <Link
                  href="/login"
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>

                <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
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
