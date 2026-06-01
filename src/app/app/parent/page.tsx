import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  FileSignature,
  MessageCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/careloop/app-shell";
import { ParentLiveTimeline } from "@/components/careloop/parent-live-timeline";
import { children } from "@/lib/demo-data";

const mia = children[0];

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default function ParentPage() {
  return (
    <AppShell
      role="Parent portal"
      title="Mia's day"
      description="A simple parent dashboard showing check-in status, daily updates, photos, messages, forms, and announcements."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardBase} p-6`}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
              style={{ background: mia.avatarBg }}
            >
              {mia.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{mia.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mia.room} • Checked in
              </p>
              <Badge className="mt-2 rounded-full border-transparent bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Safe at daycare
              </Badge>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <div className="flex size-11 items-center justify-center rounded-lg bg-white dark:bg-slate-900">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium">Checked in safely</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">8:12 AM by Ana Johnson</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <QuickTile icon={MessageCircle} label="Message" />
            <QuickTile icon={Camera} label="Photos" />
            <QuickTile icon={CalendarDays} label="Calendar" />
            <QuickTile icon={FileSignature} label="Forms" />
          </div>
        </div>

        <div className={`${cardBase} p-6`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Today&apos;s timeline</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Staff updates appear here in real time for the parent demo.
              </p>
            </div>
            <Badge className="shrink-0 rounded-full border-transparent bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
              Live updates
            </Badge>
          </div>

          <ParentLiveTimeline childName="Mia Johnson" />
        </div>
      </div>

      <div className={`${cardBase} mt-5 p-6`}>
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={Bell} title="Announcements" text="Field trip reminder and weekly newsletter." />
          <InfoCard icon={FileSignature} title="Forms" text="Medical / allergy form needs review." />
          <InfoCard icon={Camera} title="Photos" text="3 private photos shared today." />
        </div>
      </div>
    </AppShell>
  );
}

function QuickTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="rounded-xl border border-slate-200 bg-white p-5 text-center text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
      <Icon className="mx-auto mb-2 size-6 text-slate-600 dark:text-slate-300" />
      {label}
    </button>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
      <Icon className="mb-3 size-6 text-slate-600 dark:text-slate-300" />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
