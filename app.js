let gold = 0;
let energy = 1000;
let tapsToday = 0;
let tapPower = 1;
let autoTap = false;

const goldEl = document.getElementById('gold');
const energyEl = document.getElementById('energy');
const circle = document.getElementById('circle');
const boosts = document.getElementById('boosts');

const earnBtn = document.getElementById('earnBtn');
const boostBtn = document.getElementById('boostBtn');
const langBtn = document.getElementById('langBtn');

/* TAP */
circle.onclick = () => {
  if (energy <= 0 || tapsToday >= 1000) return;

  tapsToday++;
  energy--;
  gold += tapPower;

  circle.classList.remove('tap');
  void circle.offsetWidth;
  circle.classList.add('tap');

  updateUI();
};

/* ENERGY REGEN */
setInterval(() => {
  if (energy < 1000) energy++;
  updateUI();
}, 3000);

/* BOOSTS */
function buyBoost(type, price) {
  if (gold < price) return;

  gold -= price;

  if (type === 'energy') energy += 1000;
  if (type === 'x2') tapPower = 2;
  if (type === 'auto' && !autoTap) {
    autoTap = true;
    setInterval(() => {
      if (energy > 0) {
        energy--;
        gold += tapPower;
        updateUI();
      }
    }, 1000);
  }

  updateUI();
}

/* MENU */
earnBtn.onclick = () => {
  boosts.style.display = 'none';
  earnBtn.classList.add('active');
  boostBtn.classList.remove('active');
};

boostBtn.onclick = () => {
  boosts.style.display = 'block';
  boostBtn.classList.add('active');
  earnBtn.classList.remove('active');
};

/* LANG */
let lang = 'ru';
langBtn.onclick = () => {
  lang = lang === 'ru' ? 'en' : 'ru';
  langBtn.textContent = lang.toUpperCase();
};

/* UI */
function updateUI() {
  goldEl.textContent = `${gold} GOLD`;
  energyEl.textContent = `⚡ ${energy} / 1000 · +1 / 3 сек`;
}

updateUI();