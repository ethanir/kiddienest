"use client";

import { useEffect } from "react";
import Link from "next/link";

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

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for logs and future error monitoring (e.g. Sentry).
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-24 size-[520px] rounded-full bg-emerald-300/30 blur-[130px] dark:bg-emerald-500/10" />
        <div className="absolute top-32 -left-40 size-[460px] rounded-full bg-sky-200/40 blur-[130px] dark:bg-sky-500/10" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div
          aria-hidden
          className="mx-auto mb-5 size-12 bg-emerald-500 dark:bg-emerald-400"
          style={emblemStyle}
        />
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-slate-400 dark:text-slate-500">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
