//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
var db;

var game, team, players, plays;
var inGame = [], onBench = [];
var teamScore = 0, opponentScore = 0;

var playType;

function renderPage(db, params) {
  this.db = db;

  // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  // var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;

  // const recognition = new SpeechRecognition();
  // if (SpeechGrammarList) {
  //   const grammar = '#JSGF V1.0; grammar plays; public <play> = <type> <player>; <type> = (two | three) points [missed] | free throw [missed] | (offensive | defensive) rebound | assist | steal | turnover | block | personal foul; <player> = <number> | opponent; <number> = zero | one | two | three | four | five | six | seven | eight | nine | ten | eleven | twelve | thirteen | fourteen | fifteen | sixteen | seventeen | eighteen | nineteen | twenty';
  //   const grammarList = new SpeechGrammarList();
  //   grammarList.addFromString(grammar, 1);
  //   recognition.grammars = grammarList;
  // }
  // recognition.continuous = true;
  // recognition.lang = 'en-US';
  // recognition.interimResults = false;
  // recognition.maxAlternatives = 0;
  // recognition.onstart = () => { console.log('onstart'); };
  // recognition.onend = () => { console.log('onend'); };
  // recognition.onerror = () => { console.log('onerror'); };
  // recognition.onresult = (event) => {
  //   var transcript = '';
  //   for (var i = event.resultIndex; i < event.results.length; i++) {
  //     if (event.results[i].isFinal) {
  //       transcript += event.results[i][0].transcript;
  //     }
  //   }
  //   // process voice command
  //   console.log(transcript);
  // }

  const gameId = params.get('id');
  const transaction = db.transaction(['games', 'teams', 'players', 'plays'], 'readonly');
  const gameStore = transaction.objectStore('games');
  // get game from DB
  gameStore.get(Number(gameId)).onsuccess = function(event) {
    game = event.target.result;
    const teamStore = transaction.objectStore('teams');
    // get game team from DB
    teamStore.get(Number(game.team)).onsuccess = function(event) {
      team = event.target.result;
      const playerStore = transaction.objectStore('players');
      const teamPlayerIndex = playerStore.index('team');
      // get team players from DB
      teamPlayerIndex.getAll(Number(team.id)).onsuccess = function(event) {
        players = event.target.result;
        // add players to bench
        players.forEach(function(player) {
          if (player.active) {
            onBench.push(player);
          }
        });
        const playStore = transaction.objectStore('plays');
        const gamePlayIndex = playStore.index('game');
        // get game plays from DB
        gamePlayIndex.getAll(Number(gameId)).onsuccess = function(event) {
          plays = event.target.result;
          const list = document.querySelector('#playList');
          plays.forEach(function(play) {
            renderPlay(play);
            // process substitutes
            if (play.type == 'IN') {
              inGame.push(onBench.splice(onBench.findIndex(p => p.id == play.player), 1)[0]);
            } else if (play.type == 'OUT') {
              onBench.push(inGame.splice(inGame.findIndex(p => p.id == play.player), 1)[0]);
            }
          });
          updatePlayerButtons();
        }
      };
      document.querySelector(game.home ? '#homeTeam' : '#awayTeam').innerHTML = team.name;
    };
    document.querySelector(game.home ? '#awayTeam' : '#homeTeam').innerHTML = game.name;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + game.team + '#games');
    document.querySelector('header > div.right > a').setAttribute('href', 'editGame.html?id=' + game.id);
    document.querySelector('#substitute').onclick = showSubstituteDialog;
    document.querySelector('#opponent').onclick = function(e) {
      if (playType != null) {
        const play = {
          'type': playType,
          'game': Number(game.id),
          // 'player'
        };
        storePlay(play);
        playType = null;
      }
    }
    document.querySelector('#toggleMicrophone').onclick = function(e) {
      const d = document.querySelector('div.fab:has(#toggleMicrophone)');
      if (d.classList.contains('blue')) {
        d.classList.remove('blue');
        d.classList.add('red');
        // recognition.start();
      } else {
        d.classList.remove('red');
        d.classList.add('blue');
        // recognition.stop();
      }
    }
  };

  const playButtons = document.querySelectorAll('button.green[id], button.red[id], button.grey[id]');
  playButtons.forEach(function(button) {
    button.onclick = function(e) {
      playType = e.target.id;
    }
  });

  if (location.hash == '#plays') {
    const node = document.querySelector('nav li:nth-of-type(2) > a');
    navBar(node);
  } else if (location.hash == '#stats') {
    const node = document.querySelector('nav li:nth-of-type(3) > a');
    navBar(node);
  }
}

function updatePlayerButtons() {
  inGame.sort((a, b) => Number(a.number) - Number(b.number));
  const buttons = document.querySelectorAll('#inGame button');
  console.assert(buttons.length == 5);
  for (var i = 0; i < 5; i++) {
    const button = buttons[i];
    if (i < inGame.length) {
      button.setAttribute('id', inGame[i].id);
      button.setAttribute('class', 'blue');
      button.innerHTML = '#' + inGame[i].number;
    } else {
      button.removeAttribute('id');
      button.setAttribute('class', 'white');
      button.innerHTML = '';
    }
    button.onclick = function(e) {
      playerId = e.target.id;
      if (playType != null) {
        const play = {
          'type': playType,
          'game': Number(game.id),
          'player': Number(playerId),
        };
        storePlay(play);
        playType = null;
      }
    }
  }
}

function storePlay(play) {
    renderPlay(play);
    const transaction = db.transaction('plays', 'readwrite');
    const playStore = transaction.objectStore('plays');
    playStore.add(play);
    transaction.oncomplete = function() {
      //
    }
}

function renderPlay(play) {
  const list = document.querySelector('#playList');
  var who;
  if (play.player != undefined) {
    const player = players.find(p => p.id == play.player);
    who = '#' + player.number + ' ' + player.name;
  } else {
    who = 'opponent';
  }
  const item = document.createElement('li');
  switch (play.type) {
    case '2P':
      item.innerHTML = '<b>2P by ' + who + '</b>';
      teamScore += 2;
      break;
    case '!2P':
      item.innerHTML = 'Missed 2P by ' + who;
      break;
    case '3P':
      item.innerHTML = '<b>3P by ' + who + '</b>';
      teamScore += 3;
      break;
    case '!3P':
      item.innerHTML = 'Missed 3P by ' + who;
      break;
    case 'FT':
      item.innerHTML = '<b>FT by ' + who + '</b>';
      teamScore += 1;
      break;
    case '!FT':
      item.innerHTML = 'Missed FT by ' + who;
      break;
    case 'ORB':
      item.innerHTML = 'Offensive rebound by ' + who;
      break;
    case 'DRB':
      item.innerHTML = 'Defensive rebound by ' + who;
      break;
    case 'AST':
      item.innerHTML = 'Assist by ' + who;
      break;
    case 'STL':
      item.innerHTML = 'Steal by ' + who;
      break;
    case 'TO':
      item.innerHTML = 'Turnover by ' + who;
      break;
    case 'BLK':
      item.innerHTML = 'Block by ' + who;
      break;
    case 'PF':
      item.innerHTML = 'Personal foul by ' + who;
      break;
    case 'IN':
      item.innerHTML = 'Substitute in ' + who;
      break;
    case 'OUT':
      item.innerHTML = 'Substitute out ' + who;
      break;
  }
  list.prepend(item);
}

function showSubstituteDialog() {
  const dialog = document.querySelector('#substituteDialog');
  dialog.style.display = 'block';
  dialog.onclick = hideSubstituteDialog;
  const container = document.querySelector('#substituteDialog div');
  container.innerHTML = '';
  players.forEach(function(player) {
    if (player.active) {
      const button = document.createElement('button');
      button.setAttribute('id', player.id);
      if (inGame.findIndex(p => p.id == player.id) != -1) {
        button.setAttribute('class', 'blue');
      } else {
        button.setAttribute('class', 'white');
      }
      button.innerHTML = '#' + player.number;
      button.onclick = function(e) {
        var id = e.target.id;
        if (inGame.findIndex(p => p.id == id) != -1) {
          e.target.classList.remove('blue');
          e.target.classList.add('white');
          onBench.push(inGame.splice(inGame.findIndex(p => p.id == id), 1)[0]);
          const play = {
            'type': 'OUT',
            'game': Number(game.id),
            'player': Number(id),
          };
          storePlay(play);
        } else {
          e.target.classList.remove('white');
          e.target.classList.add('blue');
          inGame.push(onBench.splice(onBench.findIndex(p => p.id == id), 1)[0]);
          const play = {
            'type': 'IN',
            'game': Number(game.id),
            'player': Number(id),
          };
          storePlay(play);
        }
        e.stopPropagation();
      }
      container.append(button);
    }
  });
}

function hideSubstituteDialog(e) {
  console.assert(inGame.length == 5);
  updatePlayerButtons();
  const dialog = document.querySelector('#substituteDialog');
  dialog.style.display = 'none';
}