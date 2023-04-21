const cacheName = 'HOOPS_CACHE';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
      'index.html',
      'justkeepstats.png',
      'style.css',
      'script.js',
      'teams.html',
      'teams.js',
      'team.html',
      'team.js',
      'newTeam.html',
      'newTeam.js',
      'editTeam.html',
      'editTeam.js',
      'player.html',
      'player.js',
      'newPlayer.html',
      'newPlayer.js',
      'editPlayer.html',
      'editPlayer.js',
      'game.html',
      'game.js',
      'newGame.html',
      'newGame.js',
      'editGame.html',
      'editGame.js'
    ]))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
    .then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});