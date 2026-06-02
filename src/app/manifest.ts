import type { MetadataRoute } from "next";

// Generates /manifest.webmanifest — makes KiddieNest installable as a PWA
// (home-screen icon, standalone fullscreen, themed). Parents "Add to Home
// Screen" and it opens like a native app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KiddieNest",
    short_name: "KiddieNest",
    description:
      "Your daycare's whole day in one calm place — check-ins, daily updates, photos, and messages.",
    id: "/",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    categories: ["education", "lifestyle", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
