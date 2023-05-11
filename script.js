const databaseName = 'HOOPS_DB';

function renderPage() {}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('serviceWorker.js')
        .catch(err => console.log('[service worker]', err));
    });
  }

  const params = new URLSearchParams(window.location.search);
  var request = self.indexedDB.open(databaseName, 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    renderPage(db, params);
  }
  
  request.onerror = function(event) {
    console.log('[onerror]', request.error);
  }
  
  request.onupgradeneeded = function(event) {
    db = event.target.result;
    const teams = db.createObjectStore('teams', {keyPath: 'id', autoIncrement: true});
    const players = db.createObjectStore('players', {keyPath: 'id', autoIncrement: true});
    players.createIndex('team', 'team');
    const games = db.createObjectStore('games', {keyPath: 'id', autoIncrement: true});
    games.createIndex('team', 'team');
    const plays = db.createObjectStore('plays', {keyPath: 'id', autoIncrement: true});
    plays.createIndex('game', 'game');
    plays.createIndex('player', 'player');
  }
});

function navBar(e) {
  var node = e.parentNode;
  document.querySelector('nav li.selected').classList.remove('selected');
  node.classList.add('selected');
  document.querySelector('main div.page.selected').classList.remove('selected');
  var index = Array.prototype.indexOf.call(node.parentNode.children, node);
  document.querySelectorAll('main div.page')[index].classList.add('selected');
  // return false;
  return true;
}