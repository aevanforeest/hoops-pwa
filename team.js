function renderPage(db, params) {
  // Main page
  const teamKey = params.get('key');
  const transaction = db.transaction(['teams', 'players', 'games'], 'readonly');
  const teamStore = transaction.objectStore('teams');
  teamStore.get(Number(teamKey)).onsuccess = function(event) {
    const team = event.target.result;
    const span = document.querySelector('#teamName');
    span.innerHTML = team.name;
  };
  document.querySelector('header > div.right > a').setAttribute('href', 'editTeam.html?key=' + teamKey);
  document.querySelector('main > div#players > a').setAttribute('href', 'newPlayer.html?key=' + teamKey);
  document.querySelector('main > div#games > a').setAttribute('href', 'newGame.html?key=' + teamKey);

  // Players page
  {
    const playerStore = transaction.objectStore('players');
    const teamIndex = playerStore.index('team');
    teamIndex.getAllKeys(Number(teamKey)).onsuccess = function(event) {
      const playerKeys = event.target.result;
      const list = document.querySelector('ul#playerList');
      playerKeys.forEach(function(playerKey) {
        playerStore.get(Number(playerKey)).onsuccess = function(event) {
          const player = event.target.result;
          const item = document.createElement('li');
          item.innerHTML =
            '<a href="player.html?key=' + playerKey + '">' + player.number + ' ' + player.name + '</a>';
          list.append(item);  
        }
      });
    };
  }

  // Games page
  {
    const gameStore = transaction.objectStore('games');
    const teamIndex = gameStore.index('team');
    teamIndex.getAllKeys(Number(teamKey)).onsuccess = function(event) {
      const gameKeys = event.target.result;
      const list = document.querySelector('ul#gameList');
      gameKeys.forEach(function(gameKey) {
        gameStore.get(Number(gameKey)).onsuccess = function(event) {
          const game = event.target.result;
          const item = document.createElement('li');
          item.innerHTML =
            '<a href="game.html?key=' + gameKey + '">' + game.date + ' ' + game.name + '</a>';
          list.append(item);  
        }
      });
    };
  }
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