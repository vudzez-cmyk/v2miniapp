const dict = {
  ru: {
    attempts: "Попытки",
  },
  en: {
    attempts: "Attempts",
  }
};

function setLang(lang) {
  document.getElementById("ruBtn").classList.toggle("active", lang === "ru");
  document.getElementById("enBtn").classList.toggle("active", lang === "en");
}