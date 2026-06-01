import type { LucideIcon } from "lucide-react";
import { AlertTriangle, FileDown, PenLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { incidents } from "@/lib/demo-data";

export default function IncidentsPage() {
  return (
    <AppShell
      role="Incident reports"
      title="Accident and injury records"
      description="Create incident reports, add photos, collect staff and parent signatures, save to child profile, and export PDFs."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reports</h2>
              <Button className="rounded-full">New report</Button>
            </div>

            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.title} className="rounded-3xl border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 size-6 text-amber-700" />
                      <div>
                        <p className="font-bold">{incident.title}</p>
                        <p className="text-sm text-slate-500">{incident.child} • {incident.time}</p>
                      </div>
                    </div>
                    <Badge className="w-fit rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Report actions</h2>
            <div className="mt-4 space-y-3">
              <Action icon={PenLine} title="Collect parent signature" />
              <Action icon={PenLine} title="Collect staff signature" />
              <Action icon={FileDown} title="Export report as PDF" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Action({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
      <Icon className="size-6 text-slate-600" />
      <p className="font-bold">{title}</p>
    </div>
  );
}
