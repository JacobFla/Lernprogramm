self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                "./main.css",
                "./assets/images/mathe.jpg",
                "./assets/images/it.jpg",
                "./assets/images/allgemein.jpg",
                "./assets/images/personen.jpg",
                "./assets/images/test_icon.png",
                "./assets/questions.json",
                "./manifest.json"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});