var db;
var gameId, teamId;

function renderPage(db, params) {
  this.db = db;
  gameId = params.get('id');
  const transaction = db.transaction('games', 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    const game = event.target.result;
    teamId = game.team;
    document.querySelector('#opponentName').value = game.name;
    document.querySelector('#gameDate').value = game.date;
    document.querySelector('#isHomeGame').checked = game.home;
    document.querySelector('header > div.left > a').setAttribute('href', 'game.html?id=' + gameId);
    document.querySelector('header > div.right > a').setAttribute('href', 'game.html?id=' + gameId);
    document.querySelector('#deleteGame').setAttribute('href', 'team.html?id=' + teamId + '#games');
  };
}

function saveGame() {
  const opponentName = document.querySelector('#opponentName').value;
  const gameDate = document.querySelector('#gameDate').value;
  const isHomeGame = document.querySelector('#isHomeGame').checked;
  if (opponentName == '' || gameDate == '') {
    return false;
  }

  const game = {
    'id': Number(gameId),
    'name': opponentName,
    'date': gameDate,
    'home': isHomeGame,
    'team': Number(teamId),
  };

  const transaction = db.transaction('games', 'readwrite');
  const gameStore = transaction.objectStore('games');
  gameStore.put(game);
  // return true;
  transaction.oncomplete = function() {
    location.replace('game.html?id=' + gameId);
  }
  return false;
}

function deleteGame() {
  if (confirm('Delete game?')) {
    // delete dependencies
    const transaction = db.transaction('games', 'readwrite');
    const gameStore = transaction.objectStore('games');
    gameStore.delete(Number(gameId));
    // return true;
    transaction.oncomplete = function() {
      location.replace('team.html?id=' + teamId + '#games');
    }
    return false;
  }
  return false;
}