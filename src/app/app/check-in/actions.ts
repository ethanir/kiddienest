"use server";

import { createClient } from "@/lib/supabase/server";

export type AttendanceStatus =
  | "not_arrived"
  | "checked_in"
  | "absent"
  | "checked_out";

export async function setAttendance(
  childId: string,
  status: AttendanceStatus,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const patch: Record<string, unknown> = { attendance_status: status };
  if (status === "checked_in") {
    patch.checked_in_at = new Date().toISOString();
    patch.checked_out_at = null;
  } else if (status === "checked_out") {
    patch.checked_out_at = new Date().toISOString();
  } else {
    patch.checked_in_at = null;
    patch.checked_out_at = null;
  }

  const { data, error } = await supabase
    .from("children")
    .update(patch)
    .eq("id", childId)
    .select("id");

  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "Only staff can change check-in status."
        : error.message,
    };
  }
  if (!data || data.length === 0) {
    return { error: "Only staff can change check-in status." };
  }
  return null;
}

export async function resetAllAttendance(): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("children")
    .update({
      attendance_status: "not_arrived",
      checked_in_at: null,
      checked_out_at: null,
    })
    .neq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");

  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "Only staff can reset check-in."
        : error.message,
    };
  }
  if (!data || data.length === 0) {
    return { error: "Only staff can reset check-in." };
  }
  return null;
}
