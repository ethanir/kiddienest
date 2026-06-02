import { AppShell } from "@/components/careloop/app-shell";
import { RoomsManager } from "@/components/careloop/rooms-manager";
import { getRoomsWithCounts } from "@/app/app/rooms/actions";
import { getCurrentRole } from "@/lib/auth";

export default async function RoomsPage() {
  const [rooms, role] = await Promise.all([getRoomsWithCounts(), getCurrentRole()]);
  const isAdmin = role === "admin";

  return (
    <AppShell
      role={isAdmin ? "Admin" : "Staff"}
      title="Rooms"
      description="Organize your center into rooms, then assign children to them. Staff screens can filter by room — essential once you have a lot of kids."
    >
      <RoomsManager initialRooms={rooms} isAdmin={isAdmin} />
    </AppShell>
  );
}
