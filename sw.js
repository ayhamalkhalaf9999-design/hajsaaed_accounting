// sw.js - Service Worker لدعم العمل دون إنترنت
const CACHE_NAME = 'hajsaaed-accounting-v3';
const urlsToCache = [
  '/hajsaaed_accounting/',
  '/hajsaaed_accounting/index.html',
  '/hajsaaed_accounting/style.css',
  '/hajsaaed_accounting/app.js',
  '/hajsaaed_accounting/manifest.json',
  '/hajsaaed_accounting/logo.png'       // ✅ تمت إضافة الشعار
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// استراتيجية "الشبكة أولاً" مع fallback إلى الكاش
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // إذا نجح الجلب من الشبكة، نخزن النسخة الجديدة في الكاش
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // إذا فشل الاتصال، نقدم الملف من الكاش
        return caches.match(event.request);
      })
  );
});
