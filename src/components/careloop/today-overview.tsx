import type { CSSProperties } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  type LucideIcon,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";

import { CountUp } from "@/components/careloop/count-up";
import { cn } from "@/lib/utils";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

type OverviewProps = {
  checkedIn: number;
  notArrived: number;
  absent: number;
  total: number;
};

// Solid color + a soft glow color (rgba) per status, matching the stat row tones.
const STATUS = {
  emerald: { color: "#10b981", glow: "rgba(16, 185, 129, 0.55)" },
  amber: { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)" },
  slate: { color: "#94a3b8", glow: "rgba(148, 163, 184, 0.45)" },
  sky: { color: "#38bdf8", glow: "rgba(56, 189, 248, 0.55)" },
} as const;

const QUICK_ACTIONS: {
  href: string;
  label: string;
  icon: LucideIcon;
  cls: string;
}[] = [
  {
    href: "/app/check-in",
    label: "Check in child",
    icon: UserPlus,
    cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    href: "/app/incidents",
    label: "Add incident",
    icon: AlertTriangle,
    cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    href: "/app/messages",
    label: "Send message",
    icon: MessageSquare,
    cls: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
];

export function TodayOverview({
  checkedIn,
  notArrived,
  absent,
  total,
}: OverviewProps) {
  return (
    <aside className={cn(cardBase, "flex flex-col overflow-hidden")}>
      {/* ===== Today's overview: legend + donut ===== */}
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <TrendingUp className="size-[18px]" />
          </span>
          <h2 className="text-base font-semibold">Today&apos;s overview</h2>
        </div>

        <div className="space-y-0.5">
          <LegendRow status="emerald" label="Checked in" value={checkedIn} />
          <LegendRow status="amber" label="Not arrived" value={notArrived} />
          <LegendRow status="slate" label="Absent" value={absent} />
          <LegendRow status="sky" label="Total children" value={total} />
        </div>

        <div className="mt-5 flex justify-center">
          <Donut
            checkedIn={checkedIn}
            notArrived={notArrived}
            absent={absent}
            total={total}
          />
        </div>
      </div>

      {/* ===== Quick actions ===== */}
      <div className="border-t border-slate-200 p-5 dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <Zap className="size-[18px]" />
          </span>
          <h2 className="text-base font-semibold">Quick actions</h2>
        </div>
        <div className="space-y-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  a.cls,
                )}
              >
                <a.icon className="size-[18px]" />
              </span>
              <span className="flex-1 text-sm font-medium">{a.label}</span>
              <ChevronRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500" />
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Help ===== */}
      <a
        href="https://kiddienestapp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 border-t border-slate-200 px-5 py-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <HelpCircle className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">Need help?</span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Visit our help center
          </span>
        </span>
        <ExternalLink className="size-4 shrink-0 text-slate-400 dark:text-slate-500" />
      </a>
    </aside>
  );
}

function LegendRow({
  status,
  label,
  value,
}: {
  status: keyof typeof STATUS;
  label: string;
  value: number;
}) {
  const s = STATUS[status];
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.glow}` }}
        />
        {label}
      </span>
      <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
        <CountUp value={value} />
      </span>
    </div>
  );
}

// A status-breakdown donut (checked in / not arrived / absent, sized by count)
// over a faint full-ring track. The center highlights the checked-in percentage,
// which is the metric an owner watches climb through the morning.
function Donut({ checkedIn, notArrived, absent, total }: OverviewProps) {
  const size = 172;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const segments = [
    { value: checkedIn, ...STATUS.emerald },
    { value: notArrived, ...STATUS.amber },
    { value: absent, ...STATUS.slate },
  ];

  let acc = 0;
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200/80 dark:stroke-slate-800"
        />
        {total > 0
          ? segments.map((seg, i) => {
              if (seg.value <= 0) return null;
              const len = (seg.value / total) * circ;
              const offset = -(acc / total) * circ;
              acc += seg.value;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${seg.glow})` }}
                />
              );
            })
          : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className="kn-stat-number text-3xl font-semibold tabular-nums text-slate-900 dark:text-white"
          style={{ "--kn-glow": STATUS.emerald.glow } as CSSProperties}
        >
          <CountUp value={pct} />%
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Checked in
        </p>
      </div>
    </div>
  );
}
