//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');
  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + teamId + '#games');
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?id=' + teamId + '#games');
}

function saveGame() {
  const opponentName = document.querySelector('#opponentName').value;
  const gameDate = document.querySelector('#gameDate').value;
  const isHomeGame = document.querySelector('#isHomeGame').checked;
  if (opponentName == '' || gameDate == '') {
    return false;
  }

  const game = {
    'name': opponentName,
    'date': gameDate,
    'home': isHomeGame,
    'team': Number(teamId),
  };

  const transaction = db.transaction('games', 'readwrite');
  const gameStore = transaction.objectStore('games');
  gameStore.add(game);
  // return true;
  transaction.oncomplete = function() {
    location.replace('team.html?id=' + teamId + '#games');
  }
  return false;
}