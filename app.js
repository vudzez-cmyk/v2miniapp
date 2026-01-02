// LOADER
let p = 0;
const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loaderPercent");
const loaderText = document.getElementById("loaderText");
const app = document.getElementById("app");

const loadInt = setInterval(() => {
  p++;
  loaderPercent.textContent = p;
  if (p >= 100) {
    clearInterval(loadInt);
    loader.style.display = "none";
    app.classList.remove("hidden");
  }
}, 25);

// MENU
document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById("page-" + btn.dataset.page).classList.add("active");
  };
});

// LANG
const ruBtn = document.getElementById("ruBtn");
const enBtn = document.getElementById("enBtn");

ruBtn.onclick = () => setLang("ru");
enBtn.onclick = () => setLang("en");

function setLang(l) {
  ruBtn.classList.toggle("active", l === "ru");
  enBtn.classList.toggle("active", l === "en");
  loaderText.textContent = I18N[l].welcome;
}