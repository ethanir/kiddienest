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
        <Stat title="Checked in" value="42" icon={Baby} />
        <Stat title="Absent" value="6" icon={UsersRound} />
        <Stat title="Unread messages" value="9" icon={MessageCircle} />
        <Stat title="Reports pending" value="5" icon={ClipboardList} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Children</h2>
              <Badge variant="secondary" className="rounded-full">
                <Search className="mr-1 size-3" />
                Search ready
              </Badge>
            </div>
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.name} className="rounded-3xl border p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-bold">{child.name}</p>
                      <p className="text-sm text-slate-500">{child.room} • {child.age}</p>
                    </div>
                    <Badge className={child.status === "Checked in" ? "rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                      {child.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{child.lastUpdate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">Needs attention</h2>
              <div className="mt-4 space-y-3">
                {incidents.map((incident) => (
                  <div key={incident.title} className="rounded-3xl bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 size-5 text-amber-700" />
                      <div>
                        <p className="font-bold">{incident.title}</p>
                        <p className="text-sm text-slate-600">{incident.child} • {incident.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">Messages</h2>
              <div className="mt-4 space-y-3">
                {messages.slice(0, 2).map((message) => (
                  <div key={message.from} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-bold">{message.from}</p>
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

function Stat({ title, value, icon: Icon }: { title: string; value: string; icon: LucideIcon }) {
  return (
    <Card className="rounded-[2rem] border-0 shadow-sm">
      <CardContent className="p-5">
        <Icon className="mb-4 size-6 text-slate-500" />
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
      </CardContent>
    </Card>
  );
}
