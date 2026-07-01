import Link from "next/link";
import { emblemStyle } from "@/lib/ui";

export default function NotFound() {
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
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">404</p>
        <h1 className="mt-1 text-xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
