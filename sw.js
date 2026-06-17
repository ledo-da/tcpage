const CACHE_NAME = 'teacher-call-v1';
const ASSETS = [
  './receiver.html',
  './receiver-style.css',
  './receiver-script.js',
  './sender.html',
  './sender-style.css',
  './sender-script.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
