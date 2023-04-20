var db;
var gameId;

var playType;

function renderPage(db, params) {
  this.db = db;
  gameId = params.get('id');

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