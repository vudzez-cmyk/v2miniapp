// mines.js
// Исправленная логика:
// - Попытки тратятся ТОЛЬКО при взрыве
// - После мины поле очищается
// - Есть блокировка при 0 попыток

const Mines = (function(){
  const SIZE = 25;
  const MINES_COUNT = 5;
  const SAFE_REWARD = 10;
  const DEFAULT_ATTEMPTS = 10;
  const STORAGE_KEY = 'stand_mines_state';

  let board = [];
  let attemptsLeft = DEFAULT_ATTEMPTS;
  let totalGold = 0;
  let roundGold = 0;
  let roundActive = false;
  let lastReset = getTodayUTC();

  function getTodayUTC(){
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }

  /* ---------- Persistence ---------- */
  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      attemptsLeft,
      totalGold,
      lastReset
    }));
  }

  function load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    try{
      const d = JSON.parse(raw);
      attemptsLeft = d.attemptsLeft ?? DEFAULT_ATTEMPTS;
      totalGold = d.totalGold ?? 0;
      lastReset = d.lastReset ?? getTodayUTC();
    }catch(e){}
  }

  function dailyReset(){
    const today = getTodayUTC();
    if(today !== lastReset){
      attemptsLeft = DEFAULT_ATTEMPTS;
      lastReset = today;
      save();
    }
  }

  /* ---------- Board ---------- */
  function generateBoard(){
    board = Array.from({length: SIZE}, ()=>({ opened:false, mine:false }));
    let placed = 0;
    while(placed < MINES_COUNT){
      const i = Math.floor(Math.random()*SIZE);
      if(!board[i].mine){
        board[i].mine = true;
        placed++;
      }
    }
  }

  function startRound(){
    dailyReset();
    if(attemptsLeft <= 0) return { ok:false, locked:true };
    roundGold = 0;
    roundActive = true;
    generateBoard();
    return { ok:true };
  }

  function reveal(index){
    if(!roundActive) return { ok:false };
    const cell = board[index];
    if(cell.opened) return { ok:false };

    cell.opened = true;

    if(cell.mine){
      attemptsLeft--;
      roundGold = 0;
      roundActive = false;
      generateBoard(); // очищаем поле
      save();
      return { ok:true, mine:true, attemptsLeft };
    }

    roundGold += SAFE_REWARD;
    save();
    return { ok:true, safe:true, roundGold };
  }

  function collect(){
    totalGold += roundGold;
    roundGold = 0;
    roundActive = false;
    save();
  }

  function getState(){
    return {
      board,
      attemptsLeft,
      totalGold,
      roundGold,
      roundActive
    };
  }

  load();
  dailyReset();
  generateBoard();

  return {
    startRound,
    reveal,
    collect,
    getState
  };
})();