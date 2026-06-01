"use server";

import { getCurrentRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ChatMessage = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  sender_role: string;
  sender_name: string | null;
};

type MessageRow = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  sender_role: string;
};

export async function getMessages(
  childId: string,
): Promise<{ messages: ChatMessage[]; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, body, created_at, sender_id, sender_role")
    .eq("child_id", childId)
    .order("created_at", { ascending: true });

  if (error) return { messages: [], error: error.message };

  const rows = (data ?? []) as MessageRow[];
  const ids = Array.from(new Set(rows.map((m) => m.sender_id)));

  let nameById = new Map<string, string | null>();
  if (ids.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", ids);
    nameById = new Map(
      ((profs ?? []) as { id: string; full_name: string | null }[]).map((p) => [
        p.id,
        p.full_name,
      ]),
    );
  }

  return {
    messages: rows.map((m) => ({ ...m, sender_name: nameById.get(m.sender_id) ?? null })),
  };
}

export async function sendMessage(
  childId: string,
  body: string,
): Promise<{ message?: ChatMessage; error?: string }> {
  const text = body.trim();
  if (!text) return { error: "Type a message first." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You appear to be signed out." };

  const role = await getCurrentRole();
  const senderRole = role === "parent" ? "parent" : "staff";

  const { data, error } = await supabase
    .from("messages")
    .insert({ child_id: childId, sender_id: user.id, sender_role: senderRole, body: text })
    .select("id, body, created_at, sender_id, sender_role")
    .single();

  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "You can't send a message about this child."
        : error.message,
    };
  }

  const { data: prof } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    message: { ...(data as MessageRow), sender_name: prof?.full_name ?? null },
  };
}
