/* ETAFAT VR (Quest) — offline service worker. Precache the whole experience so it
   runs with no network after the first online launch. Bump CACHE to force refresh. */
const CACHE = "etafat-vr-v19";
const PRECACHE = [
  "./index.html",
  "./app.js",
  "./vendor/three.module.js",
  "./vendor/VRButton.js",
  "./vendor/jsm/loaders/GLTFLoader.js",
  "./vendor/jsm/utils/BufferGeometryUtils.js",
  "./vendor/jsm/utils/SkeletonUtils.js",
  // living landscape: real relief + CC0 survey crew
  "./world.js",
  "./terrain/dem.bin",
  "./terrain/dem.json",
  "./models/worker.glb",
  "./models/woman.glb",
  "./earth.png",
  "./countries-id.png",
  // country banners (flag × landmark) shown in the globe pop-ups
  ...[504, 384, 686, 478, 324, 624, 854, 178, 148, 788, 466, 430, 288, 768, 566, 266, 24, 180, 508, 108, 204, 270, 250, 300, 634, 784, 682, 608, 170].map((iso) => `/etafat/presence/banners/${iso}.jpg`),
  "./presence-xr.json",
  "./sections-xr.json",
  "./chiffres-xr.json",
  "./manifest.webmanifest",
  "/etafat/logo-footer.png",
  "/etafat/evenement/icon-192.png",
  "/etafat/evenement/icon-512.png",
  // project photos shown in the theme pop-ups (placeholders until real ones land)
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
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(new Request(u, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin
  // cache-first for everything under our scope + the shared icons
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const clone = res.clone(); caches.open(CACHE).then((c) => c.put(req, clone));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
