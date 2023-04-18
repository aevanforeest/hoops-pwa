var db;
var playerId;

function renderPage(db, params) {
  this.db = db;
  playerId = params.get('id');

  const transaction = db.transaction('players', 'readonly');
  const playerStore = transaction.objectStore('players');
  playerStore.get(Number(playerId)).onsuccess = function(event) {
    const player = event.target.result;
    document.querySelector('#playerName').innerHTML = player.name;
    document.querySelector('#playerNumber').innerHTML = '#' + player.number;
    document.querySelector('#isActive').innerHTML = player.active ? 'Active' : 'Inactive';
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + player.team + '#players');
    document.querySelector('header > div.right > a').setAttribute('href', 'editPlayer.html?id=' + player.id);
    };
}