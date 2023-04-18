var db;
var gameId, teamId;

function renderPage(db, params) {
  this.db = db;
  gameId = params.get('id');

  const transaction = db.transaction(['teams', 'games'], 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    const game = event.target.result;
    teamId = game.team;
    document.querySelector(game.home ? '#awayTeam' : '#homeTeam').innerHTML = game.name;
    document.querySelector('#gameDate').innerHTML = game.date;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
    document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
    const teamStore = transaction.objectStore('teams');
    teamStore.get(Number(teamId)).onsuccess = function(event) {
      const team = event.target.result;
      document.querySelector(game.home ? '#homeTeam' : '#awayTeam').innerHTML = team.name;
    };
  };
}

function navBar(e) {
  var node = e.parentNode;
  document.querySelector('nav .selected').classList.remove('selected');
  node.classList.add('selected');
  document.querySelector('main > div.selected').classList.remove('selected');
  var index = Array.prototype.indexOf.call(node.parentNode.children, node);
  document.querySelector('main > div:nth-of-type(' + (index + 1) + ')').classList.add('selected');
  return false;
}