"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ChildRecord = {
  id: string;
  full_name: string;
  room: string | null;
  birthdate: string | null;
  allergies: string | null;
  emoji: string | null;
  avatar_bg: string | null;
  attendance_status: string;
};

export type ChildParent = {
  parent_id: string;
  full_name: string | null;
  email: string | null;
  relationship: string | null;
};

export type ChildInvite = {
  id: string;
  email: string;
  relationship: string | null;
  created_at: string;
};

type ChildInput = {
  full_name: string;
  room: string;
  birthdate: string | null;
  allergies: string;
  emoji: string;
  avatar_bg: string;
};

const SELECT =
  "id, full_name, room, birthdate, allergies, emoji, avatar_bg, attendance_status";

function staffError(error: { message: string; code?: string }): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("row-level security") || error.code === "PGRST116") {
    return "Only staff can manage children.";
  }
  return error.message;
}

export async function createChild(
  input: ChildInput,
): Promise<{ child?: ChildRecord; error?: string }> {
  const name = input.full_name.trim();
  if (!name) return { error: "Please enter the child's name." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .insert({
      full_name: name,
      room: input.room.trim() || null,
      birthdate: input.birthdate,
      allergies: input.allergies.trim() || "None",
      emoji: input.emoji,
      avatar_bg: input.avatar_bg,
    })
    .select(SELECT)
    .single();

  if (error) return { error: staffError(error) };

  revalidatePath("/app/admin");
  revalidatePath("/app/check-in");
  return { child: data as ChildRecord };
}

export async function updateChild(
  id: string,
  input: ChildInput,
): Promise<{ child?: ChildRecord; error?: string }> {
  const name = input.full_name.trim();
  if (!name) return { error: "Please enter the child's name." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .update({
      full_name: name,
      room: input.room.trim() || null,
      birthdate: input.birthdate,
      allergies: input.allergies.trim() || "None",
      emoji: input.emoji,
      avatar_bg: input.avatar_bg,
    })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) return { error: staffError(error) };

  revalidatePath("/app/admin");
  revalidatePath("/app/check-in");
  return { child: data as ChildRecord };
}

export async function getChildFamily(
  childId: string,
): Promise<{ parents: ChildParent[]; invites: ChildInvite[] }> {
  const supabase = await createClient();

  const { data: guardianRows } = await supabase
    .from("guardians")
    .select("parent_id, relationship")
    .eq("child_id", childId);

  const guardians = (guardianRows ?? []) as {
    parent_id: string;
    relationship: string | null;
  }[];

  let parents: ChildParent[] = [];
  if (guardians.length > 0) {
    const ids = guardians.map((g) => g.parent_id);
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", ids);

    const byId = new Map(
      ((profileRows ?? []) as { id: string; full_name: string | null; email: string | null }[]).map(
        (p) => [p.id, p],
      ),
    );

    parents = guardians.map((g) => {
      const p = byId.get(g.parent_id);
      return {
        parent_id: g.parent_id,
        full_name: p?.full_name ?? null,
        email: p?.email ?? null,
        relationship: g.relationship ?? null,
      };
    });
  }

  const { data: inviteRows } = await supabase
    .from("guardian_invites")
    .select("id, email, relationship, created_at")
    .eq("child_id", childId)
    .is("claimed_at", null)
    .order("created_at", { ascending: true });

  return { parents, invites: (inviteRows ?? []) as ChildInvite[] };
}

export async function inviteParent(
  childId: string,
  email: string,
): Promise<{ ok?: true; error?: string }> {
  const value = email.trim().toLowerCase();
  if (!value) return { error: "Enter the parent's email." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { error } = await supabase.from("guardian_invites").insert({
    child_id: childId,
    email: value,
    relationship: "Parent",
    invited_by: auth.user?.id ?? null,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (error.code === "23505" || msg.includes("duplicate")) {
      return { error: "That email has already been invited for this child." };
    }
    if (msg.includes("row-level security")) {
      return { error: "Only staff can invite parents." };
    }
    return { error: error.message };
  }
  return { ok: true };
}

export async function removeInvite(
  inviteId: string,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("guardian_invites").delete().eq("id", inviteId);
  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "Only staff can manage invites."
        : error.message,
    };
  }
  return { ok: true };
}

export async function unlinkParent(
  childId: string,
  parentId: string,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("guardians")
    .delete()
    .eq("child_id", childId)
    .eq("parent_id", parentId);
  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "Only staff can manage parents."
        : error.message,
    };
  }
  return { ok: true };
}
