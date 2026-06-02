"use client";

import {
  useActionState,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  Check,
  KeyRound,
  Loader2,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";

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

type AccountType = "parent" | "owner";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [accountType, setAccountType] = useState<AccountType>("parent");
  const [showCode, setShowCode] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    null,
  );

  const isSignup = mode === "signup";
  const isOwner = accountType === "owner";

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
      {/* atmosphere — ties the page to the landing */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 size-[460px] rounded-full bg-emerald-300/25 blur-[130px] dark:bg-emerald-500/10" />
        <div className="absolute -bottom-40 -right-24 size-[460px] rounded-full bg-sky-200/35 blur-[130px] dark:bg-sky-500/10" />
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]" style={dotGrid} />

        {/* floating product chips — echo the landing, calm + alive (desktop only) */}
        <div className="absolute left-[12%] top-[24%] hidden lg:block">
          <FloatChip delay="0s">
            <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span>
              <span className="block font-semibold">Mia checked in</span>
              <span className="block text-slate-400 dark:text-slate-500">8:42 AM</span>
            </span>
          </FloatChip>
        </div>

        <div className="absolute right-[11%] top-[34%] hidden lg:block">
          <FloatChip delay="1.6s">
            <span className="flex size-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              <Camera className="size-3.5" />
            </span>
            <span>
              <span className="block font-semibold">New photo</span>
              <span className="block text-slate-400 dark:text-slate-500">Story time</span>
            </span>
          </FloatChip>
        </div>

        <div className="absolute right-[13%] top-[56%] hidden lg:block">
          <FloatChip delay="3.1s">
            <span className="flex size-7 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <MessageCircle className="size-3.5" />
            </span>
            <span>
              <span className="block font-semibold">Ms. Lee</span>
              <span className="block text-slate-400 dark:text-slate-500">She had a great day! 💛</span>
            </span>
          </FloatChip>
        </div>
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
              ? "First, who are you setting this up as?"
              : "Sign in to your KiddieNest account."}
          </p>

          {/* role chooser (signup only) */}
          {isSignup ? (
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <RoleCard
                active={!isOwner}
                onClick={() => setAccountType("parent")}
                icon={<Users className="size-5" />}
                title="I'm a parent"
                sub="Free — follow your child"
              />
              <RoleCard
                active={isOwner}
                onClick={() => setAccountType("owner")}
                icon={<Building2 className="size-5" />}
                title="I run a daycare"
                sub="Start your workspace"
              />
            </div>
          ) : null}

          <form action={formAction} className="mt-5 space-y-4">
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="accountType" value={accountType} />

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
                  Optional — instantly sets up an admin account without payment.
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
                  {!isSignup
                    ? "Sign in"
                    : isOwner
                      ? "Continue to payment"
                      : "Create free account"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {isSignup && isOwner ? (
              <p className="animate-in fade-in-0 text-center text-xs text-slate-400 duration-300 dark:text-slate-500">
                $59/month · cancel anytime · free for the parents you invite
              </p>
            ) : null}
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
        .kn-float {
          animation: kn-float-move 7s ease-in-out infinite;
          opacity: 0;
          animation-name: kn-float-in, kn-float-move;
          animation-duration: 0.8s, 7s;
          animation-timing-function: ease-out, ease-in-out;
          animation-iteration-count: 1, infinite;
          animation-fill-mode: both, both;
        }
        @keyframes kn-float-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes kn-float-move { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @media (prefers-reduced-motion: reduce) { .kn-float { animation: kn-float-in 0.8s ease-out both; } }
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

function FloatChip({
  children,
  delay = "0s",
}: {
  children: ReactNode;
  delay?: string;
}) {
  return (
    <div
      className="kn-float flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90"
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-all active:scale-[0.99] ${
        active
          ? "border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/10 dark:border-emerald-500/60 dark:bg-emerald-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
      }`}
    >
      {active ? (
        <span className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="size-3" strokeWidth={3} />
        </span>
      ) : null}
      <span
        className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
          active
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-500 group-hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        {icon}
      </span>
      <span className="mt-0.5 block text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </span>
      <span className="block text-xs text-slate-500 dark:text-slate-400">{sub}</span>
    </button>
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
