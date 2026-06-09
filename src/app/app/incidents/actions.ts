"use server";

import { revalidatePath } from "next/cache";

import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type IncidentRecord = {
  id: string;
  child_id: string;
  child_name: string;
  child_emoji: string | null;
  child_bg: string | null;
  incident_type: string;
  severity: string;
  occurred_at: string;
  description: string;
  action_taken: string | null;
  acknowledged_at: string | null;
  reporter_name: string | null;
  created_at: string;
};

const TYPES = ["Injury", "Illness", "Behavior", "Other"];
const SEVERITIES = ["Minor", "Moderate", "Serious"];

const SELECT =
  "id, child_id, incident_type, severity, occurred_at, description, action_taken, acknowledged_at, reported_by, created_at";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

type IncidentRow = {
  id: string;
  child_id: string;
  incident_type: string;
  severity: string;
  occurred_at: string;
  description: string;
  action_taken: string | null;
  acknowledged_at: string | null;
  reported_by: string | null;
  created_at: string;
};

async function shapeIncidents(
  supabase: SupabaseServer,
  rows: IncidentRow[],
): Promise<IncidentRecord[]> {
  if (rows.length === 0) return [];

  const childIds = Array.from(new Set(rows.map((r) => r.child_id)));
  const reporterIds = Array.from(
    new Set(rows.map((r) => r.reported_by).filter((v): v is string => Boolean(v))),
  );

  // Both lookups are independent, so fire them in one parallel wave instead of
  // paying two sequential round trips on every incidents fetch.
  const [childRes, reporterRes] = await Promise.all([
    supabase.from("children").select("id, full_name, emoji, avatar_bg").in("id", childIds),
    reporterIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", reporterIds)
      : null,
  ]);

  const childById = new Map<string, { full_name: string; emoji: string | null; avatar_bg: string | null }>();
  for (const c of (childRes.data ?? []) as {
    id: string;
    full_name: string;
    emoji: string | null;
    avatar_bg: string | null;
  }[]) {
    childById.set(c.id, { full_name: c.full_name, emoji: c.emoji, avatar_bg: c.avatar_bg });
  }

  const nameById = new Map<string, string | null>();
  for (const p of (reporterRes?.data ?? []) as { id: string; full_name: string | null }[]) {
    nameById.set(p.id, p.full_name);
  }

  return rows.map((r) => {
    const child = childById.get(r.child_id);
    return {
      id: r.id,
      child_id: r.child_id,
      child_name: child?.full_name ?? "Child",
      child_emoji: child?.emoji ?? null,
      child_bg: child?.avatar_bg ?? null,
      incident_type: r.incident_type,
      severity: r.severity,
      occurred_at: r.occurred_at,
      description: r.description,
      action_taken: r.action_taken,
      acknowledged_at: r.acknowledged_at,
      reporter_name: r.reported_by ? nameById.get(r.reported_by) ?? null : null,
      created_at: r.created_at,
    };
  });
}

export async function getIncidents(): Promise<IncidentRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("incidents")
    .select(SELECT)
    .order("created_at", { ascending: false });
  return shapeIncidents(supabase, (data ?? []) as IncidentRow[]);
}

export async function getIncidentsForChild(childId: string): Promise<IncidentRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("incidents")
    .select(SELECT)
    .eq("child_id", childId)
    .order("created_at", { ascending: false });
  return shapeIncidents(supabase, (data ?? []) as IncidentRow[]);
}

export async function createIncident(input: {
  childId: string;
  incidentType: string;
  severity: string;
  description: string;
  actionTaken?: string;
  occurredAt?: string;
}): Promise<{ incident?: IncidentRecord; error?: string }> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return { error: "You appear to be signed out." };

  const role = await getCurrentRole();
  if (role !== "staff" && role !== "admin") {
    return { error: "Only staff can log incidents." };
  }

  if (!input.childId) return { error: "Please choose a child." };
  const description = input.description.trim();
  if (!description) return { error: "Please describe what happened." };

  const incidentType = TYPES.includes(input.incidentType) ? input.incidentType : "Other";
  const severity = SEVERITIES.includes(input.severity) ? input.severity : "Minor";
  const actionTaken = input.actionTaken?.trim() || null;

  const payload: Record<string, unknown> = {
    child_id: input.childId,
    reported_by: user.id,
    incident_type: incidentType,
    severity,
    description,
    action_taken: actionTaken,
  };
  if (input.occurredAt) payload.occurred_at = input.occurredAt;

  const { data, error } = await supabase
    .from("incidents")
    .insert(payload)
    .select(SELECT)
    .single();

  if (error) {
    return {
      error: error.message.toLowerCase().includes("row-level security")
        ? "Only staff can log incidents."
        : error.message,
    };
  }

  revalidatePath("/app/parent");
  const shaped = await shapeIncidents(supabase, [data as IncidentRow]);
  return { incident: shaped[0] };
}

export async function acknowledgeIncident(
  incidentId: string,
): Promise<{ acknowledgedAt?: string; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("acknowledge_incident", { p_incident: incidentId });
  if (error) return { error: error.message };

  const { data } = await supabase
    .from("incidents")
    .select("acknowledged_at")
    .eq("id", incidentId)
    .maybeSingle();

  return {
    acknowledgedAt: (data?.acknowledged_at as string | null) ?? new Date().toISOString(),
  };
}

export async function deleteIncident(
  incidentId: string,
): Promise<{ error?: string }> {
  const role = await getCurrentRole();
  if (role !== "staff" && role !== "admin") {
    return { error: "Only staff can delete incidents." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_incident", { p_incident: incidentId });
  if (error) {
    return {
      error: error.message.toLowerCase().includes("only staff")
        ? "Only staff can delete incidents."
        : error.message,
    };
  }

  revalidatePath("/app/parent");
  return {};
}

export async function clearAllIncidents(): Promise<{ deleted?: number; error?: string }> {
  const role = await getCurrentRole();
  if (role !== "staff" && role !== "admin") {
    return { error: "Only staff can clear incidents." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("clear_all_incidents");
  if (error) {
    return {
      error: error.message.toLowerCase().includes("only staff")
        ? "Only staff can clear incidents."
        : error.message,
    };
  }

  revalidatePath("/app/parent");
  return { deleted: typeof data === "number" ? data : undefined };
}
