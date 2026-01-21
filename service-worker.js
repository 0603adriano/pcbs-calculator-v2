const CACHE = "pcbs-v2-v1";
const CORE = [
    "./",
    "./index.html",
    "./app.webmanifest",
    "./service-worker.js",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        fetch(e.request).then((res) => {
            // atualiza cache com o que vier da rede (quando for GET)
            if (e.request.method === "GET") {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(e.request, copy));
            }
            return res;
        }).catch(() => caches.match(e.request))
    );
});
