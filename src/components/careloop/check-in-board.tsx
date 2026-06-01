"use client";

import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/careloop/count-up";
import { LocalTime } from "@/components/careloop/local-time";
import { useRealtime } from "@/lib/use-realtime";
import { cn } from "@/lib/utils";
import {
  getCheckinRoster,
  resetAllAttendance,
  setAttendance,
  type AttendanceStatus,
} from "@/app/app/check-in/actions";

type Child = {
  id: string;
  full_name: string;
  room: string;
  emoji: string;
  avatar_bg: string;
  allergies: string;
  attendance_status: AttendanceStatus;
  checked_in_at: string | null;
  checked_out_at: string | null;
};

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

function withStatus(c: Child, next: AttendanceStatus): Child {
  const now = new Date().toISOString();
  if (next === "checked_in") {
    return { ...c, attendance_status: next, checked_in_at: now, checked_out_at: null };
  }
  if (next === "checked_out") {
    return { ...c, attendance_status: next, checked_out_at: now };
  }
  return { ...c, attendance_status: next, checked_in_at: null, checked_out_at: null };
}

export function CheckInBoard({ childProfiles }: { childProfiles: Child[] }) {
  const [children, setChildren] = useState<Child[]>(childProfiles);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Tracks children with an in-flight write so a live re-fetch can't overwrite
  // a just-tapped status with stale data; the per-child write queue keeps rapid
  // taps in order so the last tap wins.
  const pendingRef = useRef<Set<string>>(new Set());
  const chainRef = useRef<Map<string, Promise<void>>>(new Map());

  const counts = useMemo(
    () => ({
      in: children.filter((c) => c.attendance_status === "checked_in").length,
      notArrived: children.filter((c) => c.attendance_status === "not_arrived").length,
      out: children.filter((c) => c.attendance_status === "checked_out").length,
      absent: children.filter((c) => c.attendance_status === "absent").length,
    }),
    [children],
  );

  // Merge a fresh roster but keep the local copy of any child mid-write, so a
  // live update can't revert a status the user just tapped.
  function mergeRoster(prev: Child[], roster: Child[]): Child[] {
    return roster.map((r) =>
      pendingRef.current.has(r.id) ? prev.find((c) => c.id === r.id) ?? r : r,
    );
  }

  // Live: when any staff member changes attendance, re-fetch so every screen
  // stays in sync without a manual refresh.
  useRealtime([{ table: "children" }], () => {
    getCheckinRoster().then((roster) =>
      setChildren((cs) => mergeRoster(cs, roster as Child[])),
    );
  });

  function setStatus(child: Child, next: AttendanceStatus) {
    setError(null);
    const id = child.id;

    // Update the screen instantly.
    setChildren((cs) => cs.map((c) => (c.id === id ? withStatus(c, next) : c)));

    // Don't let a live re-fetch clobber this child until its write settles.
    pendingRef.current.add(id);

    // Queue the write behind any earlier one for this child so taps land in
    // order and the final tap is what sticks.
    const prev = chainRef.current.get(id) ?? Promise.resolve();
    const run: Promise<void> = prev
      .then(async () => {
        const res = await setAttendance(id, next);
        if (res) setError(res.error);
      })
      .catch(() => {})
      .then(() => {
        // Only the last queued write for this child reconciles + releases.
        if (chainRef.current.get(id) === run) {
          chainRef.current.delete(id);
          pendingRef.current.delete(id);
          getCheckinRoster().then((roster) =>
            setChildren((cs) => mergeRoster(cs, roster as Child[])),
          );
        }
      });
    chainRef.current.set(id, run);
  }

  async function handleResetAll() {
    setError(null);
    setBusy(true);
    pendingRef.current.clear();
    chainRef.current.clear();
    const snapshot = children;
    setChildren((cs) =>
      cs.map((c) => ({
        ...c,
        attendance_status: "not_arrived" as const,
        checked_in_at: null,
        checked_out_at: null,
      })),
    );
    const res = await resetAllAttendance();
    setBusy(false);
    if (res) {
      setChildren(snapshot);
      setError(res.error);
    }
  }

  if (children.length === 0) {
    return (
      <div className={cn(cardBase, "p-8 text-center")}>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <CheckCircle2 className="size-6 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold">No children yet</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Add child profiles first, then you can check children in and out here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStatus label="Checked in" value={counts.in} tone="green" />
        <MiniStatus label="Not arrived" value={counts.notArrived} tone="amber" />
        <MiniStatus label="Checked out" value={counts.out} tone="purple" />
        <MiniStatus label="Absent" value={counts.absent} tone="gray" />
      </div>

      <div className={cn(cardBase, "p-5 md:p-6")}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Children</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tap a child to check them in, out, or mark absent.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAll}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Reset all
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child, index) => {
            const isIn = child.attendance_status === "checked_in";
            const isOut = child.attendance_status === "checked_out";
            return (
              <article
                key={child.id}
                style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
                className={cn(
                  "relative animate-in fade-in-0 slide-in-from-bottom-2 rounded-2xl border bg-white p-4 transition duration-500 [animation-fill-mode:both] dark:bg-slate-900",
                  isIn
                    ? "border-emerald-300 ring-1 ring-emerald-500/20 dark:border-emerald-500/40 dark:ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                {isIn ? (
                  <span className="absolute right-3 top-3 flex size-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </span>
                ) : null}
                <div className="flex gap-4">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                    style={{ background: child.avatar_bg }}
                  >
                    {child.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">{child.full_name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {child.room || "—"}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={child.attendance_status} />
                    </div>
                    {isIn && child.checked_in_at ? (
                      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        Checked in at <LocalTime iso={child.checked_in_at} />
                      </p>
                    ) : null}
                    {isOut && child.checked_out_at ? (
                      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        Checked out at <LocalTime iso={child.checked_out_at} />
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                      Allergy: {child.allergies}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <StatusButton
                    label="Check in"
                    active={isIn}
                    activeClassName="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => setStatus(child, "checked_in")}
                  />
                  <StatusButton
                    label="Check out"
                    active={isOut}
                    activeClassName="bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() => setStatus(child, "checked_out")}
                  />
                  <StatusButton
                    label="Absent"
                    active={child.attendance_status === "absent"}
                    activeClassName="bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100"
                    onClick={() => setStatus(child, "absent")}
                  />
                  <StatusButton
                    label="Reset"
                    active={false}
                    activeClassName=""
                    onClick={() => setStatus(child, "not_arrived")}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusButton({
  label,
  active,
  activeClassName,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClassName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 rounded-xl text-sm font-medium transition-colors",
        active
          ? activeClassName
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
      )}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const map = {
    checked_in: {
      icon: CheckCircle2,
      label: "Checked in",
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    checked_out: {
      icon: ShieldCheck,
      label: "Checked out",
      cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
    absent: {
      icon: XCircle,
      label: "Absent",
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    not_arrived: {
      icon: Clock,
      label: "Not arrived",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
  } as const;

  const { icon: Icon, label, cls } = map[status];

  return (
    <Badge
      className={cn(
        "w-fit justify-center gap-1 whitespace-nowrap rounded-full border-transparent px-3 py-1 text-xs font-medium",
        cls,
      )}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}

function MiniStatus({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "gray" | "purple";
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    purple: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    gray: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className={cn("rounded-xl p-4 text-center", tones[tone])}>
      <p className="text-2xl font-semibold tabular-nums">
        <CountUp value={value} />
      </p>
      <p className="mt-1 text-xs font-medium leading-tight">{label}</p>
    </div>
  );
}
