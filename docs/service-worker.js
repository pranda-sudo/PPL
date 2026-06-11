const CACHE_NAME = "ppl-testy-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/questions.js",
  "./data/questions.json",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/questions/AGK-002.jpg",
  "./assets/questions/AGK-003.jpg",
  "./assets/questions/AGK-005.jpg",
  "./assets/questions/AGK-006.jpg",
  "./assets/questions/AGK-007.jpg",
  "./assets/questions/AGK-008.jpg",
  "./assets/questions/AGK-009.jpg",
  "./assets/questions/AGK-010.jpg",
  "./assets/questions/AGK-011.jpg",
  "./assets/questions/AGK-012.jpg",
  "./assets/questions/CAP697_TABLE-2-2-3.jpg",
  "./assets/questions/HPL-002.jpg",
  "./assets/questions/LIFT_ALPHA.jpg",
  "./assets/questions/MET-001.jpg",
  "./assets/questions/MET-002.jpg",
  "./assets/questions/MET-003.jpg",
  "./assets/questions/MET-004.jpg",
  "./assets/questions/MET-005.jpg",
  "./assets/questions/NAV-002.jpg",
  "./assets/questions/NAV-004.jpg",
  "./assets/questions/NAV-014.jpg",
  "./assets/questions/NAV-017.jpg",
  "./assets/questions/NAV-019.jpg",
  "./assets/questions/NAV-022.jpg",
  "./assets/questions/NAV-024.jpg",
  "./assets/questions/NAV-031.jpg",
  "./assets/questions/OPR-001.jpg",
  "./assets/questions/PFA-003.jpg",
  "./assets/questions/PFA-006.jpg",
  "./assets/questions/PFA-008.jpg",
  "./assets/questions/PFA-009.jpg",
  "./assets/questions/PFA-010.jpg",
  "./assets/questions/PFA-011.jpg",
  "./assets/questions/PFP-003.jpg",
  "./assets/questions/PFP-004.jpg",
  "./assets/questions/PFP-005.jpg",
  "./assets/questions/PFP-006.jpg",
  "./assets/questions/PFP-007.jpg",
  "./assets/questions/PFP-008.jpg",
  "./assets/questions/PFP-009.jpg",
  "./assets/questions/PFP-011.jpg",
  "./assets/questions/PFP-012.jpg",
  "./assets/questions/PFP-013.jpg",
  "./assets/questions/PFP-014.jpg",
  "./assets/questions/PFP-023.jpg",
  "./assets/questions/PFP-024.jpg",
  "./assets/questions/PFP-026.jpg",
  "./assets/questions/PFP-030.jpg",
  "./assets/questions/PFP-044.jpg",
  "./assets/questions/PFP-045.jpg",
  "./assets/questions/PFP-046.jpg",
  "./assets/questions/PFP-051.jpg",
  "./assets/questions/PFP-051A.jpg",
  "./assets/questions/PFP-052E.jpg",
  "./assets/questions/PFP-053E.jpg",
  "./assets/questions/PFP-056.jpg",
  "./assets/questions/PFP-061.jpg",
  "./assets/questions/PFP-062.jpg",
  "./assets/questions/PFP-063.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
