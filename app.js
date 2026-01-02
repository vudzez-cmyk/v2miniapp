/* ---------- LOADER ---------- */
let percent = 0;
const loader = document.getElementById("loader");
const app = document.getElementById("app");
const loaderPercent = document.getElementById("loaderPercent");

const loading = setInterval(() => {
  percent++;
  loaderPercent.textContent = percent;
  if (percent >= 100) {
    clearInterval(loading);
    loader.style.display = "none";
    app.classList.remove("hidden");
  }
}, 25);

/* ---------- GAME STATE ---------- */
let gold = Number(localStorage.getItem("gold")) || 0;
let attempts = Number(localStorage.getItem("attempts")) || 10;

let mines = [];
let activeGame = true;

/* ---------- ELEMENTS ---------- */
const grid = document.getElementById("grid");
const goldCount = document.getElementById("goldCount");
const attemptsEl = document.getElementById("attempts");

/* ---------- INIT ---------- */
updateStats();
newGame();

/* ---------- FUNCTIONS ---------- */
function updateStats() {
  goldCount.textContent = `${gold} GOLD`;
  attemptsEl.textContent = `Попытки: ${attempts}`;
  localStorage.setItem("gold", gold);
  localStorage.setItem("attempts", attempts);
}

function newGame() {
  grid.innerHTML = "";
  activeGame = true;
  mines = [];

  while (mines.length < 5) {
    const m = Math.floor(Math.random() * 25);
    if (!mines.includes(m)) mines.push(m);
  }

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => openCell(cell, i));
    grid.appendChild(cell);
  }
}

function openCell(cell, index) {
  if (!activeGame || cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");

  if (mines.includes(index)) {
    cell.classList.add("mine");
    activeGame = false;
    attempts--;
    setTimeout(newGame, 800);
  } else {
    cell.classList.add("gold");
    gold += 10;
  }

  updateStats();
}

/* ---------- MENU ---------- */
document.querySelectorAll(".bottom button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".bottom button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`page-${btn.dataset.page}`).classList.add("active");
  };
});