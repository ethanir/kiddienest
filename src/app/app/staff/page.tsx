import { AlertTriangle, Camera, MessageCircle, Milk, Moon, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

const actions = [
  { label: "Meal", icon: Utensils, color: "bg-orange-100 text-orange-800" },
  { label: "Bottle", icon: Milk, color: "bg-sky-100 text-sky-800" },
  { label: "Nap", icon: Moon, color: "bg-indigo-100 text-indigo-800" },
  { label: "Photo", icon: Camera, color: "bg-pink-100 text-pink-800" },
  { label: "Note", icon: MessageCircle, color: "bg-emerald-100 text-emerald-800" },
  { label: "Incident", icon: AlertTriangle, color: "bg-amber-100 text-amber-800" },
];

export default function StaffPage() {
  return (
    <AppShell
      role="Staff dashboard"
      title="Fast classroom updates"
      description="Teachers need large buttons, simple flows, and quick logging so updates do not slow down childcare."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6">
            <h2 className="text-2xl font-black">Toddler Room</h2>
            <p className="mt-1 font-medium text-slate-600">14 children checked in</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button key={action.label} className="rounded-3xl border bg-white p-5 text-left font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${action.color}`}>
                    <action.icon className="size-7" />
                  </div>
                  Add {action.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6">
            <h2 className="text-2xl font-black">Select children</h2>
            <p className="mt-1 text-sm text-slate-500">Pick one child or select multiple children for a group update.</p>
            <div className="mt-4 space-y-3">
              {children.map((child) => (
                <div key={child.name} className="flex items-center justify-between rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-14 items-center justify-center rounded-2xl text-2xl"
                      style={{ background: child.avatarBg }}
                    >
                      {child.emoji}
                    </div>
                    <div>
                      <p className="font-black">{child.name}</p>
                      <p className="text-sm text-slate-500">{child.room}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full font-bold">Select</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
