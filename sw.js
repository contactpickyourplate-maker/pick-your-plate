self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Pick Your Plate', {
      body: data.body || "Your menu is ready — go pick your plate!",
      icon: '/platey_icon_pwa.png',
      badge: '/platey_icon_pwa.png',
      tag: 'menu-ready',
      renotify: true,
      data: { url: data.url || '/prototype.html' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/prototype.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('prototype.html') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(target);
    })
  );
});
