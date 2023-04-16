function renderPage(db, params) {
  // Main page
  const teamId = params.get('id');
  const transaction = db.transaction(['teams', 'players', 'games'], 'readonly');
  const teamStore = transaction.objectStore('teams');
  teamStore.get(Number(teamId)).onsuccess = function(event) {
    const team = event.target.result;
    const span = document.querySelector('#teamName');
    span.innerHTML = team.name;
  };
  document.querySelector('header > div.right > a').setAttribute('href', 'editTeam.html?id=' + teamId);
  document.querySelector('main > div#players > a').setAttribute('href', 'newPlayer.html?id=' + teamId);
  document.querySelector('main > div#games > a').setAttribute('href', 'newGame.html?id=' + teamId);

  // Players page
  const playerStore = transaction.objectStore('players');
  const playerTeamIndex = playerStore.index('team');
  playerTeamIndex.getAll(Number(teamId)).onsuccess = function(event) {
    const players = event.target.result;
    const list = document.querySelector('ul#playerList');
    players.forEach(function(player) {
      const item = document.createElement('li');
      item.innerHTML =
        '<a href="player.html?id=' + playerId + '">' + player.number + ' ' + player.name + '</a>';
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
}

function navBar(e) {
  var node = e.parentNode;
  document.querySelector('nav .selected').classList.remove('selected');
  node.classList.add('selected');
  document.querySelector('main > div.selected').classList.remove('selected');
  var index = Array.prototype.indexOf.call(node.parentNode.children, node);
  console.log(index);
  document.querySelector('main > div:nth-of-type(' + (index + 1) + ')').classList.add('selected');
  return false;
}
