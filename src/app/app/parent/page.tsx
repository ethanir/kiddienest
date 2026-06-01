import type { LucideIcon } from "lucide-react";
import { Baby, Bell, CalendarDays, Camera, CheckCircle2, FileSignature, MessageCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children, timeline } from "@/lib/demo-data";

const mia = children[0];

export default function ParentPage() {
  return (
    <AppShell
      role="Parent portal"
      title="Mia's day"
      description="A simple parent dashboard showing check-in status, daily updates, photos, messages, forms, and announcements."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-pink-100 via-sky-50 to-emerald-100 p-6">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-[2rem] text-5xl shadow-inner"
                  style={{ background: mia.avatarBg }}
                >
                  {mia.emoji}
                </div>
                <div>
                  <h2 className="text-3xl font-black">{mia.name}</h2>
                  <p className="font-bold text-slate-600">{mia.room} • Checked in</p>
                  <Badge className="mt-3 rounded-full bg-emerald-600 px-3 py-1 font-black">
                    Safe at daycare
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-3xl bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <CheckCircle2 className="size-7 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-black">Checked in safely</p>
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
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">Today’s timeline</h2>
              <Badge className="rounded-full bg-sky-100 text-sky-800 hover:bg-sky-100">
                Live updates
              </Badge>
            </div>

            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={item.title} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-50">
                        <Sparkles className="size-5 text-sky-700" />
                      </div>
                      <p className="font-black">{item.title}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-400">{item.time}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
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
    <button className="rounded-3xl bg-slate-100 p-5 text-center font-black transition hover:bg-sky-100">
      <Icon className="mx-auto mb-2 size-7 text-slate-700" />
      {label}
    </button>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <Icon className="mb-3 size-7 text-slate-600" />
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
