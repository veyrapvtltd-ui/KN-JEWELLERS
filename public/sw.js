// Clean PWA service worker for Shree Aradhna Jewellers
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Passive fetch listener to satisfy PWA installability requirements
self.addEventListener('fetch', (e) => {
  // Let browser handle network fetch normally
});
