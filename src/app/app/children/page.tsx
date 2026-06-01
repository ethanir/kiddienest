import type { LucideIcon } from "lucide-react";
import { Baby, HeartPulse, Phone, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

export default function ChildrenPage() {
  return (
    <AppShell
      role="Child records"
      title="Child profiles"
      description="Private child profiles for parent contacts, emergency contacts, allergies, medical notes, classrooms, documents, and pickup permissions."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => (
          <Card key={child.name} className="rounded-[2rem] border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                  <Baby className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{child.name}</h2>
                  <p className="text-sm text-slate-500">{child.room}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Info icon={Phone} label="Pickup" value={child.pickup} />
                <Info icon={HeartPulse} label="Allergies" value={child.allergies} />
                <Info icon={ShieldCheck} label="Status" value={child.status} />
              </div>

              <Badge className="mt-5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
                {child.age}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <Icon className="size-5 text-slate-500" />
      <div>
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}
