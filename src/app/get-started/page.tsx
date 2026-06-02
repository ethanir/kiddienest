import Link from "next/link";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export const metadata = {
  title: "Get started — KiddieNest",
  description: "Set your daycare up with KiddieNest and lock in founding pricing.",
};

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

export default function GetStartedPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-7 bg-current" style={emblemStyle} />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight">KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daycare updates made simple</p>
            </div>
          </div>

          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Sparkles className="size-3.5" />
              Founding daycares
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">Let&apos;s set up your daycare.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              KiddieNest is rolling out to a small group of founding daycares. Tell us a little about
              your center and we&apos;ll get you set up with your own admin account — and lock in
              founding pricing of{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">$39/month for life</span>.
            </p>

            <a
              href="mailto:hello@kiddienestapp.com?subject=KiddieNest%20%E2%80%94%20set%20up%20my%20daycare&body=Hi%20KiddieNest%2C%0A%0AI%27d%20like%20to%20get%20my%20daycare%20set%20up.%0A%0ADaycare%20name%3A%0ACity%2FState%3A%0AApprox.%20number%20of%20children%3A%0AApprox.%20number%20of%20staff%3A%0A%0AThanks%21"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <Mail className="size-4" />
              Email us to get started
            </a>
            <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
              We usually reply within a day.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A parent? Your daycare will send you an invite —{" "}
              <Link href="/login" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                sign in here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
