"use client";

import { useActionState, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Baby,
  Camera,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Moon,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createUpdate, type PostState } from "@/app/app/daily-report/actions";

type Child = {
  id: string;
  full_name: string;
  room: string;
  emoji: string;
  avatar_bg: string;
};

type ReportType = {
  label: string;
  title: string;
  defaultNote: string;
  icon: LucideIcon;
  color: string;
};

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const reportTypes: ReportType[] = [
  { label: "Meal", title: "Meal update", defaultNote: "Ate most of lunch and drank water.", icon: Utensils, color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" },
  { label: "Nap", title: "Nap update", defaultNote: "Started nap time and settled down calmly.", icon: Moon, color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { label: "Photo", title: "Photo shared", defaultNote: "A new classroom photo was shared with the family.", icon: Camera, color: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400" },
  { label: "Note", title: "Teacher note", defaultNote: "Had a great day and participated well in activities.", icon: ClipboardList, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Activity", title: "Activity update", defaultNote: "Practiced sharing, cleanup, colors, and group play.", icon: Sparkles, color: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" },
  { label: "Incident", title: "Incident note", defaultNote: "Minor incident recorded. Parent signature may be needed.", icon: AlertTriangle, color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
];

export function DailyReportBuilder({ childProfiles }: { childProfiles: Child[] }) {
  const [selectedChildId, setSelectedChildId] = useState(childProfiles[0]?.id ?? "");
  const [selectedTypeLabel, setSelectedTypeLabel] = useState(reportTypes[0].label);
  const [note, setNote] = useState(reportTypes[0].defaultNote);
  const [state, formAction, pending] = useActionState<PostState, FormData>(
    createUpdate,
    null,
  );

  const selectedChild = useMemo(
    () => childProfiles.find((c) => c.id === selectedChildId) ?? childProfiles[0],
    [childProfiles, selectedChildId],
  );

  const selectedType = useMemo(
    () => reportTypes.find((t) => t.label === selectedTypeLabel) ?? reportTypes[0],
    [selectedTypeLabel],
  );

  function chooseType(type: ReportType) {
    setSelectedTypeLabel(type.label);
    setNote(type.defaultNote);
  }

  if (childProfiles.length === 0) {
    return (
      <div className={`${cardBase} p-8 text-center`}>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Baby className="size-6 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold">No children yet</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Add a child profile first, then you can post daily updates here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className={`${cardBase} p-5 md:p-6`}>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Create parent update</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pick a child, choose an update type, write a note, and post.
          </p>
        </div>

        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          1. Select child
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {childProfiles.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChildId(child.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                selectedChildId === child.id
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: child.avatar_bg }}
                >
                  {child.emoji}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{child.full_name}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {child.room || "—"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mb-3 mt-6 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          2. Select update type
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {reportTypes.map((type) => {
            const active = selectedTypeLabel === type.label;
            return (
              <button
                key={type.label}
                type="button"
                onClick={() => chooseType(type)}
                className={cn(
                  "rounded-xl border p-4 text-left text-sm font-medium transition-colors",
                  active
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex size-11 items-center justify-center rounded-xl",
                    active
                      ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900"
                      : type.color,
                  )}
                >
                  <type.icon className="size-6" />
                </div>
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${cardBase} p-5 md:p-6`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Parent preview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This is what the parent will see on their timeline.
            </p>
          </div>
          <Badge className="shrink-0 rounded-full border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Live
          </Badge>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="flex size-16 items-center justify-center rounded-xl text-3xl"
              style={{ background: selectedChild?.avatar_bg }}
            >
              {selectedChild?.emoji}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {selectedChild?.full_name}
              </p>
              <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                {selectedChild?.room || "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  selectedType.color,
                )}
              >
                <selectedType.icon className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{selectedType.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {note.trim() || selectedType.defaultNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form action={formAction}>
          <input type="hidden" name="childId" value={selectedChild?.id ?? ""} />
          <input type="hidden" name="type" value={selectedType.label} />
          <input type="hidden" name="title" value={selectedType.title} />

          <p className="mb-3 mt-5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            3. Write note
          </p>
          <Textarea
            name="body"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-36 rounded-xl text-base"
            placeholder="Write a short parent-friendly update..."
          />

          {state?.error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {state.error}
            </p>
          ) : null}
          {state?.success ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              {state.success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <Send className="size-5" />
                Post update
              </>
            )}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-start gap-3">
            <Baby className="mt-0.5 size-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              After posting, open the parent dashboard to see the update at the top
              of that child&apos;s timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
