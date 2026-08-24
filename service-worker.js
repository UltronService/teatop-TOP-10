/**
 * Teatop TOP10 Service Worker
 * 離線優先快取策略 + 自動版本更新
 */

const CACHE_VERSION = 'v1.2.0';
const CACHE_NAME = `teatop-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './assets/images.js',
  './data/regions.json',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log(`[SW] 安裝 ${CACHE_NAME}`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 快取核心資源...');
        
        return Promise.allSettled(
          ASSETS_TO_CACHE.map((url) => 
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                } else {
                  console.warn(`[SW] 快取失敗 (${response.status}): ${url}`);
                }
              })
              .catch((error) => {
                console.warn(`[SW] 快取異常: ${url}`, error);
              })
          )
        );
      })
      .then(() => {
        console.log('[SW] 快取完成，開始激活');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] 安裝失敗:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log(`[SW] 啟用 ${CACHE_NAME}`);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('teatop-') && name !== CACHE_NAME)
            .map((name) => {
              console.log(`[SW] 刪除舊快取: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`[SW] 命中快取: ${url.pathname}`);
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log(`[SW] 快取新資源: ${url.pathname}`);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error(`[SW] 網路請求失敗: ${url.pathname}`, error);
            
            if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
              return caches.match('./index.html')
                .then((response) => response || createOfflineFallback());
            }
            
            return createOfflineFallback();
          });
      })
  );
});

function createOfflineFallback() {
  return new Response(
    `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Teatop TOP10</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; }
    body { 
      width: 100vw; 
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      color: #333;
    }
    .offline-msg {
      text-align: center;
      padding: 40px;
      border: 2px solid #ec6f09;
      border-radius: 8px;
      background: #fffbf7;
    }
    h1 { font-size: 24px; margin-bottom: 10px; color: #ec6f09; }
    p { font-size: 16px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="offline-msg">
    <h1>⚠️ 網路未連接</h1>
    <p>請連接網路並重試</p>
  </div>
</body>
</html>`,
    { 
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
      statusText: 'Service Unavailable'
    }
  );
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
