"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { UPDATE_TITLE_BY_LABEL } from "@/lib/update-types";

export type PostState = { error?: string; success?: string } | null;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export async function createUpdate(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const childId = String(formData.get("childId") ?? "");
  const type = String(formData.get("type") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const photo = formData.get("photo");

  if (!childId) return { error: "Select a child first." };
  // The title is derived server-side from the canonical type list. That both
  // validates the type (unknown values are rejected, so the database only ever
  // holds known update types) and stops a tampered form from writing an
  // arbitrary headline onto the parent timeline.
  const title = UPDATE_TITLE_BY_LABEL[type];
  if (!title) return { error: "Select an update type." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please sign in again." };

  // Resolve the child's daycare so the storage path encodes ownership:
  // <daycare_id>/<child_id>/<uuid>.<ext> — matched by the bucket's RLS policies.
  let photoPath: string | null = null;
  const hasPhoto = photo instanceof File && photo.size > 0;

  if (hasPhoto) {
    const file = photo as File;
    if (!ALLOWED.has(file.type)) {
      return { error: "Photos must be JPG, PNG, WEBP, or HEIC." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "That photo is too large (max 8 MB)." };
    }

    const { data: childRow, error: childErr } = await supabase
      .from("children")
      .select("daycare_id")
      .eq("id", childId)
      .maybeSingle();

    if (childErr || !childRow?.daycare_id) {
      return { error: "Couldn't find that child's daycare. Try again." };
    }

    const ext = EXT[file.type] ?? "jpg";
    const rand = crypto.randomUUID();
    const path = `${childRow.daycare_id}/${childId}/${rand}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("child-photos")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (upErr) {
      const m = upErr.message.toLowerCase();
      if (m.includes("row-level security") || m.includes("policy") || m.includes("unauthorized")) {
        return { error: "Only staff can upload photos for this daycare." };
      }
      return { error: `Photo upload failed: ${upErr.message}` };
    }
    photoPath = path;
  }

  const { error } = await supabase.from("daily_updates").insert({
    child_id: childId,
    author_id: user.id,
    type,
    title,
    body: body || title,
    photo_path: photoPath,
  });

  if (error) {
    // If the row insert fails after a successful upload, clean up the orphan file.
    if (photoPath) {
      await supabase.storage.from("child-photos").remove([photoPath]);
    }
    if (error.message.toLowerCase().includes("row-level security")) {
      return { error: "Only staff accounts can post updates." };
    }
    return { error: error.message };
  }

  revalidatePath("/app/parent");
  return {
    success: hasPhoto ? "Photo posted to the parent timeline." : "Posted to the parent timeline.",
  };
}
