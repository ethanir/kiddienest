import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardList,
  Moon,
  Sparkles,
  Utensils,
} from "lucide-react";

import { LocalTime } from "@/components/careloop/local-time";

export type TimelineUpdate = {
  id: string;
  type: string;
  title: string;
  body: string;
  created_at: string;
  photo_url?: string | null;
};

const typeStyles: Record<string, string> = {
  Meal: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  Nap: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  Photo: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  Note: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Activity: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  Incident: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Attendance: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const typeIcons: Record<string, LucideIcon> = {
  Meal: Utensils,
  Nap: Moon,
  Photo: Camera,
  Note: ClipboardList,
  Activity: Sparkles,
  Incident: AlertTriangle,
  Attendance: CheckCircle2,
};

export function ParentTimeline({ updates }: { updates: TimelineUpdate[] }) {
  if (updates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No updates yet today. New updates from the classroom will appear here as
          they happen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((item) => {
        const Icon = typeIcons[item.type] ?? Sparkles;
        const colorClass =
          typeStyles[item.type] ??
          "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400";

        return (
          <div
            key={item.id}
            className="animate-in fade-in-0 slide-in-from-bottom-1 rounded-2xl border border-slate-200 bg-white p-4 duration-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.body}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-medium text-slate-400 dark:text-slate-500">
                <LocalTime iso={item.created_at} />
              </p>
            </div>

            {item.photo_url ? (
              <a
                href={item.photo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photo_url}
                  alt={item.title}
                  loading="lazy"
                  className="max-h-80 w-full bg-slate-100 object-cover dark:bg-slate-800"
                />
              </a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
