import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  ClipboardList,
  MessageCircle,
  Milk,
  Moon,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const actions = [
  { label: "Meal", icon: Utensils, color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" },
  { label: "Bottle", icon: Milk, color: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400" },
  { label: "Nap", icon: Moon, color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { label: "Photo", icon: Camera, color: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400" },
  { label: "Note", icon: MessageCircle, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Incident", icon: AlertTriangle, color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
];

export default function StaffPage() {
  return (
    <AppShell
      role="Staff dashboard"
      title="Fast classroom updates"
      description="Teachers need large buttons, simple flows, and quick logging so updates do not slow down childcare."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardBase} p-6`}>
          <h2 className="text-xl font-semibold">Toddler Room</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            14 children checked in. Post updates in seconds.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <Link
                key={action.label}
                href="/app/daily-report"
                className="rounded-xl border border-slate-200 bg-white p-5 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${action.color}`}>
                  <action.icon className="size-6" />
                </div>
                Add {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className={`${cardBase} p-6`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Today&apos;s workflow</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This is the demo path we want parents and staff to understand.
                </p>
              </div>

              <Button asChild className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Link href="/app/daily-report">
                  <ClipboardList className="mr-2 size-4" />
                  Create update
                </Link>
              </Button>
            </div>

            <div className="mt-5 grid gap-3">
              <FlowStep number="1" title="Select child" text="Teacher picks the child or children receiving the update." />
              <FlowStep number="2" title="Choose update type" text="Meal, nap, photo, activity, note, or incident." />
              <FlowStep number="3" title="Post to parent timeline" text="Parent sees it in a clean daily feed." />
            </div>
          </div>

          <div className={`${cardBase} p-6`}>
            <h2 className="text-xl font-semibold">Children in room</h2>
            <div className="mt-4 space-y-3">
              {children.map((child) => (
                <div
                  key={child.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
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
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/app/daily-report">Update</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white dark:bg-slate-200 dark:text-slate-900">
          {number}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}
