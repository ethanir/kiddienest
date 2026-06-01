"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PostState = { error?: string; success?: string } | null;

export async function createUpdate(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const childId = String(formData.get("childId") ?? "");
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!childId) return { error: "Select a child first." };
  if (!type || !title) return { error: "Select an update type." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please sign in again." };

  const { error } = await supabase.from("daily_updates").insert({
    child_id: childId,
    author_id: user.id,
    type,
    title,
    body: body || title,
  });

  if (error) {
    if (error.message.toLowerCase().includes("row-level security")) {
      return { error: "Only staff accounts can post updates." };
    }
    return { error: error.message };
  }

  revalidatePath("/app/parent");
  return { success: "Posted to the parent timeline." };
}
