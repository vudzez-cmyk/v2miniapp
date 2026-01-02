const playBtn = document.getElementById("playBtn");
const playScreen = document.getElementById("playScreen");
const minesScreen = document.getElementById("minesScreen");

const grid = document.getElementById("grid");
const goldEl = document.getElementById("gold");
const attemptsEl = document.getElementById("attempts");

let gold = 0;
let attempts = 10;
let mines = new Set();
let opened = new Set();

/* PLAY */
playBtn.addEventListener("click", () => {
  playScreen.classList.remove("active");
  minesScreen.classList.add("active");
  startGame();
});

/* GAME INIT */
function startGame() {
  grid.innerHTML = "";
  mines.clear();
  opened.clear();
  attempts = 10;
  goldEl.textContent = gold;
  attemptsEl.textContent = attempts;

  while (mines.size < 5) {
    mines.add(Math.floor(Math.random() * 25));
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", () => openCell(cell, i));
    grid.appendChild(cell);
  }
}

/* CELL CLICK */
function openCell(cell, index) {
  if (attempts <= 0) return;
  if (opened.has(index)) return;

  opened.add(index);
  attempts--;
  attemptsEl.textContent = attempts;

  if (mines.has(index)) {
    cell.textContent = "💣";
    cell.classList.add("mine");
    attempts = 0;
    attemptsEl.textContent = 0;
    revealMines();
    return;
  }

  cell.textContent = "⭐️";
  cell.classList.add("star");
  gold += 10;
  goldEl.textContent = gold;
}

/* REVEAL */
function revealMines() {
  document.querySelectorAll(".cell").forEach(c => {
    const i = Number(c.dataset.index);
    if (mines.has(i)) {
      c.textContent = "💣";
      c.classList.add("mine");
    }
  });
}

/* TABS */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

/* LANG */
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});