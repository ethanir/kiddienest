import type { NextConfig } from "next";

// Conservative, broadly-safe security headers. Intentionally NO Content-Security-
// Policy yet: the app uses an inline theme script plus Stripe + Supabase, so a CSP
// needs careful testing and is handled separately to avoid breaking production.
const securityHeaders = [
  // Disallow being embedded in an <iframe> (clickjacking). The app is never framed;
  // Stripe Checkout is a full redirect, not an embed.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses away from their declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin on cross-origin navigations; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for a year, including subdomains. No `preload` yet (that's a
  // hard-to-reverse commitment we can opt into deliberately later).
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Deny powerful APIs we don't use. Note: this governs getUserMedia, NOT the
  // file-input photo picker — daily-report photo uploads keep working. Relax
  // `camera`/`microphone` here if we ever add kiosk live-camera capture.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
