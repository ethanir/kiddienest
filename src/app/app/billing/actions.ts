"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// Starts a Stripe Checkout (subscription) for the signed-in user and redirects
// to Stripe. The webhook provisions their isolated daycare once payment succeeds.
export async function startCheckout() {
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
  redirect(session.url);
}
