"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// Opens the Stripe-hosted billing portal so the daycare owner can update their
// card, view invoices, or cancel. The daycare row is read under RLS (so it's
// only ever the caller's own), and only the owner of that daycare — the person
// who actually pays — may manage billing.
export async function openBillingPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: daycare } = await supabase
    .from("daycares")
    .select("owner_id, stripe_customer_id")
    .maybeSingle();

  // Only the owner manages billing, and only once Stripe has a customer on file.
  if (!daycare || daycare.owner_id !== user.id || !daycare.stripe_customer_id) {
    redirect("/app/admin");
  }

  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://kiddienestapp.com";

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: daycare.stripe_customer_id,
    return_url: `${origin}/app/admin`,
  });

  if (!session.url) throw new Error("Could not open the billing portal");
  redirect(session.url);
}
