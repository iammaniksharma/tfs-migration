const CACHE_NAME = 'migration-guide-v1';
// The path must include your repository name
const APP_PREFIX = '/tfs-migration';

const ASSETS = [
  `${APP_PREFIX}/`,
  `${APP_PREFIX}/index.html`,
  `${APP_PREFIX}/manifest.json`,
  // Add your icons to the cache so they work offline
  `${APP_PREFIX}/icon-192.png`,
  `${APP_PREFIX}/icon-512.png`,
  // Caching the Google Fonts used in your CSS
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap'
];

// Install Event: Caches all the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Installing Cache: ' + CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event: Cleans up old caches if you update the version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Deleting old cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch Event: Offline Support
// Tries the network first, falls back to cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
