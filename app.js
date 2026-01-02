// ===== GAME STATE =====
let gold = 0;
let attempts = 10;
let gridSize = 25;
let minesCount = 5;
let mines = [];
let opened = [];

// ===== DOM =====
const grid = document.getElementById("grid");
const goldEl = document.getElementById("gold");
const attemptsEl = document.getElementById("attempts");

// ===== INIT =====
initGame();

function initGame() {
  grid.innerHTML = "";
  mines = [];
  opened = [];
  attempts = 10;
  goldEl.textContent = gold;
  attemptsEl.textContent = attempts;

  generateMines();
  generateGrid();
}

// ===== MINES =====
function generateMines() {
  while (mines.length < minesCount) {
    const r = Math.floor(Math.random() * gridSize);
    if (!mines.includes(r)) mines.push(r);
  }
}

// ===== GRID =====
function generateGrid() {
  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", onCellClick);
    grid.appendChild(cell);
  }
}

// ===== CLICK =====
function onCellClick(e) {
  const cell = e.currentTarget;
  const index = Number(cell.dataset.index);

  if (attempts <= 0) return;
  if (opened.includes(index)) return;

  opened.push(index);
  attempts--;
  attemptsEl.textContent = attempts;

  if (mines.includes(index)) {
    cell.classList.add("mine");
    cell.textContent = "💣";
    attempts = 0;
    attemptsEl.textContent = 0;
    revealAllMines();
    return;
  }

  // STAR
  gold += 10;
  goldEl.textContent = gold;
  cell.classList.add("star");
  cell.textContent = "⭐️";
}

// ===== REVEAL =====
function revealAllMines() {
  document.querySelectorAll(".cell").forEach((cell) => {
    const idx = Number(cell.dataset.index);
    if (mines.includes(idx)) {
      cell.classList.add("mine");
      cell.textContent = "💣";
    }
  });
}