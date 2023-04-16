function renderPage() {}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .catch(err => console.log('[service worker]', err));
    });
  }

  self.indexedDB.delete('HOOPS_DB');

  const params = new URLSearchParams(window.location.search);
  var request = self.indexedDB.open('HOOPS_DB', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    renderPage(db, params);
  }
  
  request.onerror = function(event) {
    console.log('[onerror]', request.error);
  }
  
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const teams = db.createObjectStore('teams', {keyPath: 'id', autoIncrement: true});
    const players = db.createObjectStore('players', {keyPath: 'id', autoIncrement: true});
    players.createIndex('team', 'team');
    const games = db.createObjectStore('games', {keyPath: 'id', autoIncrement: true});
    games.createIndex('team', 'team');
  }
});
