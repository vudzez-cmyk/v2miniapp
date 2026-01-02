// LOADER
let percent = 0;
const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loaderPercent");
const app = document.getElementById("app");

const loaderInterval = setInterval(() => {
  percent += 5;
  loaderPercent.textContent = percent + "%";
  if (percent >= 100) {
    clearInterval(loaderInterval);
    loader.style.display = "none";
    app.classList.remove("hidden");
  }
}, 80);

// GAME STATE
let gold = 0;
let energy = 1000;

const goldEl = document.getElementById("gold");
const energyEl = document.getElementById("energy");
const circle = document.getElementById("circle");

// TAP
circle.addEventListener("click", () => {
  if (energy <= 0) return;
  gold += 1;
  energy -= 1;
  updateStats();
});

function updateStats() {
  goldEl.textContent = gold + " GOLD";
  energyEl.textContent = `⚡ ${energy} / 1000 · +1 / 3 sec`;
}

// ENERGY REGEN
setInterval(() => {
  if (energy < 1000) {
    energy += 1;
    updateStats();
  }
}, 3000);

// MENU
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen-" + btn.dataset.screen).classList.add("active");
  });
});