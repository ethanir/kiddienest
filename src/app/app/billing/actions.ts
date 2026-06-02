"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// Builds a Stripe Checkout subscription session for the signed-in user and
// returns its URL. The daycare is provisioned ONLY by the Stripe webhook after
// payment succeeds — never before — so abandoning checkout leaves no ghost data.
async function createCheckoutUrl(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error("STRIPE_PRICE_ID is not set");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const hdrs = await headers();
  const origin =
    hdrs.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://kiddienestapp.com";

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    metadata: {
      userId: user.id,
      daycareName: profile?.full_name ? `${profile.full_name}'s Daycare` : "",
    },
    subscription_data: { metadata: { userId: user.id } },
    allow_promotion_codes: true,
    success_url: `${origin}/app/billing?status=success`,
    cancel_url: `${origin}/app/billing?status=cancel`,
  });

  if (!session.url) throw new Error("Could not start checkout");
  return session.url;
}

// Form-action wrapper for the billing page button.
export async function startCheckout() {
  const url = await createCheckoutUrl();
  redirect(url);
}

// Reusable variant for the signup flow (returns the URL to redirect to).
export async function createCheckoutSession(): Promise<string> {
  return createCheckoutUrl();
}
