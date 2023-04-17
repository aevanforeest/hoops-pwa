var db;
var teamId;

function renderPage(db, params) {
  this.db = db;
  teamId = params.get('id');
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.get(Number(teamId)).onsuccess = function(event) {
    const team = event.target.result;
    document.querySelector('#teamName').value = team.name;
    document.querySelector('header > div.left > a').setAttribute('href', 'team.html?id=' + teamId);
    document.querySelector('header > div.right > a').setAttribute('href', 'team.html?id=' + teamId);
  };
}

function saveTeam() {
  const teamName = document.querySelector('#teamName').value;
  if (teamName == '') {
    return false;
  }

  const team = {
    'id': Number(teamId),
    'name': teamName,
  };

  const transaction = db.transaction('teams', 'readwrite');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.put(team);
  return true;
}

function deleteTeam() {
  if (confirm('Delete team?')) {
    // delete players
    const transaction = db.transaction('teams', 'readwrite');
    const teamsStore = transaction.objectStore('teams');
    teamsStore.delete(Number(teamId));
  }
}