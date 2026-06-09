import { AppShell } from "@/components/careloop/app-shell";
import { StaffManager } from "@/components/careloop/staff-manager";
import { getStaff } from "@/app/app/staff/actions";
import { getRooms } from "@/app/app/rooms/actions";

export default async function StaffPage() {
  const [{ members, invites, viewerId, viewerRole }, rooms] = await Promise.all([
    getStaff(),
    getRooms(),
  ]);
  const isAdmin = viewerRole === "admin";

  return (
    <AppShell
      role={isAdmin ? "Admin" : "Staff"}
      title="Teachers & staff"
      description={
        isAdmin
          ? "Add teachers, set who's an admin, and manage your team."
          : "Everyone on your daycare's team."
      }
    >
      <StaffManager
        members={members}
        invites={invites}
        rooms={rooms}
        viewerId={viewerId}
        isAdmin={isAdmin}
      />
    </AppShell>
  );
}
