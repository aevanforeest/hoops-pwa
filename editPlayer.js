//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
var db;
var playerId, teamId;

function renderPage(db, params) {
  this.db = db;
  playerId = params.get('id');
  const transaction = db.transaction('players', 'readonly');
  const playerStore = transaction.objectStore('players');
  playerStore.get(Number(playerId)).onsuccess = function(event) {
    const player = event.target.result;
    teamId = player.team;
    document.querySelector('#playerName').value = player.name;
    document.querySelector('#playerNumber').value = player.number;
    document.querySelector('#isActive').checked = player.active;
    document.querySelector('header > div.left > a').setAttribute('href', 'player.html?id=' + playerId);
    document.querySelector('header > div.right > a').setAttribute('href', 'player.html?id=' + playerId);
    document.querySelector('#deletePlayer').setAttribute('href', 'team.html?id=' + teamId + '#players');
  };
}

function savePlayer() {
  const playerName = document.querySelector('#playerName').value;
  const playerNumber = document.querySelector('#playerNumber').value;
  const isActive = document.querySelector('#isActive').checked;
  if (playerName == '' || playerNumber == '') {
    return false;
  }

  const player = {
    'id': Number(playerId),
    'name': playerName,
    'number': playerNumber,
    'active': isActive,
    'team': Number(teamId),
  };

  const transaction = db.transaction('players', 'readwrite');
  const playerStore = transaction.objectStore('players');
  playerStore.put(player);
  // return true;
  transaction.oncomplete = function() {
    location.replace('player.html?id=' + playerId);
  }
  return false;
}

function deletePlayer() {
  if (confirm('Delete player?')) {
    // delete dependencies
    const transaction = db.transaction('players', 'readwrite');
    const playerStore = transaction.objectStore('players');
    playerStore.delete(Number(playerId));
    // return true;
    transaction.oncomplete = function() {
      location.replace('team.html?id=' + teamId);
    }
    return false;
  }
  return false;
}