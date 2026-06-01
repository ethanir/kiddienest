import type { LucideIcon } from "lucide-react";
import { HeartPulse, Phone, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/careloop/app-shell";
import { children } from "@/lib/demo-data";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default function ChildrenPage() {
  return (
    <AppShell
      role="Child records"
      title="Child profiles"
      description="Private child profiles for parent contacts, emergency contacts, allergies, medical notes, classrooms, documents, and pickup permissions."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => (
          <div key={child.name} className={`${cardBase} p-6`}>
            <div className="flex items-center gap-4">
              <div
                className="flex size-14 items-center justify-center rounded-xl text-2xl"
                style={{ background: child.avatarBg }}
              >
                {child.emoji}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{child.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{child.room}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Info icon={Phone} label="Pickup" value={child.pickup} />
              <Info icon={HeartPulse} label="Allergies" value={child.allergies} />
              <Info icon={ShieldCheck} label="Status" value={child.status} />
            </div>

            <Badge className="mt-5 rounded-full border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {child.age}
            </Badge>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      <Icon className="size-5 shrink-0 text-slate-500 dark:text-slate-400" />
      <div>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
