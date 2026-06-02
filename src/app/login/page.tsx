"use client";

import {
  useActionState,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Loader2, Lock } from "lucide-react";

import { authenticate, type AuthState } from "./actions";

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

const dotGrid = {
  backgroundImage: "radial-gradient(rgb(100 116 139) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
} as const;

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showCode, setShowCode] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    null,
  );

  const isSignup = mode === "signup";

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
      {/* atmosphere — ties the page to the landing */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 size-[440px] -translate-x-1/2 rounded-full bg-emerald-300/25 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]" style={dotGrid} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* logo */}
        <Link
          href="/"
          className="mb-6 flex animate-in fade-in-0 slide-in-from-bottom-2 items-center justify-center gap-2.5 duration-700 [animation-fill-mode:both]"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <span aria-hidden className="size-6 bg-current" style={emblemStyle} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            KiddieNest
          </span>
        </Link>

        {/* card */}
        <div
          className="relative animate-in fade-in-0 slide-in-from-bottom-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 duration-700 [animation-fill-mode:both] sm:p-7 dark:border-slate-800 dark:bg-slate-900"
          style={{ animationDelay: "90ms" }}
        >
          {/* clean top loading bar */}
          {pending ? <span className="kn-loadbar" aria-hidden /> : null}

          {/* subtle unlock-code toggle (signup only) */}
          {isSignup ? (
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              aria-label="Have an unlock code?"
              title="Have an unlock code?"
              className={`absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg transition-colors ${
                showCode
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-slate-300 hover:bg-slate-100 hover:text-slate-500 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-400"
              }`}
            >
              <KeyRound className="size-4" />
            </button>
          ) : null}

          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isSignup
              ? "Set up your KiddieNest account in seconds."
              : "Sign in to your KiddieNest account."}
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="mode" value={mode} />

            {isSignup ? (
              <Field
                label="Full name"
                name="fullName"
                type="text"
                placeholder="Jordan Smith"
                autoComplete="name"
                delay={0}
              />
            ) : null}

            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              delay={isSignup ? 60 : 0}
            />

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              delay={isSignup ? 120 : 60}
            />

            {isSignup && showCode ? (
              <div className="animate-in fade-in-0 slide-in-from-top-1 duration-300">
                <Field
                  label="Unlock code"
                  name="code"
                  type="text"
                  placeholder="Enter your code"
                  autoComplete="off"
                  icon={<Lock className="size-4" />}
                />
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  Daycare admins only — sets up an admin account.
                </p>
              </div>
            ) : null}

            {state?.error ? (
              <p className="animate-in fade-in-0 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 duration-300 dark:bg-rose-500/10 dark:text-rose-400">
                {state.error}
              </p>
            ) : null}
            {state?.message ? (
              <p className="animate-in fade-in-0 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 duration-300 dark:bg-emerald-500/10 dark:text-emerald-400">
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignup ? "Already have an account?" : "New to KiddieNest?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "signin" : "signup");
                setShowCode(false);
              }}
              className="font-medium text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>

        <p
          className="mt-6 animate-in fade-in-0 text-center text-sm duration-1000 [animation-fill-mode:both]"
          style={{ animationDelay: "200ms" }}
        >
          <Link
            href="/"
            className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            ← Back to home
          </Link>
        </p>
      </div>

      <style>{`
        .kn-loadbar {
          position: absolute;
          top: 0;
          left: -40%;
          height: 2px;
          width: 40%;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          animation: kn-load 1.1s ease-in-out infinite;
        }
        @keyframes kn-load { 0% { left: -40%; } 100% { left: 100%; } }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #0f172a;
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
          caret-color: #0f172a;
          transition: background-color 9999s ease-out 0s;
        }
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          -webkit-text-fill-color: #f1f5f9;
          -webkit-box-shadow: 0 0 0 1000px #1e293b inset;
          caret-color: #f1f5f9;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  icon,
  delay = 0,
  ...props
}: {
  label: string;
  icon?: ReactNode;
  delay?: number;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className="block animate-in fade-in-0 slide-in-from-bottom-2 duration-500 [animation-fill-mode:both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          {...props}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white ${
            icon ? "pl-9 pr-3" : "px-3"
          } text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500`}
        />
      </div>
    </label>
  );
}
