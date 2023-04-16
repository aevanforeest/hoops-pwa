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
  const teamsStore = transaction.objectStore('teams');
  teamsStore.add(team);
  return true;
}
