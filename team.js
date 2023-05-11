//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
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
        var stats = {
          '2P': 0,
          '!2P': 0,
          '3P': 0,
          '!3P': 0,
          'FT': 0,
          '!FT': 0,
          'ORB': 0,
          'DRB': 0,
          'AST': 0,
          'STL': 0,
          'TO': 0,
          'BLK': 0,
          'PF': 0
        };
        var gameIds = [];
        plays.forEach(function(play) {
          if (stats[play.type] !== undefined) {
            stats[play.type]++;
          }
          if (gameIds.indexOf(play.game) == -1) {
            gameIds.push(play.game);
          }
        });

        var gp = gameIds.length;
        if (gp > 0) {
          const item = document.createElement('div');
          item.style.gridColumn = 1;
          item.innerHTML = '#' + player.number + ' ' + player.name;
          grid.append(item);
          var pts = stats['2P'] * 2 + stats['3P'] * 3 + stats['FT'];
          var fgm = stats['2P'] + stats['3P'];
          var fga = stats['2P'] + stats['!2P'] + stats['3P'] + stats['!3P'];
          for (var i = 0; i < 21; i++) {
            const item = document.createElement('div');
            switch (i) {
              case 0:
                item.innerHTML = gp;
                break;
              case 1:
                item.innerHTML = Math.round(10 * pts / gp) / 10;
                break;
              case 2:
                item.innerHTML = Math.round(10 * fgm / gp) / 10;
                break;
              case 3:
                item.innerHTML = Math.round(10 * fga / gp) / 10;
                break;
              case 4:
                if (fga > 0) {
                  var pct = Math.round(100 * fgm / fga);
                  item.innerHTML = pct + '%';
                } else {
                  item.innerHTML = '-';
                }
                break;
              case 5:
                item.innerHTML = Math.round(10 * stats['3P'] / gp) / 10;
                break;
              case 6:
                item.innerHTML = Math.round(10 * (stats['3P'] + stats['!3P']) / gp) / 10;
                break;
              case 7:
                if ((stats['3P'] + stats['!3P']) > 0) {
                  var pct = Math.round(100 * stats['3P'] / (stats['3P'] + stats['!3P']));
                  item.innerHTML = pct + '%';
                } else {
                  item.innerHTML = '-';
                }
                break;
              case 8:
                item.innerHTML = Math.round(10 * stats['FT'] / gp) / 10;
                break;
              case 9:
                item.innerHTML = Math.round(10 * (stats['FT'] + stats['!FT']) / gp) / 10;
                break;
              case 10:
                if ((stats['FT'] + stats['!FT']) > 0) {
                  var pct = Math.round(100 * stats['FT'] / (stats['FT'] + stats['!FT']));
                  item.innerHTML = pct + '%';
                } else {
                  item.innerHTML = '-';
                }
                break;
              case 11:
                item.innerHTML = Math.round(10 * stats['ORB'] / gp) / 10;
                break;
              case 12:
                item.innerHTML = Math.round(10 * stats['DRB'] / gp) / 10;
                break;
              case 13:
                item.innerHTML = Math.round(10 * (stats['ORB'] + stats['DRB']) / gp) / 10;
                break;
              case 14:
                item.innerHTML = Math.round(10 * stats['AST'] / gp) / 10;
                break;
              case 15:
                item.innerHTML = Math.round(10 * stats['STL'] / gp) / 10;
                break;
              case 16:
                item.innerHTML = Math.round(10 * stats['TO'] / gp) / 10;
                break;
              case 17:
                item.innerHTML = Math.round(10 * stats['BLK'] / gp) / 10;
                break;
              case 18:
                item.innerHTML = Math.round(10 * stats['PF'] / gp) / 10;
                break;
              case 19:
                item.innerHTML = Math.round(10 * (pts + stats['ORB'] + stats['DRB'] + stats['AST'] + stats['STL'] + stats['BLK'] - stats['!2P'] - stats['!3P'] - stats['!FT'] - stats['TO']) / gp) / 10;
                break;
              }
            grid.append(item);
          }
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