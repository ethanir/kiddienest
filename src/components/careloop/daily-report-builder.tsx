"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Baby,
  Camera,
  CheckCircle2,
  ClipboardList,
  Moon,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { children } from "@/lib/demo-data";

const STORAGE_KEY = "careloop-demo-updates";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

type ReportType = {
  label: string;
  title: string;
  defaultNote: string;
  icon: LucideIcon;
  color: string;
};

const reportTypes: ReportType[] = [
  { label: "Meal", title: "Meal update", defaultNote: "Ate most of lunch and drank water.", icon: Utensils, color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" },
  { label: "Nap", title: "Nap update", defaultNote: "Started nap time and settled down calmly.", icon: Moon, color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { label: "Photo", title: "Photo shared", defaultNote: "A new classroom photo was shared with the family.", icon: Camera, color: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400" },
  { label: "Note", title: "Teacher note", defaultNote: "Had a great day and participated well in activities.", icon: ClipboardList, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Activity", title: "Activity update", defaultNote: "Practiced sharing, cleanup, colors, and group play.", icon: Sparkles, color: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" },
  { label: "Incident", title: "Incident note", defaultNote: "Minor incident recorded. Parent signature may be needed.", icon: AlertTriangle, color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
];

type DemoUpdate = {
  id: string;
  childName: string;
  time: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
};

export function DailyReportBuilder() {
  const [selectedChildName, setSelectedChildName] = useState(children[0]?.name ?? "");
  const [selectedTypeLabel, setSelectedTypeLabel] = useState(reportTypes[0].label);
  const [note, setNote] = useState(reportTypes[0].defaultNote);
  const [savedMessage, setSavedMessage] = useState("");

  const selectedChild = useMemo(() => {
    return children.find((child) => child.name === selectedChildName) ?? children[0];
  }, [selectedChildName]);

  const selectedType = useMemo(() => {
    return reportTypes.find((type) => type.label === selectedTypeLabel) ?? reportTypes[0];
  }, [selectedTypeLabel]);

  function chooseType(type: ReportType) {
    setSelectedTypeLabel(type.label);
    setNote(type.defaultNote);
    setSavedMessage("");
  }

  function postDemoUpdate() {
    const cleanNote = note.trim() || selectedType.defaultNote;

    const update: DemoUpdate = {
      id: `${Date.now()}-${selectedChild.name}-${selectedType.label}`,
      childName: selectedChild.name,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      title: selectedType.title,
      description: cleanNote,
      type: selectedType.label,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const current = raw ? (JSON.parse(raw) as DemoUpdate[]) : [];
      const next = [update, ...current].slice(0, 30);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("careloop-demo-updates-changed"));

      setSavedMessage(`Posted ${selectedType.label.toLowerCase()} update for ${selectedChild.name}.`);
    } catch {
      setSavedMessage("Could not save demo update in this browser.");
    }
  }

  function clearDemoUpdates() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("careloop-demo-updates-changed"));
    setSavedMessage("Demo updates cleared.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className={`${cardBase} p-5 md:p-6`}>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Create parent update</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This is the main staff workflow: pick child, choose update type, write note, post.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            1. Select child
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {children.map((child) => (
              <button
                key={child.name}
                type="button"
                onClick={() => {
                  setSelectedChildName(child.name);
                  setSavedMessage("");
                }}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  selectedChildName === child.name
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: child.avatarBg }}
                  >
                    {child.emoji}
                  </div>
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{child.room}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
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
                      active ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900" : type.color,
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
      </div>

      <div className={`${cardBase} p-5 md:p-6`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Parent preview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This is what the parent timeline update will look like.
            </p>
          </div>

          <Badge className="shrink-0 rounded-full border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Demo only
          </Badge>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="flex size-16 items-center justify-center rounded-xl text-3xl"
              style={{ background: selectedChild.avatarBg }}
            >
              {selectedChild.emoji}
            </div>

            <div>
              <p className="text-lg font-semibold">{selectedChild.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{selectedChild.room}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", selectedType.color)}>
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

        <p className="mb-3 mt-5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          3. Write note
        </p>

        <Textarea
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setSavedMessage("");
          }}
          className="min-h-36 rounded-xl text-base"
          placeholder="Write a short parent-friendly update..."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button
            type="button"
            onClick={postDemoUpdate}
            className="h-12 rounded-xl bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700"
          >
            <Send className="mr-2 size-5" />
            Post demo update
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={clearDemoUpdates}
            className="h-12 rounded-xl text-base font-medium"
          >
            Clear demo
          </Button>
        </div>

        {savedMessage && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 className="size-5 shrink-0" />
            <p className="font-medium">{savedMessage}</p>
          </div>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-start gap-3">
            <Baby className="mt-0.5 size-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              After posting, open <span className="font-medium text-slate-900 dark:text-slate-100">/app/parent</span>.
              The new update appears above the normal sample timeline for the selected child.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
