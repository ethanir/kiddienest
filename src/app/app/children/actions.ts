"use server";

import { revalidatePath } from "next/cache";

import { getCurrentRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ChildRecord = {
  id: string;
  full_name: string;
  room: string | null;
  room_id: string | null;
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
  room_id: string | null;
  birthdate: string | null;
  allergies: string;
  emoji: string;
  avatar_bg: string;
};

const SELECT =
  "id, full_name, room, room_id, birthdate, allergies, emoji, avatar_bg, attendance_status";

function staffError(error: { message: string; code?: string }): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("row-level security") || error.code === "PGRST116") {
    return "Only staff can manage children.";
  }
  return error.message;
}

async function roomName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  roomId: string | null,
): Promise<string | null> {
  if (!roomId) return null;
  const { data } = await supabase.from("rooms").select("name").eq("id", roomId).maybeSingle();
  return data?.name ?? null;
}

export async function createChild(
  input: ChildInput,
): Promise<{ child?: ChildRecord; error?: string }> {
  const name = input.full_name.trim();
  if (!name) return { error: "Please enter the child's name." };

  const supabase = await createClient();
  const rName = await roomName(supabase, input.room_id);
  const { data, error } = await supabase
    .from("children")
    .insert({
      full_name: name,
      room_id: input.room_id,
      room: rName,
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
  const rName = await roomName(supabase, input.room_id);
  const { data, error } = await supabase
    .from("children")
    .update({
      full_name: name,
      room_id: input.room_id,
      room: rName,
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

// ---------------------------------------------------------------------------
// Bulk CSV import (children).
//
// Inserts go through the SAME authenticated server client and the SAME columns
// as createChild, so they ride the existing RLS policies + the daycare_id
// auto-fill trigger that already passed the security audit — no new security
// surface, no schema assumptions. Rooms are matched by name (case-insensitive);
// optionally, room names in the file that don't exist yet are created first.
// ---------------------------------------------------------------------------

export type ImportChildInput = {
  full_name: string;
  room_name: string | null;
  birthdate: string | null; // ISO (YYYY-MM-DD) or null
  allergies: string | null;
  emoji: string;
  avatar_bg: string;
};

export type ImportResult = {
  children?: ChildRecord[];
  roomsCreated?: number;
  error?: string;
};

const IMPORT_CHUNK = 100;
const MAX_IMPORT_ROWS = 1000;

export async function importChildren(
  rows: ImportChildInput[],
  opts: { autoCreateRooms?: boolean } = {},
): Promise<ImportResult> {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { error: "There are no valid rows to import." };
  }
  if (rows.length > MAX_IMPORT_ROWS) {
    return {
      error: `That's a lot of rows at once (max ${MAX_IMPORT_ROWS}). Split the file and import in batches.`,
    };
  }

  const supabase = await createClient();

  // Staff/admin only. (RLS would also block this, but fail clearly up front.)
  const role = await getCurrentRole();
  if (role !== "staff" && role !== "admin") {
    return { error: "Only staff can import children." };
  }

  // Existing rooms for this daycare (RLS-scoped), matched case-insensitively.
  const { data: roomRows, error: roomErr } = await supabase
    .from("rooms")
    .select("id, name, sort_order");
  if (roomErr) return { error: staffError(roomErr) };

  const rooms = (roomRows ?? []) as { id: string; name: string; sort_order: number }[];
  const idByName = new Map<string, string>();
  const nameById = new Map<string, string>();
  for (const r of rooms) {
    idByName.set(r.name.trim().toLowerCase(), r.id);
    nameById.set(r.id, r.name);
  }

  // Optionally create any room names in the file that don't exist yet.
  let roomsCreated = 0;
  if (opts.autoCreateRooms) {
    const wanted = new Map<string, string>(); // lowercased key -> original casing
    for (const row of rows) {
      const n = row.room_name?.trim();
      if (n && !idByName.has(n.toLowerCase())) wanted.set(n.toLowerCase(), n);
    }
    if (wanted.size > 0) {
      let nextOrder =
        rooms.reduce((max, r) => Math.max(max, r.sort_order ?? 0), 0) + 1;
      const toInsert = [...wanted.values()].map((name) => ({
        name,
        capacity: null,
        max_per_staff: null,
        sort_order: nextOrder++,
      }));
      const { data: created, error: createErr } = await supabase
        .from("rooms")
        .insert(toInsert)
        .select("id, name");
      if (createErr) return { error: staffError(createErr) };
      for (const r of (created ?? []) as { id: string; name: string }[]) {
        idByName.set(r.name.trim().toLowerCase(), r.id);
        nameById.set(r.id, r.name);
      }
      roomsCreated = created?.length ?? 0;
    }
  }

  // Build child rows using exactly the columns createChild writes.
  const childRows = rows
    .filter((r) => r.full_name && r.full_name.trim())
    .map((r) => {
      const key = r.room_name?.trim().toLowerCase();
      const roomId = key ? idByName.get(key) ?? null : null;
      return {
        full_name: r.full_name.trim(),
        room_id: roomId,
        room: roomId ? nameById.get(roomId) ?? null : null,
        birthdate: r.birthdate,
        allergies: r.allergies?.trim() || "None",
        emoji: r.emoji,
        avatar_bg: r.avatar_bg,
      };
    });

  if (childRows.length === 0) {
    return { error: "There are no valid rows to import." };
  }

  // Insert in chunks; collect created rows so the UI can append them.
  const createdChildren: ChildRecord[] = [];
  for (let i = 0; i < childRows.length; i += IMPORT_CHUNK) {
    const slice = childRows.slice(i, i + IMPORT_CHUNK);
    const { data, error } = await supabase.from("children").insert(slice).select(SELECT);
    if (error) {
      const done = createdChildren.length;
      return {
        children: createdChildren,
        roomsCreated,
        error:
          done > 0
            ? `${staffError(error)} (Imported the first ${done} before this error.)`
            : staffError(error),
      };
    }
    createdChildren.push(...((data ?? []) as ChildRecord[]));
  }

  revalidatePath("/app/admin");
  revalidatePath("/app/check-in");
  revalidatePath("/app/children");
  return { children: createdChildren, roomsCreated };
}
