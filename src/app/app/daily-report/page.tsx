import { AppShell } from "@/components/careloop/app-shell";
import { DailyReportBuilder } from "@/components/careloop/daily-report-builder";

export default function DailyReportPage() {
  return (
    <AppShell
      role="Daily reports"
      title="Create daily update"
      description="Staff can quickly post meals, naps, photos, activities, notes, incidents, and end-of-day summaries to a parent-friendly timeline."
    >
      <DailyReportBuilder />
    </AppShell>
  );
}
