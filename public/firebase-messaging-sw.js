// Firebase Cloud Messaging Service Worker for V.Ex Visão Exclusiva
// Handles background push notifications when the app is in background or closed

const CACHE_NAME = 'vex-fcm-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle FCM Push Event
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'V.Ex Visão Exclusiva', body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || '🔥 Novo Lead Captado • V.Ex';
  const body = data.body || data.notification?.body || 'Um cliente comentou na sua publicação e recebeu a DM com link do produto!';
  const icon = data.icon || data.notification?.icon || '/icon.svg';
  const tag = data.tag || 'vex-lead-notification-' + Date.now();

  const options = {
    body: body,
    icon: icon,
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    tag: tag,
    renotify: true,
    data: {
      url: data.data?.url || '/',
      leadId: data.data?.leadId || null,
      type: data.data?.type || 'lead'
    },
    actions: [
      {
        action: 'view_lead',
        title: 'Ver Lead'
      },
      {
        action: 'open_whatsapp',
        title: 'WhatsApp'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) {
          client.postMessage({
            type: 'FCM_NOTIFICATION_CLICK',
            action: action,
            data: event.notification.data
          });
          return client.focus();
        }
      }
      // Or open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
