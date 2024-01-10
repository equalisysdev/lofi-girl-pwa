// https://timobechtel.de/111-challenge/create-a-pwa/

const cacheName = 'lofi-girl-cache-v1';
const offline_page = '/offline.html';
const filesToCache = ['/', '/style.css', offline_page, '/about.html'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(function(error) {
        return caches.match(offline_page).then(function(response) {
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // delete old caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(foundCacheName) {
          if (foundCacheName !== cacheName) {
            return caches.delete(foundCacheName);
          }
        })
      );
    })
  );
});