import type { NextRequest } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe's SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

function idOf(x: unknown): string | null {
  if (!x) return null;
  if (typeof x === "string") return x;
  if (typeof x === "object" && x !== null && "id" in x) {
    return String((x as { id: string }).id);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  // Raw body is REQUIRED for signature verification — do not parse as JSON first.
  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response("Signature verification failed", { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: Stripe may deliver an event more than once. Record the id
  // first; a unique-violation (Postgres 23505) means we've already handled it.
  // Any OTHER insert failure (connection blip, pool exhaustion) must NOT be
  // acknowledged — returning 500 makes Stripe retry, so a transient database
  // error can never silently drop a billing event.
  const { error: dupErr } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (dupErr) {
    if (dupErr.code === "23505") {
      return new Response("ok (duplicate)", { status: 200 });
    }
    return new Response("could not record event", { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.client_reference_id ?? session.metadata?.userId ?? null;
        if (userId) {
          const subId = idOf(session.subscription);
          const customerId = idOf(session.customer);
          let status = "active";
          if (subId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            status = sub.status;
          }
          await admin.rpc("provision_daycare_for_user", {
            p_user: userId,
            p_name: session.metadata?.daycareName ?? null,
            p_customer: customerId,
            p_subscription: subId,
            p_status: status,
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await admin.rpc("set_subscription_status", {
          p_subscription: sub.id,
          p_status: sub.status,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin.rpc("set_subscription_status", {
          p_subscription: sub.id,
          p_status: "canceled",
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = idOf(
          (invoice as unknown as { subscription?: unknown }).subscription,
        );
        if (subId) {
          await admin.rpc("set_subscription_status", {
            p_subscription: subId,
            p_status: "past_due",
          });
        }
        break;
      }
      default:
        break;
    }
  } catch {
    // Processing failed — drop the idempotency record so Stripe's retry reprocesses.
    await admin.from("stripe_events").delete().eq("id", event.id);
    return new Response("processing error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
