/* ETAFAT borne tactile — offline service worker (scope: whole origin, registered only from /evenement).
   Strategy: precache the kiosk page + all its media at install. The kiosk page navigation is
   network-first (always fresh when online — so website updates show immediately — and falls back
   to the cached shell offline, which is how the borne runs). Media and immutable Next static chunks
   stay cache-first. Everything else passes through to the network so the main site is unaffected.
   Bump CACHE to force a full refresh + purge of the old cache. */
const CACHE = "etafat-borne-v6";
const PRECACHE = [
  "/evenement/",
  "/evenement.webmanifest",
  "/etafat/logo.png",
  "/vendor/model-viewer-3.5.0.min.js",
  "/etafat/videos/aerial-territory.mp4",
  "/etafat/evenement/icon-192.png",
  "/etafat/evenement/icon-512.png",
  // real project screens (Tanger Med, Barid Al-Maghrib, Skhirate–Témara)
  "/etafat/evenement/projets/05-tanger-med/bathymetrie-3d.jpg",
  "/etafat/evenement/projets/05-tanger-med/zones-levees.jpg",
  "/etafat/evenement/projets/05-tanger-med/bathymetrie-port-passagers.jpg",
  "/etafat/evenement/projets/05-tanger-med/bathymetrie-nord-est.jpg",
  "/etafat/evenement/projets/05-tanger-med/plan-bathymetrique-3d.jpg",
  "/etafat/evenement/projets/25-barid-al-maghrib/statistiques.jpg",
  "/etafat/evenement/projets/25-barid-al-maghrib/fiche-site.jpg",
  "/etafat/evenement/projets/25-barid-al-maghrib/procedurale.jpg",
  "/etafat/evenement/projets/26-skhirate-temara/tnb.jpg",
  "/etafat/evenement/projets/26-skhirate-temara/odp.jpg",
  "/etafat/evenement/projets/26-skhirate-temara/fiche-tnb.jpg",
  "/etafat/evenement/projets/26-skhirate-temara/detail-activite.jpg",
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
  "/etafat/evenement/pool/urban-3.jpg",
  // country banners (flag × landmark) on the presence globe's country card
  ...[504, 384, 686, 478, 324, 624, 854, 178, 148, 788, 466, 430, 288, 768, 566, 266, 24, 180, 508, 108, 204, 270, 250, 300, 634, 784, 682, 608, 170].map((iso) => `/etafat/presence/banners/${iso}.jpg`),
];

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

// Network-first: always try the network (so an updated kiosk shows immediately when online),
// refresh the cached shell on success, and fall back to the cached shell when offline —
// which is how the borne runs day to day. Offline, fetch rejects at once, so the fallback is instant.
function networkFirst(request, key) {
  return fetch(request).then((res) => {
    if (res && res.status === 200 && res.type !== "opaque") {
      const clone = res.clone();
      caches.open(CACHE).then((c) => c.put(key || request, clone));
    }
    return res;
  }).catch(() => caches.match(key || request));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin

  // Kiosk page navigations -> network-first, cached shell as the offline fallback.
  if (req.mode === "navigate" && url.pathname.startsWith("/evenement")) {
    event.respondWith(networkFirst(req, "/evenement/"));
    return;
  }
  // Kiosk media + immutable Next static assets -> cache-first.
  if (
    url.pathname.startsWith("/etafat/evenement/") ||
    url.pathname.startsWith("/vendor/") ||
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
