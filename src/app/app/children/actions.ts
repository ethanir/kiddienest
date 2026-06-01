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
