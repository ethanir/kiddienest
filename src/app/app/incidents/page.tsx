import type { LucideIcon } from "lucide-react";
import { AlertTriangle, FileDown, PenLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/careloop/app-shell";
import { incidents } from "@/lib/demo-data";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default function IncidentsPage() {
  return (
    <AppShell
      role="Incident reports"
      title="Accident and injury records"
      description="Create incident reports, add photos, collect staff and parent signatures, save to child profile, and export PDFs."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className={`${cardBase} p-6`}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reports</h2>
            <Button className="rounded-full">New report</Button>
          </div>

          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.title}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium">{incident.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{incident.child} • {incident.time}</p>
                    </div>
                  </div>
                  <Badge className="w-fit rounded-full border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBase} p-6`}>
          <h2 className="text-xl font-semibold">Report actions</h2>
          <div className="mt-4 space-y-3">
            <Action icon={PenLine} title="Collect parent signature" />
            <Action icon={PenLine} title="Collect staff signature" />
            <Action icon={FileDown} title="Export report as PDF" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Action({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <Icon className="size-6 shrink-0 text-slate-500 dark:text-slate-400" />
      <p className="font-medium">{title}</p>
    </div>
  );
}
