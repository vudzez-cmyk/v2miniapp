const grid = document.getElementById("grid");

const cells = [];
const mines = new Set();

while (mines.size < 5) {
  mines.add(Math.floor(Math.random() * 25));
}

for (let i = 0; i < 25; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";

  cell.onclick = () => {
    if (mines.has(i)) {
      cell.textContent = "💣";
    } else {
      cell.textContent = "⭐️";
    }
    cell.onclick = null;
  };

  grid.appendChild(cell);
}