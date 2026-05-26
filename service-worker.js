// Incremented to v2 to completely wipe out the old locked cache
const CACHE_NAME = 'tt-pro-ultimate-v2';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the fresh code to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Blasts away the old v1 locked data
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
