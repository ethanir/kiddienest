"use server";

import { revalidatePath } from "next/cache";

import { getCurrentRole, getCurrentUser, type AppRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type StaffMember = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  room_id: string | null;
};

export type StaffInvite = {
  email: string;
  role: string;
  created_at: string;
};

export async function getStaff(): Promise<{
  members: StaffMember[];
  invites: StaffInvite[];
  viewerId: string | null;
  viewerRole: AppRole;
}> {
  const supabase = await createClient();

  // One parallel wave: the user and role share a single cached auth call
  // (getCurrentRole reads through getCurrentUser), and the two table reads no
  // longer wait on each other.
  const [user, viewerRole, { data: memberRows }, { data: inviteRows }] =
    await Promise.all([
      getCurrentUser(),
      getCurrentRole(),
      supabase
        .from("profiles")
        .select("id, full_name, email, role, room_id")
        .in("role", ["staff", "admin"])
        .order("full_name"),
      supabase
        .from("staff_invites")
        .select("email, role, created_at")
        .is("claimed_at", null)
        .order("created_at", { ascending: false }),
    ]);

  return {
    members: (memberRows ?? []) as StaffMember[],
    invites: (inviteRows ?? []) as StaffInvite[],
    viewerId: user?.id ?? null,
    viewerRole,
  };
}

export async function inviteStaff(
  email: string,
  role: string,
): Promise<{ status?: string; error?: string }> {
  const e = email.trim();
  if (!e || !e.includes("@")) return { error: "Enter a valid email address." };
  const r = role === "admin" ? "admin" : "staff";

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("invite_staff", { p_email: e, p_role: r });
  if (error) {
    return {
      error: error.message.toLowerCase().includes("only admins")
        ? "Only admins can manage staff."
        : error.message,
    };
  }
  revalidatePath("/app/staff");
  return { status: (data as string) ?? "invited" };
}

export async function revokeStaff(userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_staff", { p_user: userId });
  if (error) {
    const msg = error.message.toLowerCase();
    return {
      error: msg.includes("only admins")
        ? "Only admins can manage staff."
        : msg.includes("your own")
          ? "You can't remove your own access."
          : error.message,
    };
  }
  revalidatePath("/app/staff");
  return {};
}

export async function cancelInvite(email: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_staff_invite", { p_email: email });
  if (error) {
    return {
      error: error.message.toLowerCase().includes("only admins")
        ? "Only admins can manage staff."
        : error.message,
    };
  }
  revalidatePath("/app/staff");
  return {};
}
