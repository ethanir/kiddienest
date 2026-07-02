# KiddieNest — Domain & Deployment Notes

## Domain
- Production domain: kiddienestapp.com  (registrar: GoDaddy)
- Note: bare kiddienest.com was taken, so we use kiddienestapp.com.

## Current DNS (GoDaddy)
- A      @                -> GoDaddy "WebsiteBuilder Site" (placeholder; repoint to Vercel at deploy)
- CNAME  www              -> kiddienestapp.com
- CNAME  email            -> mailgun.org                 (email)
- CNAME  pay              -> paylinks.commerce.godaddy.com (GoDaddy commerce, unused)
- CNAME  _domainconnect   -> _domainconnect.gd.domaincontrol.com
- NS     @                -> ns69.domaincontrol.com, ns70.domaincontrol.com
- SOA    @                -> ns69.domaincontrol.com
- MX     @                -> mxa.mailgun.org, mxb.mailgun.org (priority 60)  (email)
- TXT    @                -> v=spf1 include:mailgun.org ~all                 (SPF)
- TXT    smtp._domainkey  -> k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsm79qBMFVtUK1dRldPfY8c2wKB0kKNTHZVK3E4VXFy9FYbFFeHRKEPL9NJgG3Hg/6D2hxx0tLTtGZ/xPtrIFX11nxfRzzhKsCGCHTZbKMb8Txa1BrKRgidqFhzs82UEmGp4APNuOuXwdzMyq+Qtdc0BgYne1K/VXsBrjXd2dojQIDAQAB  (DKIM)
- TXT    _dmarc           -> v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;  (DMARC)

Email is already configured via Mailgun (MX + SPF + DKIM + DMARC), so we can send
transactional email from @kiddienestapp.com (parent invites, confirmations, notifications).

## Live deployment (current)
- **Host:** Vercel. Every push to `main` on `github.com/ethanir/kiddienest`
  auto-builds and deploys to production. Branch pushes get preview URLs.
- **Function region: Cleveland (cle1)** — set July 2026 (Project → Settings →
  Functions) to sit next to the Supabase project in AWS `us-east-2`; Fluid
  Compute is on. Keep compute and database co-located if either ever moves.
  Verify with `curl -sI https://kiddienestapp.com/ | grep -i x-vercel-id`
  (the second code is the function region).
- **Domain:** kiddienestapp.com (+ www) points at Vercel; the Mailgun MX/TXT
  records above are untouched and email works.
- **Env vars (set in Vercel, values never in the repo):**
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only, webhook),
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`.
- **Stripe webhook:** points at `https://kiddienestapp.com/api/stripe/webhook`
  (live mode). If the endpoint or secret changes, update `STRIPE_WEBHOOK_SECRET`.
- **Supabase:** free tier. Auth Site URL + redirects include
  https://kiddienestapp.com. **No automated backups yet — known gap.**
- **PWA:** installable ("Add to Home Screen") via the web manifest + install
  prompt; the parent portal is the primary install target.
- **Rollback:** use Vercel's instant rollback to a previous deployment, or
  `git revert` the offending commit and push.

## JWT signing keys (asymmetric) — STATUS: DONE
Discovered July 2, 2026: this project already runs on asymmetric signing keys.
Current key: **ECC (P-256)**; the legacy **HS256 shared secret** sits under
"Previously used keys" (rotated ~June 2026) and **must stay un-revoked** — the
legacy `anon` + `service_role` env keys are themselves JWTs signed by it, so
revoking it breaks the whole app. Revocation only becomes possible after a
separate, deliberate migration to `sb_publishable_...` / `sb_secret_...` API
keys (tracked in KIDDIENEST_CONTEXT.md §6). Because the keys are asymmetric,
`getClaims()` (proxy + `src/lib/auth.ts`) verifies every request's JWT locally
against the cached public keys — zero auth-server round trips per navigation.

For a FUTURE rotation (e.g. suspected key compromise), zero-downtime from the
same dashboard page: **Create Standby Key** → wait for it to be picked up →
**Rotate keys** (existing sessions and legacy API keys remain valid) → never
revoke a previous key while anything still verifies against it.

## Before onboarding paying centers
- Turn email confirmation back ON in Supabase Auth (off for testing) and
  strengthen the password policy (keep the client/server minimum in sync).
- Rotate the static admin-unlock code used by the `redeem_admin_code()` RPC.
- Point Supabase SMTP at Mailgun so auth emails come from @kiddienestapp.com.
- Set up database backups and lightweight error tracking.
- Decide: open parent sign-up (account sees nothing until invited) vs fully
  invite-only.
- Verify the name once more: domain (owned), USPTO trademark, App Store + Play.
