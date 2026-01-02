const grid = document.getElementById("grid");
const goldEl = document.getElementById("gold");
const triesEl = document.getElementById("tries");

let gold = 0;
let tries = 10;
let mines = new Set();

/* INIT */
function initGame() {
  grid.innerHTML = "";
  mines.clear();

  // 5 mines
  while (mines.size < 5) {
    mines.add(Math.floor(Math.random() * 25));
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", () => openCell(cell));
    grid.appendChild(cell);
  }
}

function openCell(cell) {
  if (cell.classList.contains("open") || tries <= 0) return;

  const index = Number(cell.dataset.index);
  cell.classList.add("open");
  tries--;

  if (mines.has(index)) {
    cell.textContent = "💣";
    cell.classList.add("mine");
    gold = 0;
    tries = 0;
  } else {
    cell.textContent = "⭐️";
    cell.classList.add("star");
    gold += 10;
  }

  updateStats();
}

function updateStats() {
  goldEl.textContent = `${gold} GOLD`;
  triesEl.textContent = `Попытки: ${tries}`;
}

initGame();