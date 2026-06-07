import { Baby, Clock } from "lucide-react";

import { ParentIncidents } from "@/components/careloop/parent-incidents";
import { RealtimeRefresh } from "@/components/careloop/realtime-refresh";
import {
  ParentTimeline,
  type TimelineUpdate,
} from "@/components/careloop/parent-live-timeline";
import { LocalTime } from "@/components/careloop/local-time";
import { getIncidentsForChild } from "@/app/app/incidents/actions";
import { createClient } from "@/lib/supabase/server";

import { loadParentChild } from "./shared";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

function StatusPill({
  status,
  inAt,
  outAt,
}: {
  status: string;
  inAt: string | null;
  outAt: string | null;
}) {
  if (status === "checked_in") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Checked in{inAt ? <> · <LocalTime iso={inAt} /></> : null}
      </span>
    );
  }
  if (status === "checked_out") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <span className="size-1.5 rounded-full bg-slate-400" />
        Checked out{outAt ? <> · <LocalTime iso={outAt} /></> : null}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
      <Clock className="size-3" />
      Not arrived yet
    </span>
  );
}

export default async function ParentTodayPage() {
  const child = await loadParentChild();

  if (!child) {
    return (
      <div className={`${cardBase} p-8 text-center`}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Baby className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No child linked yet</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Your account isn&apos;t connected to a child yet. Ask your daycare to invite you with
            this email — your child&apos;s updates will then appear here automatically.
          </p>
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: updateRows }, incidents] = await Promise.all([
    supabase
      .from("daily_updates")
      .select("id, type, title, body, created_at, photo_path")
      .eq("child_id", child.id)
      .order("created_at", { ascending: false }),
    getIncidentsForChild(child.id),
  ]);
  const rows = updateRows ?? [];

  // Resolve photos to short-lived, resized signed URLs. Signing respects the
  // bucket's RLS, so a parent only ever receives URLs for their own child.
  const paths = rows
    .map((r) => r.photo_path)
    .filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    // Sign each photo individually with an image transform so parents download
    // a resized, modern-format version instead of the full-size phone-camera
    // original. The batch createSignedUrls API does not support transforms, so
    // we sign per path in parallel.
    const uniquePaths = [...new Set(paths)];
    const signedPairs = await Promise.all(
      uniquePaths.map(async (p) => {
        const { data } = await supabase.storage
          .from("child-photos")
          .createSignedUrl(p, 3600, { transform: { width: 1000, quality: 70 } });
        return [p, data?.signedUrl ?? null] as const;
      }),
    );
    for (const [p, url] of signedPairs) {
      if (url) signed.set(p, url);
    }
  }

  const updates: TimelineUpdate[] = rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    created_at: r.created_at,
    photo_url: r.photo_path ? (signed.get(r.photo_path) ?? null) : null,
  }));
  const firstName = child.full_name.split(" ")[0];

  return (
    <>
      <RealtimeRefresh
        subscriptions={[
          { table: "daily_updates", filter: `child_id=eq.${child.id}` },
          { table: "children", filter: `id=eq.${child.id}` },
        ]}
      />

      <div className="space-y-5">
        {/* Child header */}
        <section className={`${cardBase} p-5`}>
          <div className="flex items-center gap-4">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm"
              style={{ background: child.avatar_bg }}
            >
              {child.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold tracking-tight">
                {child.full_name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {child.room || "Classroom not set"}
              </p>
              <div className="mt-2">
                <StatusPill
                  status={child.attendance_status}
                  inAt={child.checked_in_at}
                  outAt={child.checked_out_at}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Incidents needing acknowledgement (only renders if any) */}
        <ParentIncidents childId={child.id} initial={incidents} />

        {/* Live timeline */}
        <section className={`${cardBase} p-5`}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Today&apos;s timeline</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Updates from {firstName}&apos;s teachers, live.
            </p>
          </div>
          <ParentTimeline updates={updates} />
        </section>
      </div>
    </>
  );
}
