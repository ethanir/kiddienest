import type { LucideIcon } from "lucide-react";
import { CheckCircle2, PenLine, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

export default function CheckInPage() {
  return (
    <AppShell
      role="Parent check-in"
      title="Check-in and pickup"
      description="A simple parent-facing screen for checking children in and out with pickup person tracking and digital signature."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Choose child</h2>
            <div className="mt-4 space-y-3">
              {children.map((child) => (
                <div key={child.name} className="rounded-3xl border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold">{child.name}</p>
                      <p className="text-sm text-slate-500">{child.room} • Pickup: {child.pickup}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="rounded-full">Check in</Button>
                      <Button variant="outline" className="rounded-full">Check out</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Today’s flow</h2>
            <div className="mt-5 space-y-4">
              <Step icon={UserCheck} title="Confirm parent or pickup person" />
              <Step icon={PenLine} title="Collect digital signature" />
              <Step icon={CheckCircle2} title="Save attendance record" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Step({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
      <Icon className="size-6 text-slate-600" />
      <p className="font-bold">{title}</p>
    </div>
  );
}
