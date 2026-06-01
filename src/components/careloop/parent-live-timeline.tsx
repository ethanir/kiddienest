"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardList,
  Moon,
  Sparkles,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { timeline } from "@/lib/demo-data";

const STORAGE_KEY = "careloop-demo-updates";

type DemoUpdate = {
  id: string;
  childName: string;
  time: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
};

const typeStyles: Record<string, string> = {
  Meal: "bg-orange-50 text-orange-700",
  Nap: "bg-indigo-50 text-indigo-700",
  Photo: "bg-pink-50 text-pink-700",
  Note: "bg-emerald-50 text-emerald-700",
  Incident: "bg-amber-50 text-amber-700",
  Activity: "bg-violet-50 text-violet-700",
  Attendance: "bg-emerald-50 text-emerald-700",
  Learning: "bg-violet-50 text-violet-700",
};

const typeIcons = {
  Meal: Utensils,
  Nap: Moon,
  Photo: Camera,
  Note: ClipboardList,
  Incident: AlertTriangle,
  Activity: Sparkles,
  Attendance: CheckCircle2,
  Learning: Sparkles,
};

export function ParentLiveTimeline({ childName }: { childName: string }) {
  const [demoUpdates, setDemoUpdates] = useState<DemoUpdate[]>([]);

  useEffect(() => {
    function loadUpdates() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as DemoUpdate[]) : [];
        setDemoUpdates(parsed.filter((update) => update.childName === childName));
      } catch {
        setDemoUpdates([]);
      }
    }

    loadUpdates();

    window.addEventListener("storage", loadUpdates);
    window.addEventListener("careloop-demo-updates-changed", loadUpdates);

    return () => {
      window.removeEventListener("storage", loadUpdates);
      window.removeEventListener("careloop-demo-updates-changed", loadUpdates);
    };
  }, [childName]);

  const combinedTimeline = useMemo(() => {
    return [
      ...demoUpdates.map((update) => ({
        ...update,
        isLiveDemo: true,
      })),
      ...timeline.map((item) => ({
        id: `${item.time}-${item.title}`,
        childName,
        createdAt: "",
        ...item,
        isLiveDemo: false,
      })),
    ];
  }, [childName, demoUpdates]);

  return (
    <div className="space-y-3">
      {combinedTimeline.map((item) => {
        const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? Sparkles;
        const colorClass = typeStyles[item.type] ?? "bg-sky-50 text-sky-700";

        return (
          <div key={item.id} className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}>
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-slate-950">{item.title}</p>
                    {item.isLiveDemo && (
                      <Badge className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        New demo update
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold text-slate-400">{item.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
