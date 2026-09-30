/* ETAFAT VR (Quest) — offline service worker. Precache the whole experience so it
   runs with no network after the first online launch. Bump CACHE to force refresh. */
const CACHE = "etafat-vr-v2";
const PRECACHE = [
  "./index.html",
  "./app.js",
  "./vendor/three.module.js",
  "./vendor/VRButton.js",
  "./earth.png",
  "./presence-xr.json",
  "./sections-xr.json",
  "./manifest.webmanifest",
  "/etafat/evenement/icon-192.png",
  "/etafat/evenement/icon-512.png",
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
