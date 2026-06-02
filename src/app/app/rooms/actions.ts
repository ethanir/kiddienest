"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type RoomRecord = {
  id: string;
  name: string;
  color: string | null;
  capacity: number | null;
  max_per_staff: number | null;
  sort_order: number;
};

const SELECT = "id, name, color, capacity, max_per_staff, sort_order";

function staffError(error: { message: string; code?: string }): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("row-level security") || error.code === "PGRST116") {
    return "Only staff can manage rooms.";
  }
  return error.message;
}

function revalidateRoomScreens() {
  revalidatePath("/app/rooms");
  revalidatePath("/app/admin");
  revalidatePath("/app/check-in");
  revalidatePath("/app/daily-report");
  revalidatePath("/app/messages");
  revalidatePath("/app/children");
}

export async function getRooms(): Promise<RoomRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rooms")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as RoomRecord[];
}

// Rooms plus a count of children currently assigned to each.
export async function getRoomsWithCounts(): Promise<(RoomRecord & { child_count: number })[]> {
  const supabase = await createClient();
  const [{ data: roomRows }, { data: childRows }] = await Promise.all([
    supabase
      .from("rooms")
      .select(SELECT)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("children").select("room_id"),
  ]);

  const counts = new Map<string, number>();
  for (const c of (childRows ?? []) as { room_id: string | null }[]) {
    if (c.room_id) counts.set(c.room_id, (counts.get(c.room_id) ?? 0) + 1);
  }

  return ((roomRows ?? []) as RoomRecord[]).map((r) => ({
    ...r,
    child_count: counts.get(r.id) ?? 0,
  }));
}

export async function createRoom(
  name: string,
  capacity: number | null,
  maxPerStaff: number | null = null,
): Promise<{ room?: RoomRecord; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Enter a room name." };

  const supabase = await createClient();

  // Next sort_order = current max + 1 (within this daycare, scoped by RLS).
  const { data: maxRow } = await supabase
    .from("rooms")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("rooms")
    .insert({ name: trimmed, capacity, max_per_staff: maxPerStaff, sort_order: nextOrder })
    .select(SELECT)
    .single();

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("row-level security")) {
      return { error: "Only staff can create rooms." };
    }
    return { error: error.message };
  }

  revalidateRoomScreens();
  return { room: data as RoomRecord };
}

export async function updateRoom(
  id: string,
  input: { name: string; capacity: number | null; max_per_staff: number | null },
): Promise<{ room?: RoomRecord; error?: string }> {
  const trimmed = input.name.trim();
  if (!trimmed) return { error: "Enter a room name." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .update({ name: trimmed, capacity: input.capacity, max_per_staff: input.max_per_staff })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) return { error: staffError(error) };

  // Keep the denormalized children.room display name in sync.
  await supabase.from("children").update({ room: trimmed }).eq("room_id", id);

  revalidateRoomScreens();
  return { room: data as RoomRecord };
}

export async function deleteRoom(id: string): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();

  // Unassign children first (also clears their display name). The FK is ON
  // DELETE SET NULL, but we clear the text name explicitly too.
  await supabase.from("children").update({ room: null, room_id: null }).eq("room_id", id);

  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) return { error: staffError(error) };

  revalidateRoomScreens();
  return { ok: true };
}

// Assign (or clear) a child's room — sets both room_id and the denormalized name.
export async function assignChildRoom(
  childId: string,
  roomId: string | null,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();

  let roomName: string | null = null;
  if (roomId) {
    const { data: room } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", roomId)
      .maybeSingle();
    roomName = room?.name ?? null;
  }

  const { error } = await supabase
    .from("children")
    .update({ room_id: roomId, room: roomName })
    .eq("id", childId);

  if (error) return { error: staffError(error) };

  revalidateRoomScreens();
  return { ok: true };
}

// Assign (or clear) a staff member's room. Admin-only and same-daycare are
// enforced inside the assign_staff_room DB function.
export async function assignStaffRoom(
  userId: string,
  roomId: string | null,
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("assign_staff_room", {
    p_user: userId,
    p_room: roomId,
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("only admins")) return { error: "Only admins can assign rooms." };
    if (msg.includes("not in your daycare")) return { error: "That person isn't in your daycare." };
    if (msg.includes("room is not")) return { error: "That room isn't in your daycare." };
    return { error: error.message };
  }
  revalidatePath("/app/staff");
  revalidatePath("/app/admin");
  return { ok: true };
}
