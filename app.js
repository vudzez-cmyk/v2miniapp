document.addEventListener("DOMContentLoaded", () => {

  let percent = 0;
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  const percentEl = document.getElementById("loaderPercent");

  const interval = setInterval(() => {
    percent += 5;
    percentEl.textContent = percent + "%";

    if (percent >= 100) {
      clearInterval(interval);

      // ВСЕГДА сначала скрываем loader
      loader.style.display = "none";
      app.classList.remove("hidden");

      // Запуск игры ТОЛЬКО если функция существует
      if (typeof initGame === "function") {
        initGame();
      } else {
        console.error("initGame not found");
      }
    }
  }, 80);

});