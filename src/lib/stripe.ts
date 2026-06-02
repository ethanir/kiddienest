import Stripe from "stripe";

let _stripe: Stripe | null = null;

// Lazily-constructed Stripe client (server-only). Lazy so the build never
// touches STRIPE_SECRET_KEY — it's only read at request time.
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { appInfo: { name: "KiddieNest" } });
  }
  return _stripe;
}
