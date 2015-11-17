var CACHE_NAME = 'v{{ version }}';
var urlsToCache = [
  '/',
  {% for file in files %}'{{ file }}'{% if not loop.last %}, {% endif %}
  {% endfor %}
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache: ' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(cname) {
          if (cname != CACHE_NAME) {
            console.log('Clearing Cache: ', cname);
            return caches.delete(cname);
          }
        })
      );
    })
  );
});