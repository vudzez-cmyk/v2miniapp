// app.js
// Glue UI → logic. Handles rendering, events, animations, i18n updates.
//
// Key features implemented:
// - Loader with 0% -> 100% then fades into app
// - HUD language switch (real i18n)
// - Board rendering (5x5) and cell animations
// - Bottom nav switching without reload
// - Boost purchases and gold deduction
// - AirDrop static content
// - Mobile-first friendly interactions

(function(){
  // Cached DOM
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const app = document.getElementById('app');
  const boardEl = document.getElementById('board');
  const attemptsEl = document.getElementById('attempts');
  const roundGoldEl = document.getElementById('roundGold');
  const totalGoldEl = document.getElementById('totalGold');
  const startBtn = document.getElementById('startRound');
  const collectBtn = document.getElementById('collectRound');
  const navButtons = document.querySelectorAll('.nav-btn');
  const langButtons = document.querySelectorAll('.lang-btn');

  // Local UI state
  let ui = {
    activeTab: 'earn',
    lang: I18N.getLang()
  };

  // --- Loader ---
  function runLoader(){
    let p = 0;
    progressBar.style.width = '0%';
    const step = () => {
      p += Math.floor(Math.random() * 8) + 4; // randomized increments for realism
      if(p >= 100) p = 100;
      progressBar.style.width = p + '%';
      progressText.textContent = p + '%';

      if(p < 100){
        setTimeout(step, 80 + Math.random()*140);
      } else {
        // smooth fade into app
        loader.classList.add('fade-out');
        loader.style.transition = 'opacity 420ms ease';
        loader.style.opacity = 0;
        setTimeout(() => {
          loader.classList.add('hidden');
          app.classList.remove('hidden');
          I18N.apply(); // render texts
          renderAll();
        }, 480);
      }
    };
    step();
  }

  // --- Render board ---
  function renderBoard(){
    boardEl.innerHTML = '';
    const board = Mines.getBoardCopy();
    board.forEach(cell => {
      const el = document.createElement('button');
      el.className = 'cell';
      el.dataset.index = cell.index;
      if(cell.opened){
        el.classList.add('opened');
        if(cell.isMine){
          el.classList.add('mine');
          el.innerHTML = `<div class="icon bomb">💣</div>`;
        } else {
          el.classList.add('safe');
          el.innerHTML = `<div class="icon star">⭐</div>`;
        }
        // make sure opened cells not clickable
        el.disabled = true;
      } else {
        // closed cell
        el.innerHTML = `<div class="icon placeholder"></div>`;
      }
      // attach click handler when closed
      el.addEventListener('click', onCellClick);
      boardEl.appendChild(el);
    });
  }

  // --- Update HUD ---
  function renderHUD(){
    attemptsEl.textContent = Mines.getAttempts();
    const totals = Mines.getTotals();
    roundGoldEl.textContent = totals.roundGold;
    totalGoldEl.textContent = totals.totalGold;
  }

  // --- General render ---
  function renderAll(){
    renderBoard();
    renderHUD();
  }

  // --- Cell click handler ---
  function onCellClick(e){
    const btn = e.currentTarget;
    const idx = parseInt(btn.dataset.index, 10);
    // simple animation: pop
    btn.classList.add('animated-open');
    // Check for auto pick boost use from Boosts (UI not toggled here)
    const result = Mines.reveal(idx);
    // Apply UI updates depending on result
    if(result.ok){
      if(result.safe){
        // show star and glow
        btn.classList.add('opened', 'safe');
        btn.innerHTML = `<div class="icon star">⭐</div>`;
        btn.disabled = true;
        // update round and attempts
      } else if(result.mine){
        btn.classList.add('opened', 'mine');
        btn.innerHTML = `<div class="icon bomb">💣</div>`;
        btn.disabled = true;
        // end of round: reveal remaining opened cells should stay closed
        // roundGold reset already handled in logic
        // small effect: flash background red briefly
        flashOnMine();
      }
      // update HUD
      setTimeout(renderHUD, 120);
    } else {
      // show nothing if invalid
      renderHUD();
    }

    // remove animation class after end
    setTimeout(() => btn.classList.remove('animated-open'), 520);
  }

  function flashOnMine(){
    const o = document.getElementById('overlay');
    o.style.transition = 'box-shadow 260ms ease';
    o.style.boxShadow = 'inset 0 0 120px rgba(184,28,28,0.36)';
    setTimeout(()=> o.style.boxShadow = '', 520);
  }

  // --- Start round action ---
  startBtn.addEventListener('click', () => {
    const res = Mines.startRound();
    if(!res.ok){
      // No attempts — simple feedback
      flashMessage('No attempts left');
      return;
    }
    renderAll();
  });

  // --- Collect action ---
  collectBtn.addEventListener('click', () => {
    const res = Mines.collectRound();
    if(res.collected > 0){
      // small animation: add to total gold
      animateGoldCollect(res.collected);
    }
    renderHUD();
    renderBoard();
  });

  function animateGoldCollect(amount){
    const el = document.createElement('div');
    el.className = 'collect-anim';
    el.textContent = `+${amount} GOLD`;
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '40%';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '8px 14px';
    el.style.borderRadius = '10px';
    el.style.background = 'linear-gradient(90deg,var(--accent-gold),var(--accent-gold-2))';
    el.style.color = '#210e00';
    el.style.fontWeight = '800';
    el.style.zIndex = 60;
    document.body.appendChild(el);
    el.animate([{opacity:1, transform:'translate(-50%,0) scale(1)'},{opacity:0, transform:'translate(-50%,-80px) scale(0.9)'}], {duration:900, easing:'ease-out'});
    setTimeout(()=>el.remove(),1000);
  }

  // --- Bottom nav behavior ---
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  function switchTab(tab){
    ui.activeTab = tab;
    document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    // refresh rendering for current tab
    renderAll();
  }

  // --- Language switching ---
  langButtons.forEach(b => {
    b.addEventListener('click', () => {
      const lang = b.dataset.lang;
      I18N.apply(lang);
      document.documentElement.lang = lang;
      renderAll();
    });
  });

  // --- Boost purchases ---
  document.querySelectorAll('.purchase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const boostKey = btn.dataset.boost;
      const cost = parseInt(btn.dataset.cost,10);
      const res = Mines.purchaseBoost(boostKey);
      if(!res.ok){
        flashMessage('Not enough GOLD');
        return;
      }
      renderHUD();
      flashMessage(`Boost purchased: -${cost} GOLD`);
    });
  });

  // --- Small helper: flash message at top ---
  function flashMessage(txt){
    const el = document.createElement('div');
    el.className = 'flash-msg';
    el.textContent = txt;
    el.style.position = 'fixed';
    el.style.top = '80px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.background = 'rgba(0,0,0,0.6)';
    el.style.padding = '10px 18px';
    el.style.borderRadius = '12px';
    el.style.zIndex = 99;
    document.body.appendChild(el);
    setTimeout(()=> el.style.opacity = '0', 1600);
    setTimeout(()=> el.remove(), 2000);
  }

  // --- Init ---
  function init(){
    // Start loader then show app
    runLoader();

    // initial i18n application
    I18N.apply();

    // initial tab
    switchTab('earn');
  }

  // Start
  document.addEventListener('DOMContentLoaded', init);
})();