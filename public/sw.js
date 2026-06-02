// KiddieNest service worker — minimal, safe, no build plugin.
// Strategy:
//   • navigations (HTML)         → network-first, fall back to /offline.html
//   • same-origin static assets  → stale-while-revalidate (fast, self-healing)
//   • everything else (Supabase, Stripe, APIs, cross-origin, non-GET) → passthrough
// It never caches authenticated data or third-party requests.

const VERSION = "kn-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PRECACHE = [
  "/offline.html",
  "/brand-emblem.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon") ||
    url.pathname.startsWith("/apple") ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|css|js)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle our own origin. Supabase, Stripe, and any other host pass through.
  if (url.origin !== self.location.origin) return;

  // HTML navigations: network-first, offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline.html").then((r) => r || Response.error()),
      ),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res && res.status === 200) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
  // Anything else: let the browser handle it (no caching of dynamic/authed data).
});
