import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// clean old assets
cleanupOutdatedCaches()

declare let self: ServiceWorkerGlobalScope
// self.__WB_MANIFEST is default injection point
precacheAndRoute(
  self.__WB_MANIFEST
)

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV) {
  allowlist = [/^\/$/]
}

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist }
))

const cacheEntries: RequestInfo[] = [
  'src/assets/logo-fifa-qatar-2022.png',
  'src/main.tsx',
  'vite.svg',
  'manifest.webmanifest'
]
// self.addEventListener('install', (ev) => {
//   ev.waitUntil(
//     caches.open('static-v1').then(async (cache) => {
//       return await cache.addAll(cacheEntries)
//     })
//   )
// })

self.addEventListener('fetch', (ev) => {
  console.log('ev', ev)
  if (ev.request.url.startsWith(self.location.origin)) {
    ev.respondWith(
      caches.match(ev.request).then((response) => {
        if (response !== undefined) {
          return response
        } else {
          return fetch(ev.request)
            .then((response) => {
              // response may be used only once
              // we need to save clone to put one copy in cache
              // and serve second one
              // const responseClone = response.clone()

              // caches.open('v1').then((cache) => {
              //   cache.put(ev.request, responseClone)
              // })
              return response
            })
        }
      })
    )
  }
})

self.skipWaiting()
clientsClaim()
