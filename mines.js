let gold = 0;
let attempts = 10;
let mines = new Set();
let opened = new Set();

const grid = document.getElementById("grid");
const goldEl = document.getElementById("gold");
const attemptsEl = document.getElementById("attempts");

function startGame() {
  grid.innerHTML = "";
  mines.clear();
  opened.clear();
  attempts = 10;
  attemptsEl.textContent = attempts;
  goldEl.textContent = gold;

  while (mines.size < 5) {
    mines.add(Math.floor(Math.random() * 25));
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = () => openCell(cell, i);
    grid.appendChild(cell);
  }
}

function openCell(cell, index) {
  if (attempts <= 0 || opened.has(index)) return;

  opened.add(index);
  attempts--;
  attemptsEl.textContent = attempts;

  if (mines.has(index)) {
    cell.textContent = "💣";
    cell.classList.add("mine");
    attempts = 0;
    attemptsEl.textContent = 0;
    return;
  }

  cell.textContent = "⭐";
  cell.classList.add("star");
  gold += 10;
  goldEl.textContent = gold;
}

window.startGame = startGame;