let gold = Number(localStorage.getItem("gold")) || 0;
let attempts = Number(localStorage.getItem("attempts")) || 10;

let mines = [];
let sessionGold = 0;
let active = true;

const grid = document.getElementById("grid");
const goldEl = document.getElementById("gold");
const attemptsEl = document.getElementById("attempts");

function updateStats() {
  goldEl.textContent = `${gold} GOLD`;
  attemptsEl.textContent = `Попытки: ${attempts}`;
  localStorage.setItem("gold", gold);
  localStorage.setItem("attempts", attempts);
}

function newGame() {
  grid.innerHTML = "";
  sessionGold = 0;
  active = true;
  mines = [];

  while (mines.length < 5) {
    const m = Math.floor(Math.random() * 25);
    if (!mines.includes(m)) mines.push(m);
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => openCell(cell, i);
    grid.appendChild(cell);
  }
}

function openCell(cell, index) {
  if (!active || cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");

  if (mines.includes(index)) {
    cell.textContent = "💣";
    cell.classList.add("mine");
    active = false;
    sessionGold = 0;
    attempts--;
    setTimeout(newGame, 800);
  } else {
    cell.textContent = "⭐️";
    sessionGold += 10;
    gold += 10;
  }
  updateStats();
}

updateStats();
newGame();