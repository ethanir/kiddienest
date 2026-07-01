import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed the `middleware` file convention to `proxy` (the old name
// is deprecated). Same behavior: runs before routes render to refresh the auth
// session and gate access.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run auth on the app + the login page; public marketing pages stay fast.
  matcher: ["/app/:path*", "/login"],
};
