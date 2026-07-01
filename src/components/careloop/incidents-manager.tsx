"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Clock, Loader2, Plus, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocalTime } from "@/components/careloop/local-time";
import { SelectField } from "@/components/careloop/select-field";
import { useRealtime } from "@/lib/use-realtime";
import { cn } from "@/lib/utils";
import {
  clearAllIncidents,
  createIncident,
  deleteIncident,
  getIncidents,
  type IncidentRecord,
} from "@/app/app/incidents/actions";
import { cardBase, inputCls } from "@/lib/ui";
import { INCIDENT_SEVERITIES, INCIDENT_TYPES, severityCls } from "@/lib/incident-meta";
import { Field } from "@/components/careloop/field";

type ChildLite = {
  id: string;
  full_name: string;
  emoji: string | null;
  avatar_bg: string | null;
  room: string | null;
};

const textareaCls =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

function nowLocal() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

type FormState = {
  childId: string;
  incidentType: string;
  severity: string;
  occurredAt: string;
  description: string;
  actionTaken: string;
};

function makeEmpty(childList: ChildLite[]): FormState {
  return {
    childId: childList[0]?.id ?? "",
    incidentType: "Injury",
    severity: "Minor",
    occurredAt: nowLocal(),
    description: "",
    actionTaken: "",
  };
}

export function IncidentsManager({
  initialIncidents,
  childList,
}: {
  initialIncidents: IncidentRecord[];
  childList: ChildLite[];
}) {
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialIncidents);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => makeEmpty(childList));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Header counts — one pass instead of filtering the list four times per render.
  const { pendingCount, acknowledgedCount } = useMemo(() => {
    let p = 0;
    for (const i of incidents) if (!i.acknowledged_at) p++;
    return { pendingCount: p, acknowledgedCount: incidents.length - p };
  }, [incidents]);

  // Delete confirmation — either a single incident or "clear all".
  const [confirm, setConfirm] = useState<{ type: "one"; incident: IncidentRecord } | { type: "all" } | null>(null);
  const [removing, startRemoval] = useTransition();

  // Live: new incidents and parent acknowledgements show up on their own.
  useRealtime([{ table: "incidents" }], () => {
    getIncidents().then(setIncidents);
  });

  function openAdd() {
    setForm(makeEmpty(childList));
    setError(null);
    setOpen(true);
  }

  function save() {
    if (!form.childId) {
      setError("Please choose a child.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please describe what happened.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createIncident({
        childId: form.childId,
        incidentType: form.incidentType,
        severity: form.severity,
        description: form.description,
        actionTaken: form.actionTaken,
        occurredAt: form.occurredAt ? new Date(form.occurredAt).toISOString() : undefined,
      });
      if (res.error || !res.incident) {
        setError(res.error ?? "Something went wrong. Please try again.");
        return;
      }
      setIncidents((list) => [res.incident as IncidentRecord, ...list]);
      setOpen(false);
    });
  }

  function askDelete(incident: IncidentRecord) {
    setError(null);
    setConfirm({ type: "one", incident });
  }

  function askClearAll() {
    setError(null);
    setConfirm({ type: "all" });
  }

  function confirmDelete() {
    if (!confirm) return;
    const target = confirm;
    startRemoval(async () => {
      if (target.type === "one") {
        const res = await deleteIncident(target.incident.id);
        if (res.error) {
          setError(res.error);
          return;
        }
        setIncidents((list) => list.filter((x) => x.id !== target.incident.id));
      } else {
        const res = await clearAllIncidents();
        if (res.error) {
          setError(res.error);
          return;
        }
        setIncidents([]);
      }
      setConfirm(null);
    });
  }

  return (
    <>
      <div className="lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col lg:overflow-hidden">
      <div className="mb-5 flex items-center justify-between gap-3 lg:shrink-0">
        {incidents.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No incidents logged</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {incidents.length} logged
            </span>
            {pendingCount > 0 ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                {pendingCount} pending
              </span>
            ) : null}
            {acknowledgedCount > 0 ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {acknowledgedCount} acknowledged
              </span>
            ) : null}
          </div>
        )}
        <div className="flex shrink-0 items-center gap-2">
          {incidents.length > 0 ? (
            <button
              type="button"
              onClick={askClearAll}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="size-4" />
              Clear all
            </button>
          ) : null}
          {childList.length > 0 ? (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <Plus className="size-4" />
              Log incident
            </button>
          ) : null}
        </div>
      </div>

      {childList.length === 0 ? (
        <div className={cn(cardBase, "px-6 py-12 text-center")}>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <ShieldAlert className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No children yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Add children first — then you can log incidents and notify their families here.
          </p>
        </div>
      ) : incidents.length === 0 ? (
        <div className={cn(cardBase, "px-6 py-12 text-center")}>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
            <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">All clear</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            No incidents logged. When something happens, log it here and the parent will be
            notified to acknowledge it.
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {incidents.map((i) => (
            <article key={i.id} className={cn(cardBase, "animate-in fade-in-0 slide-in-from-bottom-1 p-5 duration-300")}>
              <div className="flex items-start gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: i.child_bg ?? "#e2e8f0" }}
                >
                  {i.child_emoji ?? "🙂"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{i.child_name}</p>
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
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    <LocalTime iso={i.occurred_at} />
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {i.acknowledged_at ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Check className="size-3" />
                      Acknowledged
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      <Clock className="size-3" />
                      Awaiting parent
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => askDelete(i)}
                    aria-label={`Delete ${i.child_name}'s incident`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{i.description}</p>
              {i.action_taken ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Action taken:
                  </span>{" "}
                  {i.action_taken}
                </p>
              ) : null}
              {i.reporter_name ? (
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Logged by {i.reporter_name}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!pending) setOpen(o);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Log an incident</DialogTitle>
            <DialogDescription>
              Record what happened. The parent will see this and can acknowledge it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <Field label="Child">
              <SelectField
                ariaLabel="Child"
                value={form.childId}
                onValueChange={(v) => setForm((f) => ({ ...f, childId: v }))}
                options={childList.map((c) => ({ value: c.id, label: c.full_name }))}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type">
                <SelectField
                  ariaLabel="Incident type"
                  value={form.incidentType}
                  onValueChange={(v) => setForm((f) => ({ ...f, incidentType: v }))}
                  options={INCIDENT_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </Field>
              <Field label="Severity">
                <SelectField
                  ariaLabel="Severity"
                  value={form.severity}
                  onValueChange={(v) => setForm((f) => ({ ...f, severity: v }))}
                  options={INCIDENT_SEVERITIES.map((s) => ({ value: s, label: s }))}
                />
              </Field>
            </div>

            <Field label="When did it happen?">
              <input
                type="datetime-local"
                value={form.occurredAt}
                onChange={(e) => setForm((f) => ({ ...f, occurredAt: e.target.value }))}
                className={cn(inputCls, "[color-scheme:light] dark:[color-scheme:dark]")}
              />
            </Field>

            <Field label="What happened?">
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Describe the incident clearly and factually."
                className={textareaCls}
                autoFocus
              />
            </Field>

            <Field label="Action taken (optional)">
              <textarea
                value={form.actionTaken}
                onChange={(e) => setForm((f) => ({ ...f, actionTaken: e.target.value }))}
                rows={2}
                placeholder="e.g. Cleaned and bandaged the scrape, applied ice, comforted."
                className={textareaCls}
              />
            </Field>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Log incident
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirm !== null}
        onOpenChange={(o) => {
          if (!o && !removing) setConfirm(null);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {confirm?.type === "all" ? "Clear all incidents?" : "Delete this incident?"}
            </DialogTitle>
            <DialogDescription>
              {confirm && confirm.type === "all"
                ? `This permanently deletes all ${incidents.length} ${
                    incidents.length === 1 ? "incident" : "incidents"
                  } for every child. Families will no longer see them, and this can't be undone.`
                : confirm && confirm.type === "one"
                  ? `This permanently deletes ${confirm.incident.child_name}'s ${confirm.incident.incident_type.toLowerCase()} incident. Their family will no longer see it, and this can't be undone.`
                  : ""}
            </DialogDescription>
          </DialogHeader>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              disabled={removing}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={removing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70"
            >
              {removing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              {confirm?.type === "all" ? "Delete all" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

