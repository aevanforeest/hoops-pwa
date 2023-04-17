var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');
  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + teamId + '#players');
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?id=' + teamId + '#players');
}

function savePlayer() {
  const playerName = document.querySelector('#playerName').value;
  const playerNumber = document.querySelector('#playerNumber').value;
  const isActive = document.querySelector('#isActive').checked;
  if (playerName == '' || playerNumber == '') {
    return false;
  }

  const player = {
    'name': playerName,
    'number': playerNumber,
    'active': isActive,
    'team': Number(teamId),
  };

  const transaction = db.transaction('players', 'readwrite');
  const playersStore = transaction.objectStore('players');
  playersStore.add(player);
  return true;
}