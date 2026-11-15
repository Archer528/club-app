// Receives notifications for the club app, even when the app is closed.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
importScripts('config.js');

firebase.initializeApp(self.CLUB_CONFIG.firebase);
firebase.messaging();   // shows notifications that arrive while the app is closed

// Notifications the open app showed itself: tapping one brings the app to the front
self.addEventListener('notificationclick', function (event) {
  if (!(event.notification.data && event.notification.data.app)) return;
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ('focus' in list[i]) return list[i].focus();
    return clients.openWindow('./');
  }));
});
