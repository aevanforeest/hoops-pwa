//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
var db;

function renderPage(db) {
  this.db = db;
}

function saveTeam() {
  const teamName = document.querySelector('#teamName').value;
  if (teamName == '') {
    return false;
  }

  const team = {
    'name': teamName,
    // image
  };

  const transaction = db.transaction('teams', 'readwrite');
  const teamStore = transaction.objectStore('teams');
  teamStore.add(team);
  // return true;
  transaction.oncomplete = function() {
    location.replace('teams.html');
  }
  return false;
}