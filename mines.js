const grid = document.getElementById("grid");
let tries = 10;
let gold = 0;

function initGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => openCell(cell);
    grid.appendChild(cell);
  }
}

function openCell(cell) {
  if (tries <= 0 || cell.innerHTML) return;

  tries--;
  document.getElementById("tries").innerText = "Attempts: " + tries;

  if (Math.random() < 0.2) {
    cell.innerHTML = "💣";
    cell.classList.add("bomb");
    gold = 0;
  } else {
    cell.innerHTML = "⭐";
    cell.classList.add("star");
    gold += 10;
  }

  document.getElementById("gold").innerText = gold + " GOLD";
}

initGrid();