//
// Copyright (c) 2023, Arnoud van Foreest. All rights reserved.
//
var db;

function renderPage(db) {
  this.db = db;
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.getAll().onsuccess = function(event) {
    const teams = event.target.result;
    const list = document.querySelector('#teamList');
    list.innerHTML = '';
    teams.forEach(function(team) {
      const item = document.createElement('li');
      item.innerHTML =
        // '<img src="data:image/png;base64,' + team.logo + '" />' +
        '<a href="team.html?id=' + team.id + '">' + team.name + '</a>';
      list.append(item);
    });
  };
}