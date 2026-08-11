const CACHE_NAME = "mwanafunzi-cache-v1";
const ASSETS_TO_CACHE = [
  "/",             // root
  "/index.html",   // entry
  "/index.css",    // styles
  "/src/main.jsx", // your main bundle
];

// Install event → cache files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event → cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event → serve cached assets if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          console.log("[ServiceWorker] Offline, serving fallback if available");
        })
      );
    })
  );
});
