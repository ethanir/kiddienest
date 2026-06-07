import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

import { CountUp } from "@/components/careloop/count-up";
import { cn } from "@/lib/utils";

type Tone = "sky" | "emerald" | "amber" | "slate";

export type StatHeroItem = {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: Tone;
};

// Per-tone styling. `glow` is an rgba string fed into a `--kn-glow` CSS variable
// that the glow classes in globals.css read for box-shadow / text-shadow. The
// rest are Tailwind classes for borders, icon color, and the underline gradient.
type ToneStyle = {
  glow: string;
  ring: string;
  icon: string;
  bar: string;
  inner: string;
};

const toneStyles: Record<Tone, ToneStyle> = {
  sky: {
    glow: "rgba(56, 189, 248, 0.55)",
    ring: "border-sky-400/50 dark:border-sky-400/70",
    icon: "text-sky-500 dark:text-sky-300",
    bar: "from-sky-400 to-sky-300",
    inner: "bg-sky-400/5 dark:bg-sky-400/10",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.55)",
    ring: "border-emerald-400/50 dark:border-emerald-400/70",
    icon: "text-emerald-500 dark:text-emerald-300",
    bar: "from-emerald-400 to-emerald-300",
    inner: "bg-emerald-400/5 dark:bg-emerald-400/10",
  },
  amber: {
    glow: "rgba(245, 158, 11, 0.5)",
    ring: "border-amber-400/50 dark:border-amber-400/70",
    icon: "text-amber-500 dark:text-amber-300",
    bar: "from-amber-400 to-amber-300",
    inner: "bg-amber-400/5 dark:bg-amber-400/10",
  },
  slate: {
    glow: "rgba(148, 163, 184, 0.4)",
    ring: "border-slate-300/70 dark:border-slate-600/70",
    icon: "text-slate-400 dark:text-slate-400",
    bar: "from-slate-300 to-slate-200 dark:from-slate-500 dark:to-slate-600",
    inner: "bg-slate-400/5 dark:bg-slate-500/10",
  },
};

export function StatHero({
  title,
  value,
  icon: Icon,
  tone,
  index = 0,
}: StatHeroItem & { index?: number }) {
  const s = toneStyles[tone];
  return (
    <div
      style={
        {
          animationDelay: `${index * 70}ms`,
          "--kn-glow": s.glow,
        } as CSSProperties
      }
      className="flex animate-in flex-col items-center text-center fade-in-0 slide-in-from-bottom-2 duration-500 [animation-fill-mode:both]"
    >
      <div
        className={cn(
          "kn-stat-ring relative flex size-14 items-center justify-center rounded-full border",
          s.ring,
          s.inner,
        )}
      >
        <Icon className={cn("size-6", s.icon)} />
      </div>
      <p className="kn-stat-number mt-4 text-4xl font-semibold tracking-tight tabular-nums text-slate-900 sm:text-5xl dark:text-white">
        <CountUp value={value} />
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div
        className={cn(
          "kn-stat-bar mt-3 h-1 w-12 rounded-full bg-gradient-to-r",
          s.bar,
        )}
      />
    </div>
  );
}

export function StatHeroRow({ items }: { items: StatHeroItem[] }) {
  return (
    <div className="relative overflow-hidden py-4">
      {/* Ambient flowing light. Two blurred color blobs drift slowly behind the
          row (animation lives in globals.css and is disabled for reduced-motion). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="kn-mist absolute left-[12%] top-1/2 size-56 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[80px] dark:bg-sky-500/20" />
        <div className="kn-mist-2 absolute right-[12%] top-1/2 size-56 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[80px] dark:bg-emerald-500/15" />
      </div>

      {/* 2x2 on mobile (connectors hidden), single glowing row on desktop. */}
      <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-x-0">
        {items.map((item, i) => (
          <Fragment key={item.title}>
            {i > 0 ? <Connector /> : null}
            <StatHero {...item} index={i} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div aria-hidden className="hidden items-center justify-center px-2 lg:flex">
      <div className="relative h-px w-10 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700">
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>
    </div>
  );
}
