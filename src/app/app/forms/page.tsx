import { FileSignature } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/careloop/app-shell";
import { forms } from "@/lib/demo-data";

export default function FormsPage() {
  return (
    <AppShell
      role="Forms and documents"
      title="Digital forms"
      description="Enrollment forms, emergency contacts, medical forms, handbooks, permission slips, document uploads, and signatures."
    >
      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Forms</h2>
            <Button className="rounded-full">Create form</Button>
          </div>

          <div className="space-y-3">
            {forms.map((form) => (
              <div key={form.name} className="flex flex-col gap-3 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <FileSignature className="size-6 text-slate-600" />
                  <div>
                    <p className="font-bold">{form.name}</p>
                    <p className="text-sm text-slate-500">Due: {form.due}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit rounded-full">
                  {form.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
