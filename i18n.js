const dict = {
  ru: {
    tries: "Попытки",
    boosts: "Бусты",
    airdrop: "Аирдроп"
  },
  en: {
    tries: "Attempts",
    boosts: "Boosts",
    airdrop: "Airdrop"
  }
};

let lang = "ru";

function setLang(l) {
  lang = l;
  document.getElementById("tries").innerText =
    `${dict[l].tries}: ${tries}`;
}