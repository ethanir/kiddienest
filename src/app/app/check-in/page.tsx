import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock, PenLine, Search, UserCheck, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

export default function CheckInPage() {
  return (
    <AppShell
      role="Parent check-in"
      title="Tap a child to check in"
      description="Parents or staff can quickly find the child by face, confirm the pickup person, collect a signature, and save the attendance record."
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Children</h2>
                <p className="text-sm text-slate-500">Big cards for fast check-in on a tablet or phone.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                <Search className="size-4" />
                Search coming soon
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {children.map((child) => (
                <div
                  key={child.name}
                  className="rounded-[2rem] border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] text-3xl shadow-inner"
                      style={{ background: child.avatarBg }}
                    >
                      {child.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-lg font-black">{child.name}</p>
                          <p className="text-sm font-medium text-slate-500">{child.room}</p>
                        </div>
                        <StatusBadge status={child.attendance} />
                      </div>

                      <p className="mt-3 text-sm text-slate-600">
                        Pickup: <span className="font-bold text-slate-900">{child.pickup}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button className="h-12 rounded-2xl bg-emerald-600 font-black hover:bg-emerald-700">
                      Check in
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl font-black">
                      Check out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] border-0 bg-slate-950 text-white shadow-xl shadow-slate-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Today’s status</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <MiniStatus label="In" value="2" tone="green" />
                <MiniStatus label="Waiting" value="1" tone="blue" />
                <MiniStatus label="Absent" value="1" tone="gray" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Safe check-in flow</h2>
              <div className="mt-5 space-y-3">
                <Step icon={UserCheck} title="Confirm parent or pickup person" />
                <Step icon={PenLine} title="Collect digital signature" />
                <Step icon={CheckCircle2} title="Save attendance record" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "checked-in") {
    return (
      <Badge className="rounded-full bg-emerald-100 px-3 py-1 font-black text-emerald-800 hover:bg-emerald-100">
        <CheckCircle2 className="mr-1 size-3" />
        In
      </Badge>
    );
  }

  if (status === "absent") {
    return (
      <Badge className="rounded-full bg-slate-100 px-3 py-1 font-black text-slate-700 hover:bg-slate-100">
        <XCircle className="mr-1 size-3" />
        Absent
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full bg-sky-100 px-3 py-1 font-black text-sky-800 hover:bg-sky-100">
      <Clock className="mr-1 size-3" />
      Waiting
    </Badge>
  );
}

function MiniStatus({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "gray" }) {
  const colors = {
    green: "bg-emerald-400 text-slate-950",
    blue: "bg-sky-300 text-slate-950",
    gray: "bg-white/10 text-white",
  };

  return (
    <div className={`rounded-3xl p-4 text-center ${colors[tone]}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-black">{label}</p>
    </div>
  );
}

function Step({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="size-6 text-slate-700" />
      </div>
      <p className="font-black">{title}</p>
    </div>
  );
}
