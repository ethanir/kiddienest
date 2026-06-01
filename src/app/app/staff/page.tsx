import { AppShell } from "@/components/careloop/app-shell";
import { StaffManager } from "@/components/careloop/staff-manager";
import { getStaff } from "@/app/app/staff/actions";

export default async function StaffPage() {
  const { members, invites, viewerId, viewerRole } = await getStaff();
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
        viewerId={viewerId}
        isAdmin={isAdmin}
      />
    </AppShell>
  );
}
