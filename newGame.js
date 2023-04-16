var db;
var teamKey;

function renderPage(db, params) {
  this.db = db;
  teamKey = params.get('key');

  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?key=' + teamKey);
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?key=' + teamKey);
}

function saveGame() {
  const opponentName = document.querySelector('#opponentName').value;
  const gameDate = document.querySelector('#gameDate').value;
  if (opponentName == '' || gameDate == '') {
    return false;
  }

  const game = {
    'name': opponentName,
    'date': gameDate,
    'home': true, // TODO
    'team': Number(teamKey),
  };

  const transaction = db.transaction('games', 'readwrite');
  const gameStore = transaction.objectStore('games');
  gameStore.add(game);
  return true;
}