// Clean passive PWA service worker with Push Notification support for Shree Aradhna Jewellers
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

// Passive fetch listener to satisfy PWA installability requirements without blocking network requests
self.addEventListener('fetch', (e) => {
  // Let browser handle network fetch normally
});

// Listen to background push events when the app is closed or open
self.addEventListener('push', (event) => {
  let payload = {
    title: '👑 Shree Aradhna Jewellers',
    body: 'Live Gold Rate Update! Check today\'s latest hallmarked rates and showroom offers.'
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = {
        title: '👑 Shree Aradhna Jewellers',
        body: event.data.text()
      };
    }
  }

  const options = {
    body: payload.body,
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Handle notification clicks (reopen or focus the app)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
