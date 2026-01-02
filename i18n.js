// i18n.js
// Real dictionary-based translations for RU / EN.
// Default language: RU
// All visible text must use translation keys.

const I18N = (function(){
  // Dictionary: keys used across the app
  const dict = {
    ru: {
      daily_attempts: "Попытки",
      round_gold: "Раунд GOLD",
      total_gold: "Всего GOLD",
      start_round: "Начать",
      collect_round: "Забрать",
      boosts_title: "Бусты",
      boost_pass_chance: "Pass Chance",
      boost_pass_desc: "Отклоняет шанс мины на текущую попытку.",
      boost_add_attempts: "+5 Attempts",
      boost_add_desc: "Добавляет 5 попыток к дневному лимиту.",
      boost_auto_pick: "Auto Pick (95%)",
      boost_auto_desc: "Авто-выбор клетки с 95% шансом безопасности.",
      buy: "Купить",
      airdrop_title: "AirDrop",
      airdrop_date: "Дата:",
      airdrop_text: "Активные игроки получат GOLD в рамках AirDrop.",
      airdrop_conversion: "Конверсия: 10 000 GOLD = 1 000 GAME CURRENCY",
      tab_earn: "Earn",
      tab_boosts: "Boosts",
      tab_drop: "Drop"
    },
    en: {
      daily_attempts: "Attempts",
      round_gold: "Round GOLD",
      total_gold: "Total GOLD",
      start_round: "Start",
      collect_round: "Collect",
      boosts_title: "Boosts",
      boost_pass_chance: "Pass Chance",
      boost_pass_desc: "Rejects a mine chance for the current pick.",
      boost_add_attempts: "+5 Attempts",
      boost_add_desc: "Adds 5 attempts to the daily limit.",
      boost_auto_pick: "Auto Pick (95%)",
      boost_auto_desc: "Auto-picks a cell with 95% safety chance.",
      buy: "Buy",
      airdrop_title: "AirDrop",
      airdrop_date: "Date:",
      airdrop_text: "Active players receive GOLD in the AirDrop.",
      airdrop_conversion: "Conversion: 10,000 GOLD = 1,000 GAME CURRENCY",
      tab_earn: "Earn",
      tab_boosts: "Boosts",
      tab_drop: "Drop"
    }
  };

  let current = 'ru';

  // Apply translations by scanning data-i18n attributes
  function apply(lang = current){
    current = lang;
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(n => {
      const key = n.getAttribute('data-i18n');
      if(!key) return;
      const text = dict[lang] && dict[lang][key] ? dict[lang][key] : key;
      n.textContent = text;
    });

    // Update language active classes
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function getLang(){ return current; }

  function t(key){ return dict[current][key] || key; }

  return { apply, t, getLang };
})();