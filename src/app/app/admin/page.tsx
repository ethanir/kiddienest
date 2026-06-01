import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Baby, ClipboardList, MessageCircle, Search, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { children, incidents, messages } from "@/lib/demo-data";

export default function AdminPage() {
  return (
    <AppShell
      role="Admin dashboard"
      title="Daycare command center"
      description="A clear overview for the owner: attendance, unread messages, child records, incidents, classrooms, and reports."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Checked in" value="42" icon={Baby} tone="emerald" />
        <Stat title="Absent" value="6" icon={UsersRound} tone="slate" />
        <Stat title="Unread messages" value="9" icon={MessageCircle} tone="sky" />
        <Stat title="Reports pending" value="5" icon={ClipboardList} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">Children</h2>
              <Badge variant="secondary" className="rounded-full">
                <Search className="mr-1 size-3" />
                Search ready
              </Badge>
            </div>
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.name} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex size-16 items-center justify-center rounded-3xl text-3xl"
                      style={{ background: child.avatarBg }}
                    >
                      {child.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-black">{child.name}</p>
                          <p className="text-sm font-medium text-slate-500">{child.room} • {child.age}</p>
                        </div>
                        <StatusBadge status={child.attendance} />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{child.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Needs attention</h2>
              <div className="mt-4 space-y-3">
                {incidents.map((incident) => (
                  <div key={incident.title} className="rounded-3xl bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 size-5 text-amber-700" />
                      <div>
                        <p className="font-black">{incident.title}</p>
                        <p className="text-sm text-slate-600">{incident.child} • {incident.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Messages</h2>
              <div className="mt-4 space-y-3">
                {messages.slice(0, 2).map((message) => (
                  <div key={message.from} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-black">{message.from}</p>
                    <p className="text-sm text-slate-600">{message.preview}</p>
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

function StatusBadge({ status }: { status: string }) {
  if (status === "checked-in") {
    return <Badge className="w-fit rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Checked in</Badge>;
  }

  if (status === "absent") {
    return <Badge className="w-fit rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">Absent</Badge>;
  }

  return <Badge className="w-fit rounded-full bg-sky-100 text-sky-800 hover:bg-sky-100">Waiting</Badge>;
}

function Stat({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  tone: "emerald" | "slate" | "sky" | "amber";
}) {
  const colors = {
    emerald: "from-emerald-100 to-white text-emerald-700",
    slate: "from-slate-100 to-white text-slate-700",
    sky: "from-sky-100 to-white text-sky-700",
    amber: "from-amber-100 to-white text-amber-700",
  };

  return (
    <Card className="rounded-[2rem] border-0 bg-white shadow-xl shadow-slate-200/60">
      <CardContent className={`rounded-[2rem] bg-gradient-to-br p-5 ${colors[tone]}`}>
        <Icon className="mb-4 size-7" />
        <p className="text-4xl font-black text-slate-950">{value}</p>
        <p className="text-sm font-bold text-slate-500">{title}</p>
      </CardContent>
    </Card>
  );
}
