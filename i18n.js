const I18N = {
  lang:'ru',
  dict:{
    ru:{
      daily_attempts:'Попытки',
      round_gold:'Раунд GOLD',
      total_gold:'Всего GOLD',
      start_round:'Начать',
      collect_round:'Забрать'
    },
    en:{
      daily_attempts:'Attempts',
      round_gold:'Round GOLD',
      total_gold:'Total GOLD',
      start_round:'Start',
      collect_round:'Collect'
    }
  },
  apply(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      el.textContent=this.dict[this.lang][el.dataset.i18n]
    })
  }
};