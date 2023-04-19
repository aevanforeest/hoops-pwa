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
    document.querySelector('#gameDate').innerHTML = game.date;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
    document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
    const teamStore = transaction.objectStore('teams');
    teamStore.get(Number(teamId)).onsuccess = function(event) {
      const team = event.target.result;
      const gameTitle = game.home ? team.name + ' - ' + game.name : game.name + ' - ' + team.name;
      document.querySelector('#gameTitle').innerHTML = gameTitle;
    };
  };
}