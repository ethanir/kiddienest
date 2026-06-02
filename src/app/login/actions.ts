"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const mode = String(formData.get("mode") ?? "signin");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  // "parent" (free) or "owner" (daycare → paid). Only meaningful on signup.
  const accountType = String(formData.get("accountType") ?? "parent");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();

  if (mode === "signup") {
    const fullName = String(formData.get("fullName") ?? "").trim();
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        message: "Account created. Check your email to confirm, then sign in.",
      };
    }

    // If an admin invited this email as staff, that takes priority.
    await supabase.rpc("claim_staff_invite");

    // Unlock code (optional power-user path): provisions an admin account.
    if (code) {
      await supabase.rpc("redeem_admin_code", { p_code: code });
    }

    // Re-read role after any invite/code claim.
    const { data: claimed } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    // Brand-new daycare owner (not already staff/admin via invite/code):
    // create their pending daycare and send them to checkout.
    if (
      accountType === "owner" &&
      claimed?.role !== "admin" &&
      claimed?.role !== "staff"
    ) {
      const { error: ownerErr } = await supabase.rpc("start_owner_signup", {
        p_name: fullName,
      });
      if (!ownerErr) redirect("/app/billing");
    }

    // Owners who already had access (code/invite) → admin area; parents → portal.
    if (claimed?.role === "admin" || claimed?.role === "staff") {
      redirect("/app/admin");
    }
    redirect("/app/parent");
  }

  // ---- sign in ----
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = "/app/parent";
  if (user) {
    await supabase.rpc("claim_staff_invite");
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "staff" || profile?.role === "admin") {
      destination = "/app/admin";
    }
  }
  redirect(destination);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
