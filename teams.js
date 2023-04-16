function renderPage(db, key) {
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.getAllKeys().onsuccess = function(event) {
    const teamKeys = event.target.result;
    const list = document.querySelector('#teamList');
    list.innerHTML = '';
    teamKeys.forEach(function(teamKey) {
      teamsStore.get(teamKey).onsuccess = function(event) {
        const team = event.target.result;
        const item = document.createElement('li');
        item.innerHTML =
          // '<img src="data:image/png;base64,' + team.logo + '" />' +
          '<a href="team.html?key=' + teamKey + '">' + team.name + '</a>';
        list.append(item);
      }
    });
  };
}