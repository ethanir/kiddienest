import { FileSignature } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/careloop/app-shell";
import { forms } from "@/lib/demo-data";
import { cardBase } from "@/lib/ui";

export default function FormsPage() {
  return (
    <AppShell
      role="Forms and documents"
      title="Digital forms"
      description="Enrollment forms, emergency contacts, medical forms, handbooks, permission slips, document uploads, and signatures."
    >
      <div className={`${cardBase} p-6`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Forms</h2>
          <Button className="rounded-full">Create form</Button>
        </div>

        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.name}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <FileSignature className="size-6 shrink-0 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="font-medium">{form.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Due: {form.due}</p>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit rounded-full">
                {form.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
