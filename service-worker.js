const CACHE_NAME = "ks.com-v1";

const cacheAssets = ["main.html", "main.js", "sub.html"]

console.log("started", self);
self.addEventListener("install", (event) => {
    console.log("Installed", event);
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                console.log("From service worker:caching files");
                cache.addAll(cacheAssets);
            })
            .then(() => {
                self.skipWaiting();
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Activated", event);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Cleaning up old cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("fetching cached content");
    event.respondWith(
        fetch(event.request)
            .then(res => {
                const copyCache = res.clone();
                caches.open(cacheName).then(cache => {
                    cache.put(event.request, copyCache);
                });
                return res;
            })
            .catch(error => caches.match(event.request).then(res => res))
    );
});

self.addEventListener("push", (event) => {
    console.log("Push message received", event)
});