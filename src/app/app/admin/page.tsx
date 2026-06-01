import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Baby, ClipboardList, MessageCircle, Search, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/careloop/app-shell";
import { children, incidents, messages } from "@/lib/demo-data";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

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
        <div className={`${cardBase} p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Children</h2>
            <Badge variant="secondary" className="gap-1 rounded-full">
              <Search className="size-3" />
              Search ready
            </Badge>
          </div>
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.name}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-14 items-center justify-center rounded-xl text-2xl"
                    style={{ background: child.avatarBg }}
                  >
                    {child.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{child.room} • {child.age}</p>
                      </div>
                      <StatusBadge status={child.attendance} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{child.lastUpdate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className={`${cardBase} p-6`}>
            <h2 className="text-xl font-semibold">Needs attention</h2>
            <div className="mt-4 space-y-3">
              {incidents.map((incident) => (
                <div key={incident.title} className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium">{incident.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{incident.child} • {incident.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-6`}>
            <h2 className="text-xl font-semibold">Messages</h2>
            <div className="mt-4 space-y-3">
              {messages.slice(0, 2).map((message) => (
                <div key={message.from} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="font-medium">{message.from}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{message.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "checked-in") {
    return (
      <Badge className="w-fit rounded-full border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        Checked in
      </Badge>
    );
  }

  if (status === "absent") {
    return (
      <Badge className="w-fit rounded-full border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Absent
      </Badge>
    );
  }

  return (
    <Badge className="w-fit rounded-full border-transparent bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
      Waiting
    </Badge>
  );
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
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <div className={`${cardBase} p-5`}>
      <div className={`mb-4 flex size-11 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="size-6" />
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  );
}
