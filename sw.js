const VERSION = 'V3'
const CACHE_NAME = `todo-app-${VERSION}`

const APP_SHELL = [
    '/src/offline.html',
    '/src/main.tsx', // Adjust based on your Vite entry point
    '/src/App.css'
]

self.addEventListener('install', (event) => {
    event.waitUntil((
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    ))

    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys
            .filter(key => key.startsWith('todo-app-') && key !== `${CACHE_NAME}-${VERSION}`)
            .map(key => caches.delete(key)))
        ))
    self.clients.claim()
})

function isNavigationRequest(request) {
    return request.mode === "navigation"
}

function isStaticAsset(request) {
    return request.destination === "script" || request.destination === "style" ||
        request.destination === "image" || request.destination === "font" || request
}


self.addEventListener('fetch', (event) => {
    const req = event.request
    const url = new URL(req.url)

    if (req.method !== 'GET') return
    // if (url.origin !== self.location.origin) return;


    if (isNavigationRequest(req)) {
        return event.respondWith(networkFirst(req))
    }

    if (isStaticAsset(req)) {
        return event.respondWith(cacheFirst(req))
    }

    if (url.pathname.startsWith('/api/')) {
        return event.respondWith(networkFirst(req))
    }
})


async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)

    if (cached) return cached

    const res = await fetch(request)

    if (res.ok) {
        await cache.put(request, res.clone())
    }
    return res
}

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME)
    try {

        const res = await fetch(request)

        if (res.ok) {
            await cache.put(request, res.clone())
        }

        return res
    }
    catch (err) {
        const cached = await cache.match(request)
        return cached || new Response(JSON.stringify({ error: "Offline and no cached data" }),
            { status: 503, headers: { 'Content-Type': "application/json" } })
    }

}

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME)
    try {
        const res = await fetch(request)
        if (res.ok) {
            await cache.put(request, res.clone())
        }
        return res
    } catch (err) {
        // For navigation requests, fall back to cached index.html
        const cached = await cache.match('/src/offline.html')
        return cached || new Response(JSON.stringify({ error: "Offline and no cached data" }),
            { status: 503, headers: { 'Content-Type': "application/json" } })
    }
}