import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({request}) => request.mode === 'navigate',
  createHandlerBoundToURL('/index.html')
);

registerRoute(
  ({url}) => url.pathname.startsWith('/calculators'),
  new StaleWhileRevalidate()
);

self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-outbox') {
    e.waitUntil((async ()=>{
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const c of clients) c.postMessage({ type: 'REQUEST_SYNC_OUTBOX' });
    })());
  }
});
