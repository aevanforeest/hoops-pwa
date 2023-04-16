var db;
var teamKey;

function renderPage(db, params) {
  this.db = db;
  teamKey = params.get('key');

  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?key=' + teamKey);
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?key=' + teamKey);
}

function savePlayer() {
  const playerName = document.querySelector('#playerName').value;
  const playerNumber = document.querySelector('#playerNumber').value;
  if (playerName == '' || playerNumber == '') {
    return false;
  }

  const player = {
    'name': playerName,
    'number': playerNumber,
    'team': Number(teamKey),
  };

  const transaction = db.transaction('players', 'readwrite');
  const playersStore = transaction.objectStore('players');
  playersStore.add(player);
  return true;
}