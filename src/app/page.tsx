import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Camera,
  CheckCircle2,
  ClipboardList,
  Heart,
  LayoutDashboard,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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

const features = [
  {
    icon: CheckCircle2,
    tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    title: "Check-in & out",
    body: "Tap to mark each child checked in, out, or absent. Live counts update instantly across every device.",
  },
  {
    icon: ClipboardList,
    tint: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    title: "Daily updates",
    body: "Post meals, naps, activities, and notes to a parent-friendly timeline — with a live preview as you type.",
  },
  {
    icon: Camera,
    tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    title: "Photos & moments",
    body: "Share classroom photos straight to a child's day so families never miss the little things.",
  },
  {
    icon: MessageCircle,
    tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    title: "Family messaging",
    body: "A private thread for each family. Staff and parents stay in sync without swapping phone numbers.",
  },
  {
    icon: ShieldAlert,
    tint: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    title: "Incident reports",
    body: "Log injuries or notes with severity and details, and see exactly which parents have acknowledged them.",
  },
  {
    icon: Baby,
    tint: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
    title: "Live parent portal",
    body: "Parents follow their child's day in real time from any phone or laptop — calm, private, and simple.",
  },
];

const steps = [
  {
    n: "1",
    title: "Set up your daycare",
    body: "Add your children and your teachers in minutes. No training or IT setup required.",
  },
  {
    n: "2",
    title: "Invite your families",
    body: "Invite parents by email. They create an account and are linked to their child automatically.",
  },
  {
    n: "3",
    title: "Share the day",
    body: "Check kids in, post updates, and message families. Parents see everything live as it happens.",
  },
];

const faqs = [
  {
    q: "Is the price really flat?",
    a: "Yes. One monthly price per daycare, with unlimited children and staff — no per-child fees that grow as you fill up.",
  },
  {
    q: "Do parents have to pay?",
    a: "Never. KiddieNest is always free for families. Only the daycare pays.",
  },
  {
    q: "Is our information private?",
    a: "Yes. Families only ever see their own child, and your data is protected with bank-grade security and encryption.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no contracts and no setup fees — cancel whenever you like.",
  },
  {
    q: "How do I get started?",
    a: "Click Get started and we'll set your daycare up with its own admin account and lock in founding pricing.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = Boolean(user);

  return (
    <main className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
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
                className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <LayoutDashboard className="size-4" />
                Go to dashboard
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
                  href="/get-started"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-12 pt-16 text-center md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Heart className="size-3.5 text-emerald-500" />
          Daycare updates made simple
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Your daycare and its families, on the same page.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
          KiddieNest brings check-ins, daily updates, photos, messages, and incident reports into
          one calm, private place — live for parents, effortless for staff.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={signedIn ? "/app" : "/get-started"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:w-auto"
          >
            {signedIn ? "Go to dashboard" : "Get started"}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={signedIn ? "/app" : "/login"}
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {signedIn ? "Open KiddieNest" : "Sign in"}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
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
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything a small daycare needs — and nothing it doesn&apos;t.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            The day-to-day essentials, in one clean app your staff will actually enjoy using.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className={`flex size-11 items-center justify-center rounded-xl ${f.tint}`}>
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Up and running today.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              No training, no installs, no IT. If you can use a messaging app, you can use KiddieNest.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
                  {s.n}
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple, flat pricing.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            One price per daycare. No per-child fees, no surprises.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Sparkles className="size-3.5" />
            Founding offer
          </span>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight">$59</span>
            <span className="pb-1.5 text-sm text-slate-500 dark:text-slate-400">/ month per daycare</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Founding daycares lock in{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">$39/month for life</span>.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Unlimited children",
              "Unlimited staff & teachers",
              "Every feature included",
              "Always free for parents",
              "No setup fees · cancel anytime",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-slate-600 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/get-started"
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Get started
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            No per-child charges, ever.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-full max-w-3xl px-6 py-14 md:py-20">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions, answered.
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-sm font-semibold tracking-tight">{f.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to simplify your daycare?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Give your families a calmer, clearer window into their child&apos;s day — and give your
            staff their time back.
          </p>
          <Link
            href={signedIn ? "/app" : "/get-started"}
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            {signedIn ? "Go to dashboard" : "Get started"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span aria-hidden className="size-5 bg-current" style={emblemStyle} />
            </span>
            <span className="text-sm font-semibold tracking-tight">KiddieNest</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link href="#features" className="hover:text-slate-900 dark:hover:text-slate-200">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-200">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-200">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} KiddieNest
          </p>
        </div>
      </footer>
    </main>
  );
}
