const CACHE_NAME = 'habits-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png'
];

// Установка — кешируем всё
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Активация — удаляем старый кеш
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Запросы — сначала кеш, потом сеть
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cached) => {
            return cached || fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
