import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Baby,
  Blocks,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  LogIn,
  MessageCircle,
  Moon,
  ShieldAlert,
  Sparkles,
  StickyNote,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import { AppShell } from "@/components/careloop/app-shell";
import { CountUp } from "@/components/careloop/count-up";
import { DashboardGreeting } from "@/components/careloop/dashboard-greeting";
import { RealtimeRefresh } from "@/components/careloop/realtime-refresh";
import { createClient } from "@/lib/supabase/server";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { getRooms } from "@/app/app/rooms/actions";
import { cn } from "@/lib/utils";
import { openBillingPortal } from "@/lib/billing";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

type ChildRow = {
  id: string;
  full_name: string;
  room_id: string | null;
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

  // Everything the dashboard needs, fetched in ONE parallel wave. The children
  // select is trimmed to exactly the columns the stats/lookups use (no emoji,
  // avatar or room name — nothing here renders them) and is unordered, since
  // the roster itself is never listed on this screen. The daycare row is read
  // under RLS so it's only ever the caller's own; getCurrentRole/getCurrentUser
  // share a single cached auth call.
  const [
    viewerRole,
    user,
    { data: childData },
    { data: updateData },
    rooms,
    { data: staffRows },
    { data: daycare },
  ] = await Promise.all([
    getCurrentRole(),
    getCurrentUser(),
    supabase
      .from("children")
      .select("id, full_name, room_id, allergies, attendance_status"),
    supabase
      .from("daily_updates")
      .select("id, type, title, created_at, child_id")
      .order("created_at", { ascending: false })
      .limit(6),
    getRooms(),
    supabase.from("profiles").select("room_id").in("role", ["staff", "admin"]),
    supabase
      .from("daycares")
      .select("owner_id, subscription_status, stripe_customer_id")
      .maybeSingle(),
  ]);
  const isAdmin = viewerRole === "admin";

  const children = (childData ?? []) as ChildRow[];
  const updates = (updateData ?? []) as UpdateRow[];

  const total = children.length;
  const checkedIn = children.filter((c) => c.attendance_status === "checked_in").length;
  const notArrived = children.filter((c) => c.attendance_status === "not_arrived").length;
  const absent = children.filter((c) => c.attendance_status === "absent").length;

  const childById = new Map(children.map((c) => [c.id, c]));
  const recentUpdates = updates.map((u) => ({ ...u, child: childById.get(u.child_id) ?? null }));

  // Per-room overview (present vs enrolled, plus staffing ratio) for the dashboard.
  const staffCounts: Record<string, number> = {};
  for (const s of (staffRows ?? []) as { room_id: string | null }[]) {
    if (s.room_id) staffCounts[s.room_id] = (staffCounts[s.room_id] ?? 0) + 1;
  }

  const roomOverview = rooms.map((r) => {
    const inRoom = children.filter((c) => c.room_id === r.id);
    const present = inRoom.filter((c) => c.attendance_status === "checked_in").length;
    const staff = staffCounts[r.id] ?? 0;
    const maxPer = r.max_per_staff;
    const neededStaff = maxPer && maxPer > 0 ? Math.ceil(present / maxPer) : null;
    const understaffed = neededStaff != null && present > 0 && staff < neededStaff;
    return {
      id: r.id,
      name: r.name,
      enrolled: inRoom.length,
      present,
      capacity: r.capacity,
      staff,
      maxPer,
      neededStaff,
      understaffed,
    };
  });
  const unassignedCount = children.filter((c) => !c.room_id).length;
  const understaffedCount = roomOverview.filter((r) => r.understaffed).length;

  const allergyKids = children.filter(
    (c) => c.allergies && c.allergies.trim().toLowerCase() !== "none",
  );

  // Billing is shown only to the owner (the person who pays); the daycare row
  // was fetched above under RLS, so it's only ever the caller's own.
  const isOwner = Boolean(user && daycare && daycare.owner_id === user.id);
  const subscriptionStatus = (daycare?.subscription_status as string | null) ?? null;
  const hasBillingCustomer = Boolean(daycare?.stripe_customer_id);

  return (
    <AppShell
      role={isAdmin ? "Admin dashboard" : "Staff dashboard"}
      title="Daycare command center"
      description={
        isAdmin
          ? "A live overview of your center — who's here today, the latest activity, and allergies to watch."
          : "A live overview of your room — who's here today, the latest activity, and allergies to watch."
      }
    >
      <RealtimeRefresh subscriptions={[{ table: "children" }, { table: "daily_updates" }]} />
      <div className="lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col lg:overflow-hidden">
        <div className="mb-3 lg:shrink-0">
          <DashboardGreeting rooms={roomOverview.length} childrenCount={total} />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:shrink-0">
          <Stat title="Children" value={total} icon={Baby} tone="sky" index={0} />
          <Stat title="Checked in" value={checkedIn} icon={CheckCircle2} tone="emerald" index={1} />
          <Stat title="Not arrived" value={notArrived} icon={Clock} tone="amber" index={2} />
          <Stat title="Absent" value={absent} icon={XCircle} tone="slate" index={3} />
        </div>

        <div className="mt-4 grid gap-4 lg:mt-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-1 lg:gap-5">
          {/* Rooms — fills the left column, scrolls internally on desktop */}
          <section className={cn(cardBase, "p-5 md:p-6 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden")}>
            <div className="mb-4 flex items-center justify-between gap-3 lg:shrink-0">
              <h2 className="text-xl font-semibold">Rooms today</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {roomOverview.length} {roomOverview.length === 1 ? "room" : "rooms"}
              </span>
            </div>
            <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
              {roomOverview.length > 0 ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {roomOverview.map((r) => {
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
                      {unassignedCount} {unassignedCount === 1 ? "child is" : "children are"} not
                      assigned to a room yet.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  No rooms yet. Add rooms to see live attendance by room.
                </p>
              )}
            </div>
          </section>

          {/* Right rail — packed so it fits one screen without scrolling */}
          <div className="flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
            <section className={cn(cardBase, "p-4")}>
              <h2 className="text-base font-semibold">Quick actions</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <QuickAction href="/app/check-in" icon={CheckCircle2} label="Check in" tone="emerald" />
                <QuickAction href="/app/daily-report" icon={ClipboardList} label="Post update" tone="sky" />
                <QuickAction href="/app/messages" icon={MessageCircle} label="Message" tone="violet" />
                <QuickAction href="/app/incidents" icon={ShieldAlert} label="Incident" tone="amber" />
              </div>
            </section>

            <section className={cn(cardBase, "p-4")}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Needs attention</h2>
                <ShieldAlert className="size-4 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="mt-2 grid gap-0.5">
                <AttnRow href="/app/rooms" label="Understaffed rooms" count={understaffedCount} />
                <AttnRow href="/app/children" label="Children with allergies" count={allergyKids.length} />
                <AttnRow href="/app/children" label="Unassigned children" count={unassignedCount} />
              </div>
            </section>

            <section className={cn(cardBase, "p-4")}>
              <h2 className="text-base font-semibold">Recent activity</h2>
              {recentUpdates.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Nothing logged yet"
                  body="Daily updates from staff show up here."
                />
              ) : (
                <div className="mt-3 space-y-3">
                  {recentUpdates.slice(0, 3).map((u) => {
                    const meta = updateMeta[u.type] ?? fallbackMeta;
                    const Icon = meta.icon;
                    return (
                      <div key={u.id} className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            meta.cls,
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {u.child?.full_name ?? "A child"}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {u.title}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                          {timeAgo(u.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {isOwner ? (
              <section className={cn(cardBase, "p-4")}>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CreditCard className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Subscription</p>
                      <SubscriptionBadge status={subscriptionStatus} />
                    </div>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      KiddieNest · $59/month
                    </p>
                  </div>
                  {hasBillingCustomer ? (
                    <form action={openBillingPortal} className="shrink-0">
                      <button
                        type="submit"
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Manage
                      </button>
                    </form>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
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

function SubscriptionBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const map: Record<string, { label: string; cls: string }> = {
    active: {
      label: "Active",
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    trialing: {
      label: "Trial",
      cls: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    },
    past_due: {
      label: "Past due",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    unpaid: {
      label: "Unpaid",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    canceled: {
      label: "Canceled",
      cls: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    },
  };
  const m = map[status] ?? {
    label: status,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", m.cls)}>
      {m.label}
    </span>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
  tone,
  index = 0,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: "emerald" | "slate" | "sky" | "amber";
  index?: number;
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        cardBase,
        "flex items-center gap-3 p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 [animation-fill-mode:both]",
      )}
    >
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tabular-nums leading-tight">
          <CountUp value={value} />
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{title}</p>
      </div>
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
    <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <Icon className="size-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{body}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  tone: "emerald" | "sky" | "violet" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
    >
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
        <Icon className="size-4" />
      </span>
      <span className="truncate text-sm font-medium">{label}</span>
    </Link>
  );
}

function AttnRow({ href, label, count }: { href: string; label: string; count: number }) {
  const alert = count > 0;
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
    >
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            "min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold tabular-nums",
            alert
              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
          )}
        >
          {count}
        </span>
        <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" />
      </span>
    </Link>
  );
}
