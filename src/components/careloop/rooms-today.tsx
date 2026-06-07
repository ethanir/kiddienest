import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export type RoomOverview = {
  id: string;
  name: string;
  enrolled: number;
  present: number;
  capacity: number | null;
  staff: number;
  maxPer: number | null;
  neededStaff: number | null;
  understaffed: boolean;
};

export function RoomsToday({
  rooms,
  unassignedCount,
}: {
  rooms: RoomOverview[];
  unassignedCount: number;
}) {
  if (rooms.length === 0) return null;
  return (
    <section className={cn(cardBase, "p-5 md:p-6")}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Rooms today</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {rooms.map((r) => {
          const pct = r.enrolled > 0 ? Math.round((r.present / r.enrolled) * 100) : 0;
          return (
            <div
              key={r.id}
              className={cn(
                "rounded-xl border p-4",
                r.understaffed
                  ? "border-amber-300 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-500/5"
                  : "border-slate-200 dark:border-slate-800",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-medium">{r.name}</p>
                <p className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {r.present}
                  </span>
                  <span className="tabular-nums"> / {r.enrolled}</span>
                  {r.capacity != null ? (
                    <span className="text-slate-400 dark:text-slate-500">
                      {" "}
                      · cap {r.capacity}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="size-3.5" />
                  {r.staff} {r.staff === 1 ? "teacher" : "teachers"}
                  {r.staff > 0 ? (
                    <span className="text-slate-400 dark:text-slate-500">
                      · {r.present}:{r.staff}
                    </span>
                  ) : null}
                </span>
                {r.understaffed ? (
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                    Needs {(r.neededStaff ?? 0) - r.staff} more
                  </span>
                ) : r.maxPer && r.present > 0 ? (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Ratio ok
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {unassignedCount > 0 ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          {unassignedCount} {unassignedCount === 1 ? "child is" : "children are"} not assigned to a
          room yet.
        </p>
      ) : null}
    </section>
  );
}
