import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "staff" | "parent" | null;

// The signed-in user's identity, taken from their JWT after verification via
// getClaims() — never the spoofable getSession(). With asymmetric signing keys
// active, verification happens locally against the project's cached public
// keys (JWKS): no auth-server round trip. Before the keys are rotated it
// transparently falls back to server-side verification, identical to the old
// getUser() call. Identity comes from the verified token; authorization stays
// live in RLS and the SECURITY DEFINER RPCs, so a revoked user's leftover
// token still can't touch a row. Wrapped in React cache() so a page, its
// layout, and any helpers it calls (e.g. getCurrentRole) share ONE
// verification per server request instead of each paying their own.
//
// Deliberate exceptions that keep auth-server getUser(): the login flow,
// checkout.ts, and billing.ts — rare, once-per-flow paths where a fresh
// server-confirmed user record is worth the round trip.
export type CurrentUser = { id: string; email: string | null };

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: claims.email ?? null };
});

// Reads the signed-in user's role from their profile. Returns null if not
// signed in or no profile row yet. Wrapped in React cache() so multiple callers
// within the same server request (e.g. the layout and a page) only do the work
// once.
export const getCurrentRole = cache(async (): Promise<AppRole> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = data?.role;
  return role === "admin" || role === "staff" || role === "parent" ? role : null;
});
