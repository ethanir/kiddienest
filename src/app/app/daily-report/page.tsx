import { Camera, ClipboardList, MessageCircle, Milk, Moon, Smile, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AppShell } from "@/components/careloop/app-shell";

const reportTypes = [
  { label: "Meal", icon: Utensils },
  { label: "Bottle", icon: Milk },
  { label: "Nap", icon: Moon },
  { label: "Mood", icon: Smile },
  { label: "Photo", icon: Camera },
  { label: "Note", icon: MessageCircle },
];

export default function DailyReportPage() {
  return (
    <AppShell
      role="Daily reports"
      title="Create daily update"
      description="Staff can quickly log meals, naps, bottles, diapers, potty, activities, mood, medication, health checks, and end-of-day notes."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Update type</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button key={type.label} className="rounded-3xl border p-5 text-left font-bold transition hover:bg-slate-50">
                  <type.icon className="mb-3 size-7 text-slate-600" />
                  {type.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="size-7 text-slate-600" />
              <h2 className="text-2xl font-bold">End-of-day summary</h2>
            </div>
            <Textarea className="mt-5 min-h-44 rounded-3xl" placeholder="Write a simple update parents can understand..." />
            <Button className="mt-4 w-full rounded-full">Send report to parent</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
