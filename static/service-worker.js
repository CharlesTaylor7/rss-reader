const APP_VERSION = "20";
const ASSETS = ["/manifest.json", "/pwa-icon.webp"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_VERSION).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== APP_VERSION) {
            return caches.delete(key);
          }
        }),
      )
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
