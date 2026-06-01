import { Baby, HeartPulse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/careloop/app-shell";
import {
  ParentTimeline,
  type TimelineUpdate,
} from "@/components/careloop/parent-live-timeline";
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
  if (child) {
    const { data } = await supabase
      .from("daily_updates")
      .select("id, type, title, body, created_at")
      .eq("child_id", child.id)
      .order("created_at", { ascending: false });
    updates = data ?? [];
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
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardBase} h-fit p-6`}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
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

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900">
              <HeartPulse className="size-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Allergies
              </p>
              <p className="font-medium">{child.allergies}</p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} p-6`}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Today&apos;s timeline</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Updates from {firstName}&apos;s teachers appear here.
            </p>
          </div>
          <ParentTimeline updates={updates} />
        </div>
      </div>
    </AppShell>
  );
}
