var db;
var teamKey;

function renderPage(db, params) {
  this.db = db;
  teamKey = params.get('key');
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.get(Number(teamKey)).onsuccess = function(event) {
    const team = event.target.result;
    const input = document.querySelector('#teamName');
    input.value = team.name;
  };
  document.querySelector('header > div.left > a').setAttribute('href', 'team.html?key=' + teamKey);
  document.querySelector('header > div.right > a').setAttribute('href', 'team.html?key=' + teamKey);
}

function saveTeam() {
  const teamName = document.querySelector('#teamName').value;
  if (teamName == '') {
    return false;
  }

  const team = {
    'name': teamName,
    // 'logo': '',
  };

  const transaction = db.transaction('teams', 'readwrite');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.put(team, Number(teamKey));
  return true;
}

function deleteTeam() {
  // confirm
  // delete players
  const transaction = db.transaction('teams', 'readwrite');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.delete(Number(teamKey));
  window.location.replace('teams.html');
}