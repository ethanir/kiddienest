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
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
  }

  // Route straight to the right dashboard (no intermediate redirect hop).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = "/app/parent";
  if (user) {
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
