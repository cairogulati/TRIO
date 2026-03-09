const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQl2Kx3SpXSA3IyCQoLaalLjibwCh2f6nURBZU-qABgT6hA5eeGOaiKOfmOas93rwsgi4OlBr-ttbqp/pub?gid=0&single=true&output=csv";

async function loadData() {

  const res = await fetch(sheetURL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  const headers = rows.shift();

  const games = rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
    return obj;
  });

  computeLeaderboard(games);
}

function computeLeaderboard(games) {

  let players = {};

  games.forEach(game => {

    const list = [
      game.Player1,
      game.Player2,
      game.Player3,
      game.Player4,
      game.Player5,
      game.Player6
    ];

    list.forEach(player => {

      if (!player) return;

      if (!players[player]) {
        players[player] = {
          name: player,
          games: 0,
          wins: 0,
          points: 0
        };
      }

      players[player].games++;

      if (game.Winner === player) {
        players[player].wins++;
        players[player].points += 6;
      } else {
        players[player].points += 1;
      }

    });

  });

  const leaderboard = Object.values(players).map(p => {
    p.winrate = p.wins / p.games;
    return p;
  });

  leaderboard.sort((a, b) => b.points - a.points);

  renderTable(leaderboard);

  if (typeof renderCharts === "function") {
    renderCharts(leaderboard);
  }

}

function renderTable(players) {

  const tbody = document.querySelector("#leaderboard tbody");

  tbody.innerHTML = "";

  players.forEach((p, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.games}</td>
      <td>${p.wins}</td>
      <td>${p.points}</td>
      <td>${(p.winrate * 100).toFixed(1)}%</td>
    `;

    tbody.appendChild(row);

  });

}

loadData();
