// Receives notifications for the club app, even when the app is closed,
// and keeps a copy of the app on the phone so it still opens with no signal.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
importScripts('config.js');

firebase.initializeApp(self.CLUB_CONFIG.firebase);
firebase.messaging();   // shows notifications that arrive while the app is closed

var SHELL = 'club-app-v1';
var FILES = ['./', 'index.html', 'config.js', 'manifest.json', 'icon-192.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(FILES); }).catch(function () {}));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// The app's own files: always try the internet first (so updates show straight away),
// and fall back to the saved copy when there's no signal.
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(SHELL).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined) || Response.error();
    });
  }));
});

// Notifications the open app showed itself: tapping one brings the app to the front
self.addEventListener('notificationclick', function (event) {
  if (!(event.notification.data && event.notification.data.app)) return;
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ('focus' in list[i]) return list[i].focus();
    return clients.openWindow('./');
  }));
});
