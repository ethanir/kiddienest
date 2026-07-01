<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# KiddieNest — Rules for AI Agents

Read `KIDDIENEST_CONTEXT.md` (project state, history, workflow) and
`docs/ARCHITECTURE.md` (how the system works) before doing anything. Then follow
these hard rules:

1. **This is production with real children's data.** kiddienestapp.com deploys
   automatically from every push to `main`. Never break it. When risk is non-trivial,
   deliver to a branch for a Vercel preview instead of `main`.
2. **Verify before delivering — always:** `npx tsc --noEmit`, `npx eslint .`,
   `npm run build`, `npm run test:run`. All four green, no exceptions.
3. **Trust local docs over training data.** Next.js 16 renamed conventions
   (`middleware.ts` → `src/proxy.ts`, already migrated). Check
   `node_modules/next/dist/docs/` whenever unsure.
4. **Security model:** authorization lives in Postgres RLS and `SECURITY DEFINER`
   RPCs, whose SQL lives in Supabase — not this repo. Never bypass it, never write a
   client-supplied foreign key (like `room_id`) without proving it resolves under
   RLS, always use `getCurrentUser()`/`getCurrentRole()` from `src/lib/auth.ts`
   (never `getSession()`), and map RLS errors with `rlsError()` from
   `src/lib/supabase/errors.ts`. The service-role key is used **only** in the Stripe
   webhook. SQL changes are handed to Ethan as paste blocks for the Supabase SQL
   Editor.
5. **Don't regress the patterns:** parallel query waves (never sequential awaits for
   independent queries), bounded history reads, single-pass aggregation, shared
   tokens from `src/lib/ui.ts` / `avatars.ts` / `incident-meta.ts` /
   `update-types.ts` instead of new copies, and the check-in board's concurrency
   design (see ARCHITECTURE §7 — do not modify without a written concurrency
   walkthrough).
6. **UI bar is high:** calm iOS feel, slate + emerald, flawless dark mode and
   mobile. No unintended visual changes; refactors must be pixel-identical.
7. **Delivery format for Ethan (Mac, zsh, no Claude Code):** verified files as
   uniquely-suffixed copies plus ONE paste block (`cp` lines + `git add/commit/push`
   + a stat with the expected file count). Before staging, run
   `grep -nE '<[[:space:]]*$'` on every delivered file (bare `<` at line-end breaks
   on paste). No `#` comments or em-dashes on zsh command lines.
8. **The iOS/Capacitor effort is parked.** Do not resume it unless Ethan explicitly
   asks. Do not touch or delete the `dev` branch — it is Ethan's separate work.
9. **Keep the docs true.** If your change makes any statement in the `.md` files
   stale, update them in the same delivery.
