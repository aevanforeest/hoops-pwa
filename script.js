var db;

var request = self.indexedDB.open('HOOPS_DB', 1);

request.onsuccess = function(event) {
  db = event.target.result;
  refreshTeams();
}

request.onerror = function(event) {
  console.log('[onerror]', request.error);
}

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const teams = db.createObjectStore('teams', {autoIncrement: true});
  const players = db.createObjectStore('players', {autoIncrement: true});
  players.createIndex('team', 'team');
  const games = db.createObjectStore('games', {autoIncrement: true});
  games.createIndex('team', 'team');
}

function navigate(className) {
  const a = document.querySelector('page.visible');
  if (a != null) {
    a.classList.remove('visible');
  }
  const b = document.querySelector('page#' + className);
  if (b != null) {
    b.classList.add('visible');
  }
}

function refreshTeams() {
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.getAllKeys().onsuccess = function(event) {
    const teamKeys = event.target.result;
    const list = document.querySelector('page#teams > ul#teamList');
    list.innerHTML = '';
    teamKeys.forEach(function(teamKey) {
      teamsStore.get(teamKey).onsuccess = function(event) {
        const team = event.target.result;
        const item = document.createElement('li');
        item.onclick = function() { navigateTeam(teamKey); }
        item.innerHTML = team.name;
        list.append(item);
      }
    });
  };
}

function navigateTeams() {
  refreshTeams();
  navigate('teams');
}

function navigateNewTeam() {
  navigate('newTeam');
}

function navigateTeam(key) {
  const transaction = db.transaction('teams', 'readonly');
  const teamsStore = transaction.objectStore('teams');
  console.log(key);
  teamsStore.get(key).onsuccess = function(event) {
    const team = event.target.result;
    const teamName = document.querySelector('page#team #teamName');
    teamName.innerHTML = team.name;
  };
  // get players
  // get games
  // get stats
  refreshTeamPlayers(key);
  navigate('team');
}

function refreshTeamPlayers(teamKey) {
  const transaction = db.transaction('players', 'readonly');
  const playersStore = transaction.objectStore('players');
  const teamIndex = playersStore.index('team');
  teamIndex.getAllKeys(teamKey).onsuccess = function(event) {
    const playerKeys = event.target.result;
    const list = document.querySelector('page#team > ul#playerList');
    list.innerHTML = '';
    playerKeys.forEach(function(playerKey) {
      playersStore.get(playerKey).onsuccess = function(event) {
        const player = event.target.result;
        const item = document.createElement('li');
        item.onclick = function() { navigatePlayer(playerKey); }
        item.innerHTML = player.number + ' ' + player.name;
        list.append(item);  
      }
    });
  };
}

function saveNewTeam() {
  const teamName = document.querySelector('page#newTeam #teamName');

  const team = {
    'name': teamName.value,
  };

  const transaction = db.transaction('teams', 'readwrite');
  const teamsStore = transaction.objectStore('teams');
  teamsStore.add(team);
  navigate('teams');
}

// function saveNewPlayer(teamKey) {
//   const playerName = document.querySelector('page#newPlayer #playerName');

//   const player = {
//     'name': 'Name',
//     'number': '#6',
//     'team': teamKey,
//   };

//   const transaction = db.transaction('players', 'readwrite');
//   const playersStore = transaction.objectStore('players');
//   playersStore.add(player);
// }

document.addEventListener('DOMContentLoaded', () => {

});