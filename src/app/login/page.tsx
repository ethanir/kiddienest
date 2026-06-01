"use client";

import { useActionState, useState, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";

import { authenticate, type AuthState } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    null,
  );

  const isSignup = mode === "signup";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Heart className="size-5" />
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            CareLoop
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isSignup
              ? "Set up a CareLoop account to get started."
              : "Sign in to your CareLoop account."}
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
              />
            ) : null}

            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />

            {state?.error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {state.error}
              </p>
            ) : null}
            {state?.message ? (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isSignup ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignup ? "Already have an account?" : "New to CareLoop?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "signin" : "signup")}
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}
