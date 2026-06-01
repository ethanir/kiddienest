import { AlertTriangle, Camera, MessageCircle, Milk, Moon, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

const actions = [
  { label: "Meal", icon: Utensils },
  { label: "Bottle", icon: Milk },
  { label: "Nap", icon: Moon },
  { label: "Photo", icon: Camera },
  { label: "Note", icon: MessageCircle },
  { label: "Incident", icon: AlertTriangle },
];

export default function StaffPage() {
  return (
    <AppShell
      role="Staff dashboard"
      title="Fast classroom updates"
      description="Teachers need large buttons, simple flows, and quick logging so updates do not slow down childcare."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Toddler Room</h2>
            <p className="mt-1 text-slate-600">14 children checked in</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button key={action.label} className="rounded-3xl border bg-white p-5 text-left font-bold shadow-sm transition hover:bg-slate-50">
                  <action.icon className="mb-3 size-7 text-slate-600" />
                  Add {action.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Select children</h2>
            <div className="mt-4 space-y-3">
              {children.map((child) => (
                <div key={child.name} className="flex items-center justify-between rounded-3xl border p-4">
                  <div>
                    <p className="font-bold">{child.name}</p>
                    <p className="text-sm text-slate-500">{child.room}</p>
                  </div>
                  <Button variant="outline" className="rounded-full">Select</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
