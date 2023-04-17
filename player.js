var db;
var playerId;

function renderPage(db, params) {
  this.db = db;
  playerId = params.get('id');

  // Main page
  const transaction = db.transaction(['teams', 'players', 'games'], 'readonly');
  const playerStore = transaction.objectStore('players');
  playerStore.get(Number(playerId)).onsuccess = function(event) {
    const player = event.target.result;
    document.querySelector('#playerName').innerHTML = player.name;
    document.querySelector('#playerNumber').innerHTML = '#' + player.number;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + player.team);
    document.querySelector('header > div.right > a').setAttribute('href', 'editPlayer.html?id=' + player.id);
    };
}

// function navBar(e) {
//   var node = e.parentNode;
//   document.querySelector('nav .selected').classList.remove('selected');
//   node.classList.add('selected');
//   document.querySelector('main > div.selected').classList.remove('selected');
//   var index = Array.prototype.indexOf.call(node.parentNode.children, node);
//   document.querySelector('main > div:nth-of-type(' + (index + 1) + ')').classList.add('selected');
//   return false;
// }