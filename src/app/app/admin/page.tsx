import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Baby,
  Blocks,
  Camera,
  CheckCircle2,
  Clock,
  LogIn,
  Moon,
  ShieldAlert,
  Sparkles,
  StickyNote,
  Utensils,
  XCircle,
} from "lucide-react";

import { AppShell } from "@/components/careloop/app-shell";
import { Badge } from "@/components/ui/badge";
import { RealtimeRefresh } from "@/components/careloop/realtime-refresh";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

type ChildRow = {
  id: string;
  full_name: string;
  room: string | null;
  emoji: string | null;
  avatar_bg: string | null;
  allergies: string | null;
  attendance_status: string;
};

type UpdateRow = {
  id: string;
  type: string;
  title: string;
  created_at: string;
  child_id: string;
};

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: childData }, { data: updateData }] = await Promise.all([
    supabase
      .from("children")
      .select("id, full_name, room, emoji, avatar_bg, allergies, attendance_status")
      .order("full_name"),
    supabase
      .from("daily_updates")
      .select("id, type, title, created_at, child_id")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const children = (childData ?? []) as ChildRow[];
  const updates = (updateData ?? []) as UpdateRow[];

  const total = children.length;
  const checkedIn = children.filter((c) => c.attendance_status === "checked_in").length;
  const notArrived = children.filter((c) => c.attendance_status === "not_arrived").length;
  const absent = children.filter((c) => c.attendance_status === "absent").length;

  const childById = new Map(children.map((c) => [c.id, c]));
  const recentUpdates = updates.map((u) => ({ ...u, child: childById.get(u.child_id) ?? null }));

  const allergyKids = children.filter(
    (c) => c.allergies && c.allergies.trim().toLowerCase() !== "none",
  );

  return (
    <AppShell
      role="Admin dashboard"
      title="Daycare command center"
      description="A live overview of your center — who's here today, the latest activity, and allergies to watch."
    >
      <RealtimeRefresh subscriptions={[{ table: "children" }, { table: "daily_updates" }]} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat title="Children" value={total} icon={Baby} tone="sky" />
        <Stat title="Checked in" value={checkedIn} icon={CheckCircle2} tone="emerald" />
        <Stat title="Not arrived" value={notArrived} icon={Clock} tone="amber" />
        <Stat title="Absent" value={absent} icon={XCircle} tone="slate" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className={cn(cardBase, "p-5 md:p-6")}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Children</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {total} enrolled
            </span>
          </div>

          {children.length === 0 ? (
            <EmptyState
              icon={Baby}
              title="No children enrolled yet"
              body="Once you add child profiles, your roster and live attendance will show here."
            />
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ background: child.avatar_bg ?? "#e2e8f0" }}
                  >
                    {child.emoji ?? "🙂"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{child.full_name}</p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {child.room || "Unassigned"}
                    </p>
                  </div>
                  <AttendanceBadge status={child.attendance_status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className={cn(cardBase, "p-5 md:p-6")}>
            <h2 className="text-xl font-semibold">Recent activity</h2>
            {recentUpdates.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Nothing logged yet"
                body="Daily updates posted by staff will appear here."
              />
            ) : (
              <div className="mt-4 space-y-4">
                {recentUpdates.map((u) => {
                  const meta = updateMeta[u.type] ?? fallbackMeta;
                  const Icon = meta.icon;
                  return (
                    <div key={u.id} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          meta.cls,
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {u.child?.full_name ?? "A child"}
                        </p>
                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                          {u.title}
                        </p>
                      </div>
                      <span className="shrink-0 pt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {timeAgo(u.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={cn(cardBase, "p-5 md:p-6")}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Allergy alerts</h2>
              <ShieldAlert className="size-5 text-slate-400 dark:text-slate-500" />
            </div>
            {allergyKids.length === 0 ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                No allergies on file.
              </p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {allergyKids.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10"
                  >
                    <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.full_name}</p>
                      <p className="truncate text-sm text-amber-700 dark:text-amber-400">
                        {c.allergies}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

const updateMeta: Record<string, { icon: LucideIcon; cls: string }> = {
  Meal: {
    icon: Utensils,
    cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  Nap: {
    icon: Moon,
    cls: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  Photo: {
    icon: Camera,
    cls: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  Note: {
    icon: StickyNote,
    cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  Activity: {
    icon: Blocks,
    cls: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  Incident: {
    icon: AlertTriangle,
    cls: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  Attendance: {
    icon: LogIn,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

const fallbackMeta = {
  icon: Sparkles,
  cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(iso);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function AttendanceBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    checked_in: {
      label: "Checked in",
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    not_arrived: {
      label: "Not arrived",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    absent: {
      label: "Absent",
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    checked_out: {
      label: "Checked out",
      cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
  };
  const m = map[status] ?? map.not_arrived;
  return (
    <Badge
      className={cn(
        "w-fit shrink-0 rounded-full border-transparent px-2.5 py-0.5 text-xs font-medium",
        m.cls,
      )}
    >
      {m.label}
    </Badge>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: "emerald" | "slate" | "sky" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div className={cn(cardBase, "p-5")}>
      <div className={cn("mb-4 flex size-11 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-6" />
      </div>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        <Icon className="size-6 text-slate-500 dark:text-slate-400" />
      </div>
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}
