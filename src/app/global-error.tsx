"use client";

import { useEffect } from "react";

import "./globals.css";
import { emblemStyle } from "@/lib/ui";

// global-error replaces the root layout when an error is thrown there, so it
// must render its own <html>/<body> and re-apply the no-flash theme script.
const themeScript = `
try {
  var t = localStorage.getItem('careloop-theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div
              aria-hidden
              className="mx-auto mb-5 size-12 bg-emerald-500 dark:bg-emerald-400"
              style={emblemStyle}
            />
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              The app ran into an unexpected problem. Please try again.
            </p>
            {error.digest ? (
              <p className="mt-3 font-mono text-xs text-slate-400 dark:text-slate-500">
                Reference: {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
