var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');

  // Main page
  const transaction = db.transaction(['teams', 'players', 'games', 'plays'], 'readonly');
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
    players.sort((a, b) => Number(a.number) - Number(b.number));
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
    games.sort((a, b) => a.date.localeCompare(b.date));
    const list = document.querySelector('ul#gameList');
    games.forEach(function(game) {
      const item = document.createElement('li');
      item.innerHTML =
        '<a href="game.html?id=' + game.id + '">' + game.date + ' ' + game.name + '</a>';
      list.append(item);  
    });
  };

  // Stats page
  const playStore = transaction.objectStore('plays');
  const playPlayerIndex = playStore.index('player');
  const grid = document.querySelector('div#statGrid');
  playerTeamIndex.getAll(Number(teamId)).onsuccess = function(event) {
    const players = event.target.result;
    const list = document.querySelector('ul#playerList');
    players.sort((a, b) => Number(a.number) - Number(b.number));
    players.forEach(function(player) {
      playPlayerIndex.getAll(Number(player.id)).onsuccess = function(event) {
        const plays = event.target.result;
        //
        {
          const item = document.createElement('div');
          item.style.gridColumn = 1;
          item.innerHTML = '#' + player.number + ' ' + player.name;
          grid.append(item);
        }
        for (var i = 0; i < 19; i++) {
          const item = document.createElement('div');
          item.innerHTML = '0.0';
          grid.append(item);
        }
      }
    });
  }

  if (location.hash == '#games') {
    const node = document.querySelector('nav li:nth-of-type(2) > a');
    navBar(node);
  } else if (location.hash == '#stats') {
    const node = document.querySelector('nav li:nth-of-type(3) > a');
    navBar(node);
  }
}