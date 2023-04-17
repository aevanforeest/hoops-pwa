var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');
  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + teamId);
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?id=' + teamId);
}

function saveGame() {
  const opponentName = document.querySelector('#opponentName').value;
  const gameDate = document.querySelector('#gameDate').value;
  const isHomeGame = document.querySelector('#isHomeGame').checked;
  if (opponentName == '' || gameDate == '') {
    return false;
  }

  const game = {
    'name': opponentName,
    'date': gameDate,
    'home': isHomeGame,
    'team': Number(teamId),
  };

  const transaction = db.transaction('games', 'readwrite');
  const gameStore = transaction.objectStore('games');
  gameStore.add(game);
  return true;
}