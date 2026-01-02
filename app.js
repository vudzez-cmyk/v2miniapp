const grid = document.getElementById("grid");

let tries = 10;
let gold = 0;
let mines = [];

function initGame() {
  grid.innerHTML = "";
  mines = [];

  // 5 мин
  while (mines.length < 5) {
    const r = Math.floor(Math.random() * 25);
    if (!mines.includes(r)) mines.push(r);
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => clickCell(cell, i);
    grid.appendChild(cell);
  }
}

function clickCell(cell, index) {
  if (cell.classList.contains("open")) return;

  if (mines.includes(index)) {
    cell.textContent = "💣";
    alert("Boom! Всё обнулено");
    gold = 0;
    tries = 10;
    updateStats();
    initGame();
    return;
  }

  cell.textContent = "⭐";
  cell.classList.add("open");
  gold += 10;
  tries--;

  updateStats();
}

function updateStats() {
  document.getElementById("gold").textContent = gold + " GOLD";
  document.getElementById("tries").textContent = "Попытки: " + tries;
}

window.initGame = initGame;