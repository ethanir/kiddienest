import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run auth on the app + the login page; public marketing pages stay fast.
  matcher: ["/app/:path*", "/login"],
};
