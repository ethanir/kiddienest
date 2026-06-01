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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { children } from "@/lib/demo-data";

const STORAGE_KEY = "careloop-demo-updates";

type ReportType = {
  label: string;
  title: string;
  defaultNote: string;
  icon: LucideIcon;
  color: string;
};

const reportTypes: ReportType[] = [
  {
    label: "Meal",
    title: "Meal update",
    defaultNote: "Ate most of lunch and drank water.",
    icon: Utensils,
    color: "bg-orange-100 text-orange-800",
  },
  {
    label: "Nap",
    title: "Nap update",
    defaultNote: "Started nap time and settled down calmly.",
    icon: Moon,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    label: "Photo",
    title: "Photo shared",
    defaultNote: "A new classroom photo was shared with the family.",
    icon: Camera,
    color: "bg-pink-100 text-pink-800",
  },
  {
    label: "Note",
    title: "Teacher note",
    defaultNote: "Had a great day and participated well in activities.",
    icon: ClipboardList,
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Activity",
    title: "Activity update",
    defaultNote: "Practiced sharing, cleanup, colors, and group play.",
    icon: Sparkles,
    color: "bg-violet-100 text-violet-800",
  },
  {
    label: "Incident",
    title: "Incident note",
    defaultNote: "Minor incident recorded. Parent signature may be needed.",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-800",
  },
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
      <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
        <CardContent className="p-5 md:p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black">Create parent update</h2>
            <p className="careloop-muted mt-1 text-sm text-slate-500">
              This is the main staff workflow: pick child, choose update type, write note, post.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">
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
                  className={`rounded-3xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedChildName === child.name
                      ? "border-sky-400 bg-sky-50 ring-4 ring-sky-100"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-14 items-center justify-center rounded-2xl text-2xl"
                      style={{ background: child.avatarBg }}
                    >
                      {child.emoji}
                    </div>
                    <div>
                      <p className="font-black text-slate-950">{child.name}</p>
                      <p className="text-sm font-medium text-slate-500">{child.room}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">
              2. Select update type
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {reportTypes.map((type) => (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => chooseType(type)}
                  className={`rounded-3xl border p-4 text-left font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedTypeLabel === type.label
                      ? "border-slate-950 bg-slate-950 text-white ring-4 ring-slate-200"
                      : "bg-white text-slate-950"
                  }`}
                >
                  <div className={`mb-3 flex size-11 items-center justify-center rounded-2xl ${selectedTypeLabel === type.label ? "bg-white/10 text-white" : type.color}`}>
                    <type.icon className="size-6" />
                  </div>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
        <CardContent className="p-5 md:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Parent preview</h2>
              <p className="careloop-muted mt-1 text-sm text-slate-500">
                This is what the parent timeline update will look like.
              </p>
            </div>

            <Badge className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Demo only
            </Badge>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-sky-50 to-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex size-16 items-center justify-center rounded-3xl text-3xl shadow-inner"
                style={{ background: selectedChild.avatarBg }}
              >
                {selectedChild.emoji}
              </div>

              <div>
                <p className="text-xl font-black">{selectedChild.name}</p>
                <p className="font-medium text-slate-600">{selectedChild.room}</p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${selectedType.color}`}>
                  <selectedType.icon className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-black">{selectedType.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {note.trim() || selectedType.defaultNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mb-3 mt-5 text-sm font-black uppercase tracking-wide text-slate-400">
            3. Write note
          </p>

          <Textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setSavedMessage("");
            }}
            className="min-h-36 rounded-3xl bg-white text-base"
            placeholder="Write a short parent-friendly update..."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button
              type="button"
              onClick={postDemoUpdate}
              className="h-13 rounded-2xl bg-emerald-600 text-base font-black hover:bg-emerald-700"
            >
              <Send className="mr-2 size-5" />
              Post demo update
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={clearDemoUpdates}
              className="h-13 rounded-2xl bg-white text-base font-black"
            >
              Clear demo
            </Button>
          </div>

          {savedMessage && (
            <div className="mt-4 flex items-center gap-3 rounded-3xl bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="size-5" />
              <p className="font-black">{savedMessage}</p>
            </div>
          )}

          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Baby className="mt-0.5 size-5 text-slate-500" />
              <p className="text-sm leading-6 text-slate-600">
                After posting, open <span className="font-black text-slate-950">/app/parent</span>.
                The new update appears above the normal sample timeline for the selected child.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
