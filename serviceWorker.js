const staticHoops = 'hoops-v1';

const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/teams.html',
  '/teams.js',
  '/team.html',
  '/team.js',
  '/newTeam.html',
  '/newTeam.js',
  '/editTeam.html',
  '/editTeam.js',
  '/player.html',
  '/player.js',
  '/newPlayer.html',
  '/newPlayer.js',
  '/editPlayer.html',
  '/editPlayer.js',
  '/game.html',
  '/game.js',
  '/newGame.html',
  '/newGame.js',
  '/editGame.html',
  '/editGame.js',
];

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticHoops).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
