// v39: legacy offline-cache retirement for gated Pilot Academy pages.
// This service worker intentionally does not cache questions or tests.
self.addEventListener("install",event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith("ppl-testy-")).map(k=>caches.delete(k)));
  await self.clients.claim();
  await self.registration.unregister();
 })());
});
