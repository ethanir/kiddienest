import { AppShell } from "@/components/careloop/app-shell";
import { CheckInBoard } from "@/components/careloop/check-in-board";

export default function CheckInPage() {
  return (
    <AppShell
      role="Parent check-in"
      title="Tap a child to check in"
      description="Parents or staff can quickly find the child by face, confirm the pickup person, collect a signature, and save the attendance record."
    >
      <CheckInBoard />
    </AppShell>
  );
}
