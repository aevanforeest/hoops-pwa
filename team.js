var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');

  // Main page
  const transaction = db.transaction(['teams', 'players', 'games'], 'readonly');
  const teamStore = transaction.objectStore('teams');
  teamStore.get(Number(teamId)).onsuccess = function(event) {
    const team = event.target.result;
    document.querySelector('#teamName').innerHTML = team.name;
    document.querySelector('header > div.right > a').setAttribute('href', 'editTeam.html?id=' + teamId);
    document.querySelector('a#addPlayer').setAttribute('href', 'newPlayer.html?id=' + teamId);
    document.querySelector('a#addGame').setAttribute('href', 'newGame.html?id=' + teamId);
    };

  // Players page
  const playerStore = transaction.objectStore('players');
  const playerTeamIndex = playerStore.index('team');
  playerTeamIndex.getAll(Number(teamId)).onsuccess = function(event) {
    const players = event.target.result;
    const list = document.querySelector('ul#playerList');
    players.forEach(function(player) {
      const item = document.createElement('li');
      item.setAttribute('class', player.active ? 'active': 'inactive');
      item.innerHTML =
        '<a href="player.html?id=' + player.id + '">#' + player.number + ' ' + player.name + '</a>';
      list.append(item);  
    });
  };

  // Games page
  const gameStore = transaction.objectStore('games');
  const gameTeamIndex = gameStore.index('team');
  gameTeamIndex.getAll(Number(teamId)).onsuccess = function(event) {
    const games = event.target.result;
    const list = document.querySelector('ul#gameList');
    games.forEach(function(game) {
      const item = document.createElement('li');
      item.innerHTML =
        '<a href="game.html?id=' + game.id + '">' + game.date + ' ' + game.name + '</a>';
      list.append(item);  
    });
  };

  if (location.hash == '#games') {
    const node = document.querySelector('nav li:nth-of-type(2) > a');
    console.log(node);
    navBar(node);
  }
}