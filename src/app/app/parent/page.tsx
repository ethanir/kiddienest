import type { LucideIcon } from "lucide-react";
import { Baby, Bell, CalendarDays, Camera, CheckCircle2, FileSignature, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { timeline } from "@/lib/demo-data";

export default function ParentPage() {
  return (
    <AppShell
      role="Parent portal"
      title="Mia's day"
      description="A simple parent dashboard showing check-in status, daily updates, photos, messages, forms, and announcements."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-pink-100 text-pink-700">
                <Baby className="size-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Mia Johnson</h2>
                <p className="text-slate-500">Toddler Room • Checked in</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-7 text-emerald-700" />
                <div>
                  <p className="font-bold">Checked in safely</p>
                  <p className="text-sm text-slate-600">8:12 AM by Ana Johnson</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <QuickTile icon={MessageCircle} label="Message" />
              <QuickTile icon={Camera} label="Photos" />
              <QuickTile icon={CalendarDays} label="Calendar" />
              <QuickTile icon={FileSignature} label="Forms" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Today’s timeline</h2>
              <Badge className="rounded-full bg-sky-100 text-sky-800 hover:bg-sky-100">
                Live updates
              </Badge>
            </div>

            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={item.title} className="rounded-3xl border bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.time}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 rounded-[2rem] border-0 shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <InfoCard icon={Bell} title="Announcements" text="Field trip reminder and weekly newsletter." />
          <InfoCard icon={FileSignature} title="Forms" text="Medical / allergy form needs review." />
          <InfoCard icon={Camera} title="Photos" text="3 private photos shared today." />
        </CardContent>
      </Card>
    </AppShell>
  );
}

function QuickTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="rounded-3xl bg-slate-100 p-5 text-center font-bold transition hover:bg-slate-200">
      <Icon className="mx-auto mb-2 size-6 text-slate-700" />
      {label}
    </button>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <Icon className="mb-3 size-6 text-slate-600" />
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
