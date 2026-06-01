"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

import { LocalTime } from "@/components/careloop/local-time";
import { cn } from "@/lib/utils";
import { acknowledgeIncident, type IncidentRecord } from "@/app/app/incidents/actions";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const severityCls: Record<string, string> = {
  Minor: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  Moderate: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Serious: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export function ParentIncidents({ initial }: { initial: IncidentRecord[] }) {
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initial);
  const [ackingId, setAckingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const pendingCount = incidents.filter((i) => !i.acknowledged_at).length;

  function ack(id: string) {
    setError(null);
    setAckingId(id);
    startTransition(async () => {
      const res = await acknowledgeIncident(id);
      setAckingId(null);
      if (res.error || !res.acknowledgedAt) {
        setError("Couldn't save your acknowledgement. Please try again.");
        return;
      }
      const at = res.acknowledgedAt;
      setIncidents((list) =>
        list.map((i) => (i.id === id ? { ...i, acknowledged_at: at } : i)),
      );
    });
  }

  return (
    <div className={cn(cardBase, "p-5 md:p-6")}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Incidents</h2>
        </div>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            {pendingCount} to acknowledge
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {incidents.map((i) => {
          const ackd = !!i.acknowledged_at;
          return (
            <div
              key={i.id}
              className={cn(
                "rounded-xl border p-4",
                ackd
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-amber-200 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/5",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {i.incident_type}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    severityCls[i.severity] ?? severityCls.Minor,
                  )}
                >
                  {i.severity}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  <LocalTime iso={i.occurred_at} />
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{i.description}</p>
              {i.action_taken ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    What we did:
                  </span>{" "}
                  {i.action_taken}
                </p>
              ) : null}

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Logged by {i.reporter_name || "daycare staff"}
                </p>
                {ackd ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="size-3.5" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => ack(i.id)}
                    disabled={ackingId === i.id}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {ackingId === i.id ? <Loader2 className="size-4 animate-spin" /> : null}
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
