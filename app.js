let percent = 0;
const loader = document.getElementById("loader");
const app = document.getElementById("app");
const text = document.getElementById("loader-percent");

const timer = setInterval(() => {
  percent++;
  text.innerText = percent + "%";

  if (percent >= 100) {
    clearInterval(timer);
    loader.classList.add("hidden");
    app.classList.remove("hidden");
  }
}, 20);