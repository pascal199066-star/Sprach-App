/**
 * Service Worker: App vollständig offline verfügbar halten.
 * Strategie: eigene Dateien aus dem Cache (stale-while-revalidate),
 * damit die App auch im Flugzeug oder ohne Empfang startet.
 */
const VERSION = 'v1';
const CACHE = `azaz-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/router.js',
  './js/store.js',
  './js/srs.js',
  './js/speech.js',
  './js/ui.js',
  './js/components.js',
  './js/lesson-engine.js',
  './js/views/home.js',
  './js/views/lesson.js',
  './js/views/practice.js',
  './js/views/alphabet.js',
  './js/views/phrases.js',
  './js/views/grammar.js',
  './js/views/dialogues.js',
  './js/views/more.js',
  './js/views/settings.js',
  './js/views/stats.js',
  './js/views/pronounce.js',
  './data/alphabet.js',
  './data/vocab.js',
  './data/grammar.js',
  './data/course.js',
  './data/dialogues.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon-32.png',
  './assets/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => hit || caches.match('./index.html'));
      return hit || net;
    })
  );
});
