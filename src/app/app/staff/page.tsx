import Link from "next/link";
import { AlertTriangle, Camera, ClipboardList, MessageCircle, Milk, Moon, Utensils } from "lucide-react";

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
        <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6">
            <h2 className="text-2xl font-black">Toddler Room</h2>
            <p className="careloop-muted mt-1 font-medium text-slate-600">
              14 children checked in. Post updates in seconds.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href="/app/daily-report"
                  className="rounded-3xl border bg-white p-5 text-left font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${action.color}`}>
                    <action.icon className="size-7" />
                  </div>
                  Add {action.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Today’s workflow</h2>
                  <p className="careloop-muted mt-1 text-sm text-slate-500">
                    This is the demo path we want parents and staff to understand.
                  </p>
                </div>

                <Button asChild className="h-12 rounded-full bg-emerald-600 px-5 font-black hover:bg-emerald-700">
                  <Link href="/app/daily-report">
                    <ClipboardList className="mr-2 size-5" />
                    Create update
                  </Link>
                </Button>
              </div>

              <div className="mt-5 grid gap-3">
                <FlowStep number="1" title="Select child" text="Teacher picks the child or children receiving the update." />
                <FlowStep number="2" title="Choose update type" text="Meal, nap, photo, activity, note, or incident." />
                <FlowStep number="3" title="Post to parent timeline" text="Parent sees it in a clean daily feed." />
              </div>
            </CardContent>
          </Card>

          <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Children in room</h2>
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
                    <Button asChild variant="outline" className="rounded-full font-bold">
                      <Link href="/app/daily-report">Update</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
    <div className="rounded-3xl bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
          {number}
        </div>
        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}
