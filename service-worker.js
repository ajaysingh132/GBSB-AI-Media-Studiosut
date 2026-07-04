/*
=========================================================
GBSB AI Media Studio
Version : 0.1.0 Alpha
Module  : Service Worker
License : MIT
=========================================================
*/

const CACHE_NAME = "gbsb-ai-media-v0.1.0";

const FILES_TO_CACHE = [

  "./",

  "./index.html",

  "./manifest.json",

  "./css/app.css",

  "./css/dashboard.css",

  "./js/app.js",

  "./js/dashboard.js"

];

/* Install */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(FILES_TO_CACHE))

    );

});

/* Activate */

self.addEventListener("activate", event => {

    event.waitUntil(

        self.clients.claim()

    );

});

/* Fetch */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});
