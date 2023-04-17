var db;
var gameId;

function renderPage(db, params) {
  this.db = db;
  gameId = params.get('id');

  const transaction = db.transaction('games', 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    const game = event.target.result;
    document.querySelector('#opponentName').innerHTML = game.name;
    document.querySelector('#gameDate').innerHTML = game.date;
    document.querySelector('#isHomeGame').innerHTML = game.home ? 'Home game' : 'Away game';
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
    document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
    };
}