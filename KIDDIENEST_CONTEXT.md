# KIDDIENEST_CONTEXT.md — Read This First

This is the **complete handoff document** for anyone (human or AI) starting work on
KiddieNest. It is written so that a brand-new session with zero prior context can read
this one file and understand what the project is, exactly where it stands, how it is
built, and how to work on it without breaking anything. When in doubt, trust this file
and the code over memory or assumptions.

**Last updated:** July 1, 2026 — immediately after the "batches 1–3" audit release
(`main` @ `035701e`).

---

## 1. What KiddieNest is

KiddieNest is a **live, production, multi-tenant daycare-management SaaS** at
**https://kiddienestapp.com**, priced at **$59/month per daycare center** via Stripe.
It has two synced sides: a **staff dashboard** (check-ins, daily updates, incidents,
messaging, child/staff/room records) and a **private parent portal** (live timeline,
incidents to acknowledge, chat with teachers).

- Built by **Ethan** (solo founder, recent CS grad), originating from a family
  member's real daycare, which will be the first at-scale pilot.
- **It is in production with real children's data. Nothing may break. Ever.**
- Primary competitor: Brightwheel. KiddieNest differentiates on simplicity, flat
  pricing, and reliability at scale.
- Historical note: the project's working name was **CareLoop** — the local folder is
  still `~/dev/careloop`, and `BRAND_IDEAS.md` / `RESEARCH.md` date from that era.
  The GitHub repo is `github.com/ethanir/kiddienest`.

## 2. Documentation map (which file is for what)

| File | Purpose |
| --- | --- |
| `KIDDIENEST_CONTEXT.md` | **This file.** Session handoff: state, history, workflow. |
| `docs/ARCHITECTURE.md` | Deep technical explainer of how everything works and why. |
| `README.md` | Public-facing overview (features, screenshots, stack, local setup). |
| `AGENTS.md` | Hard operating rules for AI agents (imported by `CLAUDE.md`). |
| `ROADMAP.md` | What's shipped, what's next, future ideas. |
| `DEPLOYMENT.md` | Domain/DNS/hosting/email reference and launch checklist. |
| `BRAND_IDEAS.md`, `RESEARCH.md` | Historical CareLoop-era notes. Do not treat as current. |

## 3. Stack (exact)

Next.js **16.2.x** (App Router, RSC, Server Actions, `src/proxy.ts` — the Next 16
rename of middleware), React **19.2**, TypeScript 5, Tailwind **v4**, shadcn/ui,
lucide-react. Supabase (**Postgres + Auth + RLS + Realtime + Storage**) via
`@supabase/ssr` and `supabase-js` v2. Stripe (live keys) for billing. Vitest for unit
tests. Hosted on **Vercel**, auto-deploying every push to `main`. Supabase is on the
**free tier** (no automated backups yet — known gap).

Env var names (values live in Vercel/`.env.local`, never in the repo):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (webhook only), `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `NEXT_PUBLIC_SITE_URL`.

## 4. Architecture in one page (full detail in docs/ARCHITECTURE.md)

- **Multi-tenant by `daycare_id`.** Tables: `daycares`, `profiles`, `children`,
  `rooms`, `guardians`, `guardian_invites`, `staff_invites`, `daily_updates`,
  `incidents`, `messages`, `stripe_events`. Photos in Storage bucket `child-photos`.
- **RLS-first security.** Row-Level Security policies in Postgres are the real
  authorization layer; the UI is just convenience. Policies and RPC bodies live **in
  Supabase, not in this repo** — you cannot read or change them from here. SQL
  changes are pasted manually into the Supabase SQL Editor by Ethan.
- **Three roles** on `profiles.role`: `parent`, `staff`, `admin` (owner).
- **Privileged mutations** go through `SECURITY DEFINER` RPCs that re-check role and
  `daycare_id` inside the database: `acknowledge_incident`, `assign_staff_room`,
  `cancel_staff_invite`, `claim_guardian_invites`, `claim_staff_invite`,
  `clear_all_incidents`, `delete_incident`, `invite_staff`, `mark_intended_owner`,
  `provision_daycare_for_user`, `redeem_admin_code`, `revoke_staff`,
  `set_subscription_status`.
- **Request path:** `src/proxy.ts` → `updateSession()` in
  `src/lib/supabase/middleware.ts` refreshes the session and runs role + billing
  gating with **one parallel DB wave** (profile + RLS-scoped daycare). Matcher:
  `/app/:path*` and `/login` only.
- **Reads** in Server Components; **writes** in Server Actions; **live sync** via
  Supabase Realtime with a debounced "re-fetch through your own RLS query" pattern
  (never trust the socket payload).
- **Shared modules** (added July 2026): `src/lib/ui.ts` (cardBase, inputCls,
  emblemStyle), `src/lib/avatars.ts`, `src/lib/incident-meta.ts`,
  `src/lib/update-types.ts`, `src/lib/supabase/errors.ts` (`rlsError`),
  `src/components/careloop/field.tsx`, and cached `getCurrentUser`/`getCurrentRole`
  in `src/lib/auth.ts`.
- **Bounded queries:** parent timeline loads the 50 most recent updates; message
  threads load the 200 most recent; CSV import caps at 1000 rows, inserted in
  chunks of 100.
- **Demo account** (safe to use for preview testing): `demo@kiddienest.app` /
  `DemoDaycare1` (admin). There is **no sample parent login yet**.

## 5. Current state (as of July 1, 2026)

- **Branches:** exactly two — `main` (production, `035701e`) and `dev` (Ethan's own
  separate work; **do not touch or delete it** without his explicit say-so). All
  other dev branches were deleted after the audit release.
- `main` @ `035701e` = the previous feature-complete app (`755fd14`) **plus the full
  three-batch audit release** (one combined commit, 45 files changed):
  - **Batch 1 — hot path & correctness:** proxy/middleware collapsed to one parallel
    query wave per request; request-cached `getCurrentUser` deduping auth calls;
    admin dashboard, staff page, `getStaff`, `shapeIncidents`, and `sendMessage`
    parallelized; parent timeline limited to 50 / messages to 200 /
    `loadParentChild` to 1 row; Stripe webhook only ACKs true Postgres unique
    violations (code `23505`) — any other insert error returns 500 so Stripe
    retries; cross-tenant `room_id` writes rejected in `createChild`, `updateChild`,
    and `assignChildRoom`; room-rename/delete child-label sync failures surfaced
    instead of swallowed.
  - **Batch 2 — structure:** all duplicated style constants extracted (`cardBase`
    was pasted in 15 files, `emblemStyle` in 9, `inputCls` in 4 + one deliberate
    rooms-manager variant that was intentionally kept local); `AVATARS`,
    `severityCls`, `Field`, and the `staffError` helpers consolidated; canonical
    incident vocabulary (`incident-meta.ts`) and daily-update types
    (`update-types.ts`) now shared between UIs and server validation — update
    titles are derived **server-side** from the type; `middleware.ts` renamed to
    `proxy.ts` per Next 16; dashboard aggregation rewritten as one O(n) pass;
    check-in `mergeRoster` made O(n) via Map with early exit.
  - **Batch 3 — polish:** `setAttendance` returns the server-confirmed row and the
    check-in board patches just that child (no more full-roster refetch per tap;
    realtime remains the cross-device sync); Reset-all now awaits in-flight writes
    so a straggler tap can never commit after the reset; the Children page gained
    the same search box + room-filter chips as check-in, an "X of Y children"
    count, and a no-match empty state.
- **Already handled** (do not re-raise as open): HTTP security headers in
  `next.config.ts`; postcss advisory cleared via override; incident deletion RPCs;
  children CSV import; sticky list-page headers; theme toggle in sidebar.
- **iOS/Capacitor app: PARKED.** Setup exists in a separate folder
  (`~/dev/kiddienest-ios`, Capacitor 8, wrapping `/app/parent`) but stalled at the
  Xcode simulator. **Do not resume unless Ethan explicitly asks.**

## 6. Open items (the real to-do list)

**Security hardening (medium priority, before paying customers):**
1. Rotate the static admin-unlock code used by `redeem_admin_code()` (value lives in
   the DB function, not the repo).
2. Enable email confirmation in Supabase Auth (currently off for testing).
3. Strengthen the Supabase password policy — and keep the client/server minimum
   (currently 6, in `src/app/login/`) in sync when you do.

**Pilot readiness (before the family daycare runs at full scale):**
4. CSV import for **rooms and staff** (children import already shipped).
5. Lightweight error tracking / observability (nothing exists today).
6. Sample parent logins linked to real children (for demos and testing).
7. A backup story for Supabase free tier (biggest infra gap).

**Feature roadmap (in order):**
8. Bird's-eye **floor-plan map** (desktop-only; clickable rooms → roster → child
   profile) — the next major feature.
9. Stripe **billing/customer portal** improvements.
10. Real-world test at the family daycare at scale.

## 7. How Ethan works with AI (the working agreement)

- Treat the AI as the **"final boss"**: research first, decide independently, be
  thorough over fast, own the architectural decisions — and never break production.
- Ethan often talks via **voice dictation**: messages ramble; extract intent.
- He cares deeply about **UI polish**: calm Apple/iOS feel, slate + emerald palette,
  smooth animations, flawless mobile. Visual regressions are failures.
- He is on a **MacBook Air with zsh**, does **not** use Claude Code, and wants
  **single copy-paste terminal blocks**.

**Delivery workflow (strictly enforced):**
1. Work in a sandbox clone; verify with `npx tsc --noEmit`, `npx eslint`, and
   `npm run build` (plus `npm run test:run`) **before** delivering anything.
2. Deliver changed files as **uniquely-suffixed copies** (e.g. `_p16docs`) — a fresh
   suffix every delivery so Downloads never collide.
3. Provide **one paste block**: `cd ~/dev/careloop`, branch or `main` checkout,
   `cp ~/Downloads/... <repo path>` lines, `git add -A`, `git commit -m "..."`,
   `git push`, and a stat command with the **expected file count** stated.
4. Historically he previewed on a Vercel branch preview then fast-forward merged;
   since July 2026 he is comfortable pushing well-verified work straight to `main`.
   Offer the preview path for risky changes.
5. SQL changes are delivered as paste-ready blocks he runs in the Supabase SQL
   Editor himself.

**Paste-block gotchas (cause real breakage — never skip):**
- Run `grep -nE '<[[:space:]]*$'` on every delivered file; a bare `<` at end-of-line
  gets swallowed by paste and breaks builds.
- **No `#` comments and no em-dashes on zsh command lines.**
- If a `cp` line errors "No such file", stop before the git commands — macOS renames
  duplicate downloads like `file (1).ts`.

**Sandbox quirks (for AI agents with a Linux sandbox):**
- The filesystem resets between tasks; `/mnt/user-data/outputs` persists — staged
  delivery files there can reconstruct state after a reset.
- `pkill` on a Next dev server hangs the bash tool — kill by PID.
- Split heavy build/test sequences across calls to avoid timeouts.
- `AGENTS.md` requires consulting the local Next.js docs in
  `node_modules/next/dist/docs/` over training data — Next 16 has breaking changes.

## 8. Key learnings already paid for (don't relearn them)

- The proxy/middleware hot path is the highest-leverage performance target; prefer
  **parallel DB query waves** over sequential awaits everywhere.
- Never swallow errors to "be safe": the Stripe webhook must only ACK true
  duplicates (`23505`); room-sync failures must surface.
- A provided `room_id` must **resolve under RLS** or be rejected — never write an
  unverified foreign key cross-tenant.
- History tables (`daily_updates`, `messages`, `incidents`) are the only unbounded
  growth — always bound reads.
- The check-in board's optimistic concurrency (per-child write chains + pending set
  + merge guard + reset ordering) was hard-won: change it only with a full
  concurrency walkthrough (see docs/ARCHITECTURE.md §7).
- Byte-verify duplicated strings before consolidating; keep deliberate visual
  variants (rooms-manager's input) local and documented.
- What was already strong before the audit: webhook design, RLS-first isolation
  (proven by a live cross-tenant test harness — no critical/high findings),
  accessibility (focus traps, aria, reduced motion), zero-`any` type hygiene.

## 9. Starting a new session — checklist

1. Read this file, then `docs/ARCHITECTURE.md`, then `AGENTS.md`.
2. Clone `github.com/ethanir/kiddienest`, run `npm install`, and confirm a clean
   baseline: `npx tsc --noEmit`, `npx eslint .`, `npm run build`, `npm run test:run`
   (20 tests, `src/lib/children-csv.test.ts`).
3. `git log --oneline -3` and verify `main` is at or past `035701e`; if the repo has
   moved on, read the newer commits before planning anything.
4. Ask Ethan what the task is if he hasn't said; otherwise proceed per §6 priorities.
