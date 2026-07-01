"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";
import { emblemStyle } from "@/lib/ui";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "kn-install-dismissed-at";
const HIDE_DAYS = 14;

function recentlyDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    return Date.now() - Number(v) < HIDE_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [mode, setMode] = useState<"none" | "android" | "ios">("none");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    // Android / Chromium: capture the native install opportunity.
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari: no programmatic prompt — show a gentle hint after a beat.
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIOS && isSafari) {
      t = setTimeout(() => setMode((m) => (m === "none" ? "ios" : m)), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (t) clearTimeout(t);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setMode("none");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setMode("none");
  }

  if (mode === "none") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 84px)" }}
    >
      <div className="mx-auto flex max-w-md animate-in fade-in-0 slide-in-from-bottom-3 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 duration-500 dark:border-slate-700 dark:bg-slate-900">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          <span aria-hidden className="size-6 bg-current" style={emblemStyle} />
        </span>

        {mode === "android" ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-tight">Install KiddieNest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add it to your home screen for quick access.
              </p>
            </div>
            <button
              type="button"
              onClick={install}
              className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Install
            </button>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-tight">Add to Home Screen</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap{" "}
                <Share className="mx-0.5 inline size-3.5 -translate-y-px" aria-label="Share" />{" "}
                then “Add to Home Screen.”
              </p>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
