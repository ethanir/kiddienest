# KiddieNest — Product Roadmap

KiddieNest is a calm, simple daycare app: a private daily window for parents
(check-ins, photos, meals, naps, notes, incidents, messages) and an easy
day-to-day tool for staff. Built first for one real daycare, now a live,
multi-tenant product at **kiddienestapp.com** ($59/month per center).

**Design principles:** calm and uncluttered, friendly for non-technical staff,
trustworthy for parents, fast, and reliable. One clear thing per screen.

*(Last updated: July 1, 2026. The single source of truth for open work is
`KIDDIENEST_CONTEXT.md` §6; this file is the product-level view.)*

---

## Shipped and live in production

- **Accounts & security** — sign in / sign up, Row-Level Security on every table,
  privileged actions via SECURITY DEFINER RPCs, role-gated routing, HTTP security
  headers. Cross-tenant isolation verified with a live test harness.
- **Multi-tenant SaaS with billing** — Stripe checkout, webhook-driven
  provisioning with idempotency, subscription gating on every request, customer
  portal, $59/month flat pricing.
- **Three experiences** — Admin, Staff, and Parent, each routed to its own home.
- **Check-in / out board** — tap to mark checked in / out / absent; optimistic,
  correctly-ordered writes; live tallies; room chips + name search; Reset all.
- **Admin dashboard** — live attendance counts, per-room enrolled/present with
  staffing-ratio alerts, recent activity, allergy and unassigned counts.
- **Daily updates** — six canonical types with a live parent preview; optional
  photo attachments (private storage, signed URLs).
- **Parent portal (installable PWA)** — live timeline, child profile, incident
  acknowledgement, per-child messaging. Parents only ever see their own child.
- **Incidents** — type, severity, time, narrative, action taken; parent
  acknowledgement tracking; per-incident delete and confirmed Clear all.
- **Messaging** — real-time per-child threads between staff and family.
- **Records & onboarding** — children (with CSV bulk import, search, room
  filter), rooms (capacity + ratios), staff invites and roles, parent invites
  that auto-link on sign-up.
- **Live everywhere** — Supabase Realtime with a secure re-fetch pattern; light
  and dark themes; deployed on Vercel at a custom domain.
- **July 2026 quality release** — full-codebase audit plus three batches:
  request hot-path down to one parallel query wave, bounded history reads,
  hardened Stripe webhook idempotency, cross-tenant write guards, shared design
  tokens and canonical vocabularies, Next 16 proxy migration, O(n) hot loops.

## Next (in order)

1. **Security hardening before paying customers** — rotate the static
   admin-unlock code, enable email confirmation, strengthen the password policy.
2. **Pilot readiness** — rooms + staff CSV import, lightweight error
   tracking/observability, sample parent logins, a backup story for the
   database.
3. **Run the pilot** — the family daycare at full scale, feeding real-world
   feedback back into the product.

## After the pilot

- **Bird's-eye floor-plan map** (desktop) — a visual map of the center;
  click a room to see its live roster, click a child to open their profile.
- **Stripe billing polish** — richer plan/portal experience.
- **Multi-child parent view** — families with more than one enrolled child.
- **Forms & e-signatures** — replace the "Soon" placeholder with real digital
  permissions (field trips, emergency info).

## Future ideas (need real-world input from the daycare)

- **"Start the Day" arrivals board** (Ethan's idea — refine with mom)
  - Children expected that day appear as **pending** and gently **pulse**.
  - Staff tap as each child arrives (turns green, stops pulsing).
  - Per-child **"expected by" time**; overdue cards escalate (pulse amber)
    until marked arrived or absent.
  - Questions for mom: set arrival windows? same daily or per-day? notify the
    parent on late arrival? when does the board reset?
- **Authorized pickup list** — who may collect each child (shown at checkout).
- **Reports & exports** — attendance summaries, daily-sheet PDFs.
- **Audit log** — who checked a child in/out, who viewed records.
- **Native iOS app** — a Capacitor wrapper of the parent PWA exists but is
  parked (stalled at the Xcode simulator); revisit after the pilot.
