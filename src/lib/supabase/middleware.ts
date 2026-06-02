import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STAFF_PREFIXES = [
  "/app/admin",
  "/app/staff",
  "/app/children",
  "/app/check-in",
  "/app/daily-report",
  "/app/messages",
  "/app/forms",
  "/app/incidents",
];

// Runs on every /app and /login request: refreshes the auth session cookie,
// gates the app so signed-out users can't reach /app, and keeps each role
// inside its own section.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run other code between creating the client and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Signed-out users trying to open the app -> send to login.
  if (!user && pathname.startsWith("/app")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already signed in but sitting on /login -> send into the app.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // Role-gating: keep parents in the parent area and staff in the staff area.
  if (user && pathname.startsWith("/app")) {
    const isStaffPath = STAFF_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );
    const isParentPath =
      pathname === "/app/parent" || pathname.startsWith("/app/parent/");

    if (isStaffPath || isParentPath) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const role = profile?.role;

      if (role === "parent" && isStaffPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/app/parent";
        return NextResponse.redirect(url);
      }
      if ((role === "staff" || role === "admin") && isParentPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/app/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  // Billing gate: staff/admin whose daycare isn't active get sent to billing.
  // (Parents are never gated — KiddieNest is free for them.)
  if (user && pathname.startsWith("/app")) {
    const onBilling =
      pathname === "/app/billing" || pathname.startsWith("/app/billing/");
    if (!onBilling) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, daycare_id, intended_role")
        .eq("id", user.id)
        .maybeSingle();

      // Owner/staff with a daycare: gate on its subscription status.
      if (
        (profile?.role === "admin" || profile?.role === "staff") &&
        profile?.daycare_id
      ) {
        const { data: daycare } = await supabase
          .from("daycares")
          .select("subscription_status")
          .eq("id", profile.daycare_id)
          .maybeSingle();

        const ok =
          daycare?.subscription_status === "active" ||
          daycare?.subscription_status === "trialing";

        if (!ok) {
          const url = request.nextUrl.clone();
          url.pathname = "/app/billing";
          return NextResponse.redirect(url);
        }
      }

      // Signed up as an owner but never paid (no daycare yet) → finish at billing.
      if (
        profile?.role === "parent" &&
        !profile?.daycare_id &&
        profile?.intended_role === "owner"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/app/billing";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
