let percent = 0;
const loader = document.getElementById("loader");
const app = document.getElementById("app");

const int = setInterval(() => {
  percent += 5;
  document.getElementById("loaderPercent").innerText = percent + "%";
  if (percent >= 100) {
    clearInterval(int);
    loader.classList.add("hidden");
    app.classList.remove("hidden");
    initGame();
  }
}, 80);

// nav
document.querySelectorAll(".nav-btn").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
  };
});

// lang
document.getElementById("ru").onclick = () => setLang("ru");
document.getElementById("en").onclick = () => setLang("en");