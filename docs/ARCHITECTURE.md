# KiddieNest Architecture — How Everything Works and Why

This document explains the entire system from first principles, assuming no prior
context. It is deliberately thorough: read it once and you should understand what
happens on every request, where security actually lives, why the tricky parts are
built the way they are, and which invariants you must not break. Pair it with
`KIDDIENEST_CONTEXT.md` (project state and workflow) and the code itself.

---

## 1. The mental model

KiddieNest is a **server-rendered Next.js 16 App Router app** in front of a
**Supabase Postgres database**. Three ideas explain almost everything:

1. **The database is the security boundary.** Every table has Row-Level Security
   (RLS) policies. The Next.js server talks to Postgres *as the signed-in user*, so
   even if application code has a bug, Postgres itself refuses to return or modify
   rows the user isn't allowed to touch. The UI hides buttons; the database enforces
   rules.
2. **Reads render on the server, writes are Server Actions.** Pages are React Server
   Components that query Supabase during render. Mutations are `"use server"`
   functions the client invokes; they run on the server with the caller's session.
3. **Realtime means "re-fetch, don't trust."** When a relevant table changes,
   Supabase Realtime pings the browser; the browser then re-runs its own
   RLS-protected query. The socket payload itself is never rendered, so realtime can
   never leak data or paint stale/foreign rows.

## 2. Life of a request

Every request to `/app/*` or `/login` passes through **`src/proxy.ts`** (Next 16's
rename of `middleware.ts`; the exported function is `proxy`). It delegates to
`updateSession()` in `src/lib/supabase/middleware.ts`, which does, in order:

1. Creates a Supabase server client bound to the request cookies and calls
   `auth.getUser()` — this **validates the JWT against Supabase Auth** (unlike
   `getSession()`, which trusts the cookie and is spoofable; we never use it).
2. No user + `/app/*` → redirect to `/login`. User + `/login` → redirect to `/app`.
3. For a signed-in user on any `/app` path except `/app/locked`, it fires **one
   parallel wave** of two queries: the caller's `profiles` row
   (`role, daycare_id, intended_role`) and their `daycares` row
   (`subscription_status`). The daycare read is deliberately *unfiltered*: RLS
   scopes it to the caller's own daycare (at most one row), so it doesn't need to
   wait for the profile's `daycare_id`. This replaced three *sequential* queries —
   the single biggest nav-speed lever in the app.
4. **Role gate:** parents are redirected out of staff paths and vice versa.
5. **Billing gate:** staff/admin whose daycare isn't `active`/`trialing` → redirect
   to `/app/locked`. A `parent`-role user with no daycare but
   `intended_role = "owner"` (signed up as an owner, never paid) also lands on
   `/app/locked`. Parents are never billing-gated — KiddieNest is free for them.

After the proxy, `/app/page.tsx` routes by role (`admin`/`staff` → `/app/admin`,
`parent` → `/app/parent`), and each page renders with its own queries.

## 3. Auth helpers

`src/lib/auth.ts` exports two request-cached helpers (React `cache()`):

- `getCurrentUser()` — the validated user, **one auth round trip per server request**
  no matter how many callers (layout, page, actions) need it.
- `getCurrentRole()` — reads `profiles.role` through `getCurrentUser()`.

Rule: inside pages and actions, use these instead of calling
`supabase.auth.getUser()` directly, or you reintroduce duplicate auth calls.

## 4. Multi-tenancy and RLS, from scratch

Many daycares share one database. Isolation works like this:

- `daycares` is the tenant table (one row per paying center; has `owner_id`,
  `subscription_status`, `stripe_customer_id`).
- `profiles` (one per auth user; `id = auth.uid()`) carries `role`
  (`parent | staff | admin`), `daycare_id`, and `intended_role`.
- Tenant-owned tables (`children`, `rooms`, `incidents`, …) carry `daycare_id`.
- **RLS policies** — written in SQL, stored in Supabase, *not in this repo* — say
  things like "staff may select children where `children.daycare_id` equals the
  `daycare_id` on *their own* profile" and "a guardian may select only children
  linked to them via `guardians`."

Consequences you must internalize:

- Application code can *trust* that a plain `select` returns only permitted rows.
  That's why e.g. the roster query has no `.eq("daycare_id", …)` — RLS adds it.
- But application code must **not** write unverified references across tenants: a
  `room_id` supplied by the client is only written after a lookup proves it resolves
  under RLS (`createChild`, `updateChild`, `assignChildRoom` all reject otherwise).
- Anything RLS can't express as a per-row predicate — "only admins may invite
  staff", "acknowledge exactly this incident as this guardian" — is a
  **`SECURITY DEFINER` RPC**: a Postgres function that runs with elevated rights but
  *re-checks role and `daycare_id` itself* before acting. The full list:
  `provision_daycare_for_user`, `set_subscription_status` (webhook only),
  `mark_intended_owner`, `redeem_admin_code`, `invite_staff`, `claim_staff_invite`,
  `cancel_staff_invite`, `revoke_staff`, `assign_staff_room`,
  `claim_guardian_invites`, `acknowledge_incident`, `delete_incident`,
  `clear_all_incidents`.
- Error UX: RLS denials surface as "row-level security" messages or PGRST116;
  `rlsError(error, friendly)` in `src/lib/supabase/errors.ts` maps them to
  human-readable text. Use it in every new action.

## 5. Data model (what each table is for)

| Table | Purpose |
| --- | --- |
| `daycares` | Tenants. Owner, Stripe customer, `subscription_status` (gates the app). |
| `profiles` | One per user. `role`, `daycare_id`, `intended_role`, name, email, staff `room_id`. |
| `children` | The roster. Name, `room_id` + denormalized `room` name, birthdate, allergies, emoji avatar, `attendance_status` (`not_arrived | checked_in | checked_out | absent`) with timestamps. |
| `rooms` | Classrooms. Name, capacity, `max_per_staff` ratio, `sort_order`. |
| `guardians` | Links parent profiles to children (many-to-many). |
| `guardian_invites` | Pending parent invites by email; claimed on parent sign-in (`claim_guardian_invites` runs in the parent layout). |
| `staff_invites` | Pending staff invites by email with intended role. |
| `daily_updates` | The parent timeline: `type` (canonical list in `src/lib/update-types.ts`), server-derived `title`, body, optional `photo_path`. |
| `incidents` | Type/severity (canonical list in `src/lib/incident-meta.ts`), narrative, action taken, `occurred_at`, `acknowledged_at` + by whom. |
| `messages` | Per-child chat: body, `sender_id`, `sender_role`. |
| `stripe_events` | Webhook idempotency ledger (unique event ids). |

Photos live in the **`child-photos`** Storage bucket under paths that encode
ownership; the parent timeline renders short-lived, resize-transformed **signed
URLs**, never public URLs.

## 6. The screens (where things live)

Staff (`src/app/app/...` + `src/components/careloop/...`): `admin` dashboard
(aggregates computed in a single O(n) pass), `check-in` board, `children` manager
(search + room chips + CSV import via `children-import-dialog` and the pure, tested
parser in `src/lib/children-csv.ts` — max 1000 rows, inserted in chunks of 100),
`rooms`, `staff`, `messages`, `daily-report` builder (live parent preview),
`incidents`, and `forms` (demo placeholder marked "Soon"). Parent
(`src/app/app/parent/...`): today timeline (50 most recent), child profile +
incident acknowledgement, and messages (200 most recent per thread). `app-chrome`
(staff) and `parent-shell` (parent PWA feel) provide navigation; `login` handles
both sign-in and owner/parent sign-up; `locked` is the billing wall.

## 7. Check-in concurrency (read before touching the board)

The board (`src/components/careloop/check-in-board.tsx`) is used at a kiosk during
drop-off: many rapid taps, several devices, realtime echoes — and it must never
flicker or revert. The design:

- **Optimistic UI:** a tap updates the local child immediately (`withStatus`).
- **Per-child write queue** (`chainRef: Map<id, Promise>`): each tap chains behind
  the previous write *for that child*, so writes land in order and the last tap
  wins. Different children write in parallel.
- **Pending guard** (`pendingRef: Set<id>`): while a child has an in-flight write,
  `mergeRoster` keeps the *local* copy when any fresh roster arrives, so a realtime
  echo can't repaint a just-tapped square with stale data. The merge is O(n) via a
  Map, with an early exit when nothing is pending.
- **Settle:** only the *last* queued write for a child reconciles and releases. On
  success, `setAttendance` returns the **server-confirmed row** and the board
  patches just that child (a tap does not refetch 200 rows). On error/empty it
  falls back to a full `getCheckinRoster()` merge.
- **Realtime** (`useRealtime`, debounced ~120 ms) re-fetches the roster on any
  `children` change — this is how *other* devices' taps arrive.
- **Reset all:** snapshots state, captures in-flight chains, clears the chain map
  (so stragglers' settle callbacks become no-ops), marks *every* child pending,
  optimistically resets, **awaits the captured in-flight writes**
  (`Promise.allSettled`) so the bulk reset is ordered strictly after them in the
  database, then issues the reset, refetches the authoritative roster, and releases
  the guard. Failure restores the snapshot.

Invariants: never remove the pending guard, never let two writes for one child race,
never trust a realtime payload, and keep reset ordered after in-flight writes. Any
change here needs a written concurrency walkthrough covering rapid same-child taps,
cross-device echoes, reset-during-tap, and mid-deploy old-client bundles.

## 8. Realtime pattern (everywhere else)

`src/lib/use-realtime.ts` subscribes to `postgres_changes` for given tables,
debounces bursts, and invokes a callback that **re-fetches through a server action**.
Used by the check-in board, incidents, messages, the dashboard
(`realtime-refresh` → `router.refresh()`), and the parent surfaces. New live
surfaces should follow the same shape; remember every echo re-runs your query, which
is why history queries are bounded (timeline 50, messages 200).

## 9. Billing lifecycle

1. Owner signs up → `mark_intended_owner` → checkout (`src/lib/checkout.ts`,
   `STRIPE_PRICE_ID`) → Stripe Checkout.
2. **Webhook** (`src/app/api/stripe/webhook/route.ts`, the only place
   `SUPABASE_SERVICE_ROLE_KEY` is used): verifies the signature on the **raw body**;
   inserts the event id into `stripe_events` — a Postgres **23505 unique violation
   means duplicate → ACK 200**, any *other* insert failure returns **500 so Stripe
   retries** (a transient DB blip must never silently drop a billing event);
   processes `checkout.session.completed` (provisions the daycare, promotes the
   owner) and subscription updates (`set_subscription_status`); on processing
   failure the ledger row is **rolled back** so the retry reprocesses.
3. The proxy's billing gate (§2) enforces `subscription_status` on every request;
   `/app/locked` offers checkout or the Stripe customer portal
   (`src/lib/billing.ts`).

## 10. Performance playbook (rules the code already follows)

1. Fire independent queries in **one `Promise.all` wave**; never stack `await`s.
2. Use cached `getCurrentUser()`/`getCurrentRole()`; one auth call per request.
3. **Bound every history read** and cap every import.
4. Select only the columns you render (the dashboard fetches five columns, not
   nine); skip `.order()` on data you never list.
5. Aggregate in **one pass** with Maps/counters, not repeated `.filter()` scans.
6. Patch single rows on mutation instead of refetching collections where a
   confirmed row is available (check-in taps).
7. The proxy is the hottest path — treat every query added there as a tax on every
   navigation.

## 11. Design system

Calm, Apple/iOS-like, slate + emerald, first-class dark mode, `rounded-2xl` cards.
Shared tokens live in `src/lib/ui.ts` (`cardBase`, `inputCls`, `emblemStyle` — the
brand emblem is a CSS mask that inherits the host's background color). The rooms
dialog keeps a deliberate larger-input variant locally. Avatars in
`src/lib/avatars.ts`; the labeled `Field` wrapper in
`src/components/careloop/field.tsx`. Icon/color palettes intentionally differ per
surface (admin feed vs parent timeline) — do not "unify" them. Accessibility is a
feature: focus-trapped sheets, `aria-pressed`/labels, `prefers-reduced-motion`
honored (`count-up.tsx`). List pages share the viewport-lock pattern
(`lg:h-[calc(100vh-3rem)] lg:flex lg:flex-col lg:overflow-hidden`) so headers stay
fixed and only lists scroll, and the `RoomFilterBar` (search + room chips) is the
standard list filter.

## 12. Verification contract

Before any delivery: `npx tsc --noEmit`, `npx eslint .`, `npm run build`, and
`npm run test:run` (Vitest; 20 tests covering the CSV parser) must all pass, plus
the paste-hazard grep from `AGENTS.md`. There is no e2e suite yet; production
behavior is verified on Vercel deploys with the demo account
(`demo@kiddienest.app / DemoDaycare1`).

## 13. Known sharp edges

- Supabase **free tier**: no automated backups yet (top infra gap).
- RLS policies/RPC bodies are only visible in the Supabase dashboard.
- A parent with multiple linked children sees the first (by name) — multi-child UI
  is future work.
- `/app/forms` is a demo-data placeholder, reachable by URL.
- Room `sort_order` uses read-max-then-insert (acceptable single-admin race).
- Open security items are tracked in `KIDDIENEST_CONTEXT.md` §6.
