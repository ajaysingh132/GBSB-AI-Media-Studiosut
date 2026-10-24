/* GBSB AI Media Studio Service Worker */
const CACHE_NAME = "gbsb-ai-media-v0.3.0";
const FILES_TO_CACHE = [
  "./", "./index.html", "./video.html", "./projects.html", "./storyboard.html", "./manifest.json",
  "./css/app.css", "./css/dashboard.css", "./css/video.css", "./css/projects.css", "./css/storyboard.css",
  "./js/app.js", "./js/dashboard.js", "./js/projects.js", "./js/video.js", "./js/video-player.js", "./js/storyboard.js"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("gbsb-ai-media-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
