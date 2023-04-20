var db;

var game, team, players, plays;
var inGame = [], onBench = [];

var playType;

function renderPage(db, params) {
  this.db = db;

  const gameId = params.get('id');
  const transaction = db.transaction(['games', 'teams', 'players', 'plays'], 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    game = event.target.result;
    const teamStore = transaction.objectStore('teams');
    teamStore.get(Number(game.team)).onsuccess = function(event) {
      team = event.target.result;
      const playerStore = transaction.objectStore('players');
      const teamPlayerIndex = playerStore.index('team');
      teamPlayerIndex.getAll(Number(team.id)).onsuccess = function(event) {
        players = event.target.result;
        players.forEach(function(player) {
          onBench.push(player);
        });
        const playStore = transaction.objectStore('plays');
        const gamePlayIndex = playStore.index('game');
        gamePlayIndex.getAll(Number(gameId)).onsuccess = function(event) {
          plays = event.target.result;
          const list = document.querySelector('#playList');
          plays.forEach(function(play) {
            console.log(play);
            const player = players.find(p => p.id == play.player);
            const item = document.createElement('li');
            switch (play.type) {
              case '2P':
                item.innerHTML = '2 points by #' + player.number + ' ' + player.name;
                break;
              case 'IN':
                item.innerHTML = 'Substitute in #' + player.number + ' ' + player.name;
                var index = onBench.findIndex(p => p.id == play.player);
                inGame.push(onBench.splice(index, 1)[0]);
                break;
              case 'OUT':
                item.innerHTML = 'Substitute out #' + player.number + ' ' + player.name;
                var index = inGame.findIndex(p => p.id == play.player);
                onBench.push(inGame.splice(index, 1)[0]);
                break;
              default:
                console.log('UNIMPLEMENTED ACTION TYPE');
            }
            list.prepend(item);
          });

          // for testing -->
          while (inGame.length < 5) {
            inGame.push(onBench.pop());
          }
          // <-- for testing
          inGame.sort((a, b) => Number(a.number) - Number(b.number));

          const container = document.querySelector('#inGame');
          for (var i = 0; i < 5; i++) {
            const button = document.createElement('button');
            if (i < inGame.length) {
              button.setAttribute('id', inGame[i].id);
              button.setAttribute('class', 'blue');
              button.innerHTML = '#' + inGame[i].number;
            } else {
              button.setAttribute('class', 'white');
            }
            button.onclick = function(e) {
              playerId = e.target.id;
              if (playType != null) {
                const play = {
                  'type': playType,
                  'game': Number(gameId),
                  'player': Number(playerId),
                };
                const transaction = db.transaction('plays', 'readwrite');
                const playStore = transaction.objectStore('plays');
                playStore.add(play);
                playType = null;
              }
            }
            container.append(button);
          }
        }
      };
      document.querySelector(game.home ? '#homeTeam' : '#awayTeam').innerHTML = team.name;
    };
    document.querySelector(game.home ? '#awayTeam' : '#homeTeam').innerHTML = game.name;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
    document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
  };

  const playButtons = document.querySelectorAll('button.green[id], button.red[id], button.grey[id]');
  playButtons.forEach(function(button) {
    button.onclick = function(e) {
      playType = e.target.id;
    }
  });

/*
  const transaction = db.transaction(['teams', 'games', 'plays'], 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    const game = event.target.result;
    document.querySelector(!game.home ? '#homeTeam' : '#awayTeam').innerHTML = game.name;
    const teamId = game.team;
    const teamStore = transaction.objectStore('teams');
    teamStore.get(Number(teamId)).onsuccess = function(event) {
      const team = event.target.result;
      document.querySelector(game.home ? '#homeTeam' : '#awayTeam').innerHTML = team.name;
      document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
      document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
      };
  };
*/
/*
  // Plays page
  const playStore = transaction.objectStore('plays');
  const playGameIndex = playStore.index('game');
  playGameIndex.getAll(Number(gameId)).onsuccess = function(event) {
    const plays = event.target.result;
    const list = document.querySelector('ul#playList');
    plays.forEach(function(play) {
      const item = document.createElement('li');
      item.innerHTML = play.type + play.player;
      list.append(item);
    });
  };

  updateScore();

  const statButtons = document.querySelectorAll('button.made[id], button.missed[id], button.stat[id]');
  statButtons.forEach(function(button) {
    button.onclick = function(e) {
      playType = e.target.id;
    }
  });

  const teamButtons = document.querySelectorAll('button.team[id]');
  teamButtons.forEach(function(button) {
    button.onclick = function(e) {
      playerId = e.target.id;
      if (playType != null) {
        const play = {
          'type': playType,
          'game': Number(gameId),
          'player': Number(playerId),
        };
        const transaction = db.transaction('plays', 'readwrite');
        const playStore = transaction.objectStore('plays');
        playStore.add(play);
        if (playType == '2P' || playType == '3P' || playType == 'FT') {
          updateScore();
        }
        const list = document.querySelector('ul#playList');
        const item = document.createElement('li');
        item.innerHTML = play.type + play.player;
        list.append(item);
        playType = null;
      }
    }
  });

  const subButtons = document.querySelectorAll('div#substituteDialog button.team');
  subButtons.forEach(function(button) {
    button.onclick = function(e) {
      if (e.target.classList.contains('bench')) {
        e.target.classList.remove('bench');
      } else {
        e.target.classList.add('bench');
      }
      e.stopPropagation();
    }
  });
*/
}
/*
function updateScore() {
  var teamScore = 0, opponentScore = 0;
  const transaction = db.transaction('plays', 'readonly');
  const playStore = transaction.objectStore('plays');
  const playGameIndex = playStore.index('game');
  playGameIndex.getAll(Number(gameId)).onsuccess = function(event) {
    const plays = event.target.result;
    plays.forEach(function(play) {
      var score = 0;
      if (play.type == '2P') {
        score = 2;
      } else if (play.type == '3P') {
        score = 3;
      } else if (play.type == 'FT') {
        score = 1;
      }
      if (score) {
        if (Number(play.player)) {
          teamScore += score;
        } else {
          opponentScore += score;
        }
      }
    });
    console.log(teamScore, opponentScore);
  }
}

function showSubstituteDialog() {
  document.querySelector('#substituteDialog').style.display = 'block';
}

function hideSubstituteDialog() {
  document.querySelector('#substituteDialog').style.display = 'none';
}
*/

function page(db, params) {
  var gameId = params.get('id');

  var game, team, players, plays;
  var inGame = [], onBench = [];

  const transaction = db.transaction(['games', 'teams', 'players', 'plays'], 'readonly');
  const gameStore = transaction.objectStore('games');
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    game = event.target.result;
    const teamStore = transaction.objectStore('teams');
    teamStore.get(Number(game.team)).onsuccess = function(event) {
      team = event.target.result;
      const playerStore = transaction.objectStore('players');
      const teamPlayerIndex = playerStore.index('team');
      teamPlayerIndex.getAll(Number(team.id)).onsuccess = function(event) {
        players = event.target.result;
        players.forEach(function(player) {
          onBench.push(player);
        });
        const playStore = transaction.objectStore('plays');
        const gamePlayIndex = playStore.index('game');
        gamePlayIndex.getAll(Number(gameId)).onsuccess = function(event) {
          plays = event.target.result;
          const list = document.querySelector('#playList');
          plays.forEach(function(play) {
            const item = document.createElement('li');
            switch (play.type) {
              case '2P':
                li.innerHTML = '2 points by #' + player.number + ' ' + player.name;
                break;
              case 'IN':
                li.innerHTML = 'Substitute in #' + player.number + ' ' + player.name;
                var index = onBench.findIndex(p => p.id == play.player);
                inGame.push(onBench.splice(index, 1));
                break;
              case 'OUT':
                li.innerHTML = 'Substitute out #' + player.number + ' ' + player.name;
                var index = inGame.findIndex(p => p.id == play.player);
                onBench.push(inGame.splice(index, 1));
                break;
            }
            list.prepend(li);
          });
        }
      };
    };
  };
}