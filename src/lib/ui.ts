// Shared visual primitives for the KiddieNest design system (calm iOS feel,
// slate + emerald, full light/dark). Centralized so the look stays consistent
// everywhere and a future theme change is a one-line edit instead of a
// fifteen-file sweep.

// The standard card surface used across every screen.
export const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

// The standard text input used in the staff dialogs and forms. (Rooms keeps a
// deliberate local variant with a larger type size and stronger focus ring.)
export const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

// The brand emblem, applied as a CSS mask so it takes on whatever background
// color the host element sets (e.g. `bg-current`, `bg-emerald-500`) — one PNG
// works across light and dark surfaces.
export const emblemStyle = {
  maskImage: "url(/brand-emblem.png)",
  WebkitMaskImage: "url(/brand-emblem.png)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;
