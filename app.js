// LOADER
let percent = 0;
const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loaderPercent");

const interval = setInterval(() => {
  percent += 4;
  loaderPercent.textContent = percent + "%";
  if (percent >= 100) {
    clearInterval(interval);
    loader.style.display = "none";
  }
}, 60);

// NAV
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.screen).classList.add("active");
  });
});

// LANG
document.getElementById("ruBtn").onclick = () => setLang("ru");
document.getElementById("enBtn").onclick = () => setLang("en");