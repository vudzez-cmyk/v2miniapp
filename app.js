const playBtn = document.getElementById("playBtn");
const screenPlay = document.getElementById("screen-play");
const screenMines = document.getElementById("screen-mines");

playBtn.onclick = () => {
  screenPlay.classList.remove("active");
  screenMines.classList.add("active");
};

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  };
});

// Lang
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});