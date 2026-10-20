// Clean PWA service worker with Web Push Notification support for Shree Aradhna Jewellers
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

// Background push notification listener (Delivered even when app/browser is CLOSED)
self.addEventListener('push', (event) => {
  let payload = {
    title: '👑 LIVE MARKET RATE UPDATE',
    body: 'Today\'s latest 22K Gold & Silver rates updated live at Shree Aradhna Jewellers!'
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [200, 100, 200],
    tag: payload.tag || 'saj-live-rate-alert',
    renotify: true,
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Handle notification click: focus existing window or open app
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
