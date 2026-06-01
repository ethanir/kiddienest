import { Baby, HeartPulse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/careloop/app-shell";
import { MessageThread } from "@/components/careloop/message-thread";
import { ParentIncidents } from "@/components/careloop/parent-incidents";
import { RealtimeRefresh } from "@/components/careloop/realtime-refresh";
import {
  ParentTimeline,
  type TimelineUpdate,
} from "@/components/careloop/parent-live-timeline";
import { getIncidentsForChild } from "@/app/app/incidents/actions";
import { createClient } from "@/lib/supabase/server";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default async function ParentPage() {
  const supabase = await createClient();

  // Connect this parent to any children they were invited to (no-op if none).
  await supabase.rpc("claim_guardian_invites");

  // Row-Level Security means a parent only receives their own linked children.
  const { data: childRows } = await supabase
    .from("children")
    .select("id, full_name, room, emoji, avatar_bg, allergies")
    .order("full_name");

  const child = childRows?.[0] ?? null;

  let updates: TimelineUpdate[] = [];
  let incidents: Awaited<ReturnType<typeof getIncidentsForChild>> = [];
  if (child) {
    const [{ data: updateRows }, incidentRows] = await Promise.all([
      supabase
        .from("daily_updates")
        .select("id, type, title, body, created_at")
        .eq("child_id", child.id)
        .order("created_at", { ascending: false }),
      getIncidentsForChild(child.id),
    ]);
    updates = updateRows ?? [];
    incidents = incidentRows;
  }

  if (!child) {
    return (
      <AppShell
        role="Parent portal"
        title="Your child's day"
        description="Daily updates, check-in status, photos, messages, and forms — all in one place."
      >
        <div className={`${cardBase} p-8 text-center`}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Baby className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No child linked yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Your account isn&apos;t connected to a child yet. Ask your daycare to invite you with
            this account&apos;s email — once they do, your child&apos;s daily updates will appear
            here automatically.
          </p>
        </div>
      </AppShell>
    );
  }

  const firstName = child.full_name.split(" ")[0];

  return (
    <AppShell
      role="Parent portal"
      title={`${firstName}'s day`}
      description="Daily updates, photos, messages, and forms — all in one place."
    >
      <div className="space-y-5">
        <RealtimeRefresh
          subscriptions={[{ table: "daily_updates", filter: `child_id=eq.${child.id}` }]}
        />

        <section className={`${cardBase} p-5 md:p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                style={{ background: child.avatar_bg }}
              >
                {child.emoji}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{child.full_name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {child.room || "Classroom not set"}
                </p>
                <Badge className="mt-2 rounded-full border-transparent bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Enrolled
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-w-[240px]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900">
                <HeartPulse className="size-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Allergies</p>
                <p className="truncate font-medium">{child.allergies}</p>
              </div>
            </div>
          </div>
        </section>

        <ParentIncidents childId={child.id} initial={incidents} />

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={`${cardBase} flex flex-col p-5 md:p-6 lg:h-[560px]`}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Today&apos;s timeline</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Updates from {firstName}&apos;s teachers appear here.
              </p>
            </div>
            <div className="min-h-0 flex-1 lg:overflow-y-auto lg:pr-1">
              <ParentTimeline updates={updates} />
            </div>
          </section>

          <section className={`${cardBase} flex h-[520px] flex-col p-5 md:p-6 lg:h-[560px]`}>
            <div className="mb-1">
              <h2 className="text-xl font-semibold">Messages</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Message {firstName}&apos;s teachers directly.
              </p>
            </div>
            <div className="mt-3 min-h-0 flex-1">
              <MessageThread childId={child.id} viewerRole="parent" />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
