const grid = document.getElementById("grid");
let gold = 0;
let tries = 10;
let mines = [];

function initGame() {
  grid.innerHTML = "";
  mines = Array(25).fill("star");
  for (let i = 0; i < 5; i++) mines[Math.floor(Math.random()*25)] = "mine";

  mines.forEach((type, i) => {
    const c = document.createElement("div");
    c.className = "cell";
    c.onclick = () => openCell(c, type);
    grid.appendChild(c);
  });
}

function openCell(cell, type) {
  if (tries <= 0 || cell.classList.contains("star")) return;

  tries--;
  document.getElementById("tries").innerText = `${tries}`;

  if (type === "mine") {
    cell.classList.add("mine");
    cell.innerText = "💣";
    gold = 0;
  } else {
    cell.classList.add("star");
    cell.innerText = "⭐";
    gold += 10;
  }
  document.getElementById("gold").innerText = `${gold} GOLD`;
}