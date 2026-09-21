/* ETAFAT borne tactile — offline service worker (scope: whole origin, registered only from /evenement).
   Strategy: precache the kiosk page + all its media at install; cache-first for the kiosk page,
   its media and immutable Next static chunks; everything else passes through to the network so the
   main site is unaffected. Bump CACHE to force a refresh. */
const CACHE = "etafat-borne-v1";
const PRECACHE = [
  "/evenement/",
  "/evenement.webmanifest",
  "/etafat/logo.png",
  "/etafat/videos/aerial-territory.mp4",
  "/etafat/evenement/icon-192.png",
  "/etafat/evenement/icon-512.png",
  "/etafat/evenement/pool/aerial-1.jpg",
  "/etafat/evenement/pool/aerial-2.jpg",
  "/etafat/evenement/pool/aerial-3.jpg",
  "/etafat/evenement/pool/aerial-4.jpg",
  "/etafat/evenement/pool/aerial-5.jpg",
  "/etafat/evenement/pool/agri-1.jpg",
  "/etafat/evenement/pool/agri-2.jpg",
  "/etafat/evenement/pool/agri-3.jpg",
  "/etafat/evenement/pool/building-1.jpg",
  "/etafat/evenement/pool/building-2.jpg",
  "/etafat/evenement/pool/building-3.jpg",
  "/etafat/evenement/pool/cadastre-1.jpg",
  "/etafat/evenement/pool/cadastre-2.jpg",
  "/etafat/evenement/pool/cadastre-3.jpg",
  "/etafat/evenement/pool/gis-1.jpg",
  "/etafat/evenement/pool/gis-2.jpg",
  "/etafat/evenement/pool/gis-3.jpg",
  "/etafat/evenement/pool/gis-4.jpg",
  "/etafat/evenement/pool/heritage-1.jpg",
  "/etafat/evenement/pool/heritage-2.jpg",
  "/etafat/evenement/pool/heritage-3.jpg",
  "/etafat/evenement/pool/mining-1.jpg",
  "/etafat/evenement/pool/mining-2.jpg",
  "/etafat/evenement/pool/mining-3.jpg",
  "/etafat/evenement/pool/networks-1.jpg",
  "/etafat/evenement/pool/networks-2.jpg",
  "/etafat/evenement/pool/networks-3.jpg",
  "/etafat/evenement/pool/networks-4.jpg",
  "/etafat/evenement/pool/port-1.jpg",
  "/etafat/evenement/pool/port-2.jpg",
  "/etafat/evenement/pool/port-3.jpg",
  "/etafat/evenement/pool/roads-1.jpg",
  "/etafat/evenement/pool/roads-2.jpg",
  "/etafat/evenement/pool/roads-3.jpg",
  "/etafat/evenement/pool/roads-4.jpg",
  "/etafat/evenement/pool/terrain-1.jpg",
  "/etafat/evenement/pool/terrain-2.jpg",
  "/etafat/evenement/pool/terrain-3.jpg",
  "/etafat/evenement/pool/terrain-4.jpg",
  "/etafat/evenement/pool/urban-1.jpg",
  "/etafat/evenement/pool/urban-2.jpg",
  "/etafat/evenement/pool/urban-3.jpg",];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // add individually so one missing asset can't abort the whole precache
      Promise.allSettled(PRECACHE.map((u) => cache.add(new Request(u, { cache: "reload" }))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function cacheFirst(request, key) {
  return caches.match(key || request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((res) => {
      if (res && res.status === 200 && res.type !== "opaque") {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(key || request, clone));
      }
      return res;
    }).catch(() => caches.match(key || request));
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin

  // Kiosk page navigations -> serve the cached shell (works offline).
  if (req.mode === "navigate" && url.pathname.startsWith("/evenement")) {
    event.respondWith(cacheFirst(req, "/evenement/"));
    return;
  }
  // Kiosk media + immutable Next static assets -> cache-first.
  if (
    url.pathname.startsWith("/etafat/evenement/") ||
    url.pathname === "/etafat/logo.png" ||
    url.pathname === "/etafat/videos/aerial-territory.mp4" ||
    url.pathname === "/evenement.webmanifest" ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }
  // Everything else: default network (main site unaffected).
});
