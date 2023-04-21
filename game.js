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
        // add all active team players to the bench
        players.forEach(function(player) {
          if (player.active) {
            onBench.push(player);
          }
        });
        const playStore = transaction.objectStore('plays');
        const gamePlayIndex = playStore.index('game');
        gamePlayIndex.getAll(Number(gameId)).onsuccess = function(event) {
          plays = event.target.result;
          const list = document.querySelector('#playList');
          plays.forEach(function(play) {
            processPlay(play);
          });

          // for testing -->
          while (onBench.length > 0 && inGame.length < 5) {
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
                // store play
                const transaction = db.transaction('plays', 'readwrite');
                const playStore = transaction.objectStore('plays');
                playStore.add(play);
                // process play
                processPlay(play);
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
}

function processPlay(play) {
  const list = document.querySelector('#playList');
  const player = players.find(p => p.id == play.player);
  const item = document.createElement('li');
  switch (play.type) {
    case '2P':
      item.innerHTML = '<b>2P by #' + player.number + ' ' + player.name + '</b>';
      break;
    case '!2P':
      item.innerHTML = 'Missed 2P by #' + player.number + ' ' + player.name;
      break;
    case '3P':
      item.innerHTML = '<b>3P by #' + player.number + ' ' + player.name + '</b>';
      break;
    case '!3P':
      item.innerHTML = 'Missed 3P by #' + player.number + ' ' + player.name;
      break;
    case 'FT':
      item.innerHTML = '<b>FT by #' + player.number + ' ' + player.name + '</b>';
      break;
    case '!FT':
      item.innerHTML = 'Missed FT by #' + player.number + ' ' + player.name;
      break;
    case 'ORB':
      item.innerHTML = 'Offensive rebound by #' + player.number + ' ' + player.name;
      break;
    case 'DRB':
      item.innerHTML = 'Defensive rebound by #' + player.number + ' ' + player.name;
      break;
    case 'AST':
      item.innerHTML = 'Assist by #' + player.number + ' ' + player.name;
      break;
    case 'STL':
      item.innerHTML = 'Steal by #' + player.number + ' ' + player.name;
      break;
    case 'TO':
      item.innerHTML = 'Turnover by #' + player.number + ' ' + player.name;
      break;
    case 'BLK':
      item.innerHTML = 'Block by #' + player.number + ' ' + player.name;
      break;
    case 'PF':
      item.innerHTML = 'Personal foul by #' + player.number + ' ' + player.name;
      break;
    case 'IN':
      item.innerHTML = 'Substitute in #' + player.number + ' ' + player.name;
      // var index = onBench.findIndex(p => p.id == play.player);
      // inGame.push(onBench.splice(index, 1)[0]);
      break;
    case 'OUT':
      item.innerHTML = 'Substitute out #' + player.number + ' ' + player.name;
      // var index = inGame.findIndex(p => p.id == play.player);
      // onBench.push(inGame.splice(index, 1)[0]);
      break;
    default:
      item.innerHTML = 'UNKNOWN PLAY TYPE';
  }
  list.prepend(item);
}