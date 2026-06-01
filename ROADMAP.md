# KiddieNest — Product Roadmap

KiddieNest is a calm, simple daycare app: a private daily window for parents
(check-ins, photos, meals, naps, notes) and an easy day-to-day tool for staff.
Built first for one real daycare, designed to grow into a product other centers
can use.

**Design principles:** calm and uncluttered, friendly for non-technical staff,
trustworthy for parents, fast, and reliable. One clear thing per screen.

---

## Shipped
- **Accounts & security** — sign in / sign up, with a database security layer
  (Row-Level Security) so a parent can only ever see their own child's info.
- **Roles** — staff/admin vs. parent, each routed to the right home screen.
- **Parent timeline** — each parent sees their child's real daily updates
  (meals, naps, photos, notes), newest first.
- **Daily reports** — staff post an update to a child; it appears on that
  parent's timeline.
- **Check-in / out** — staff mark each child checked in, out, or absent; status
  and times are saved.
- **Admin dashboard** — live attendance counts, the child roster with current
  status, a recent-activity feed, and allergy alerts.
- **Child profiles** — staff add and edit children in-app (name, room, birthday,
  allergies, avatar).

## Next (toward real families using it)
1. **Parent onboarding / linking** — a simple way for staff to invite a parent
   and link them to their child (today this is done by hand in the database).
2. **Role-gated navigation** — parents only ever see parent screens.
3. **Messages** — real two-way messages between staff and a child's parents.
4. **Incidents** — staff log an incident (bump, fall, etc.); the parent is
   notified and can acknowledge.
5. **Forms** — digital forms / permissions (field-trip consent, emergency info).
6. **Photos** — real photo upload + private storage attached to updates.
7. **Go live** — deploy to the web on your domain, plus "Add to Home Screen" so
   it feels like an app before any App Store release.

## Future ideas (need real-world input from the daycare)
- **"Start the Day" arrivals board** (Ethan's idea — capture now, refine with mom)
  - At the start of a day, the children expected that day appear as **pending**
    and gently **pulse** to draw the eye.
  - As each child arrives, staff tap to mark them **here** (turns green, stops
    pulsing).
  - Each child has an **"expected by" time** (custom per child, or a center-wide
    default). If a child hasn't arrived by that time, their card escalates
    (e.g. pulses amber) until staff mark them **arrived** or **absent**.
  - Questions for mom: Do kids have set arrival windows? Same daily or per-day?
    Should a late arrival notify the parent? When does the board reset for the
    next day?
  - When we build this, research how other daycare apps handle expected
    attendance + late alerts so it feels familiar.
- **Authorized pickup list** — who may collect each child (shown at checkout).
- **Live updates** — timeline and attendance refresh without reloading.
- **Reports & exports** — attendance summaries, daily-sheet PDFs.

## Before public launch / SaaS
- **Name check** — confirm KiddieNest is clear: kiddienest.com (domain), USPTO
  trademark, App Store + Google Play.
- **Email confirmation / invite-only sign-up** — sign-up is open for testing now.
- **Audit log** — record sensitive actions (who checked a child in/out, who
  viewed records).
- **Billing** — if offered to other centers (subscriptions, invoicing).
