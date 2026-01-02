// mines.js
// Core mines logic with persistence and daily reset

const Mines = (function(){
  const ROWS = 5;
  const COLS = 5;
  const CELLS = ROWS * COLS;
  const SAFE_REWARD = 10;
  const DEFAULT_ATTEMPTS = 10;
  const STORAGE_KEY = 'stand_mines_state';

  let board = [];
  let attemptsLeft = DEFAULT_ATTEMPTS;
  let totalGold = 0;
  let roundGold = 0;
  let roundActive = false;

  let boosts = {
    passChanceActive: false,
    autoPickActive: false
  };

  /* ---------- Persistence ---------- */
  function save(){
    const data = {
      attemptsLeft,
      totalGold,
      boosts,
      lastResetDate: getTodayUTC()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      attemptsLeft = data.attemptsLeft ?? DEFAULT_ATTEMPTS;
      totalGold = data.totalGold ?? 0;
      boosts = data.boosts ?? boosts;
    }catch(e){}
  }

  function getTodayUTC(){
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }

  function dailyResetIfNeeded(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      if(data.lastResetDate !== getTodayUTC()){
        attemptsLeft = DEFAULT_ATTEMPTS;
        boosts.passChanceActive = false;
        boosts.autoPickActive = false;
        save();
      }
    }catch(e){}
  }

  /* ---------- Game Logic ---------- */
  function shuffleBoard(mines = 5){
    board = Array.from({length: CELLS}, () => ({ opened:false, isMine:false }));
    let placed = 0;
    while(placed < mines){
      const i = Math.floor(Math.random() * CELLS);
      if(!board[i].isMine){
        board[i].isMine = true;
        placed++;
      }
    }
  }

  function startRound(){
    if(attemptsLeft <= 0) return { ok:false };
    shuffleBoard();
    roundGold = 0;
    roundActive = true;
    save();
    return { ok:true };
  }

  function reveal(index){
    if(!roundActive) return { ok:false };
    const cell = board[index];
    if(cell.opened) return { ok:false };

    attemptsLeft--;
    cell.opened = true;

    if(boosts.passChanceActive){
      boosts.passChanceActive = false;
      cell.isMine = false;
      roundGold += SAFE_REWARD;
      save();
      return { ok:true, safe:true };
    }

    if(cell.isMine){
      roundGold = 0;
      roundActive = false;
      save();
      return { ok:true, mine:true };
    }

    roundGold += SAFE_REWARD;
    save();
    return { ok:true, safe:true };
  }

  function collectRound(){
    totalGold += roundGold;
    roundGold = 0;
    roundActive = false;
    save();
    return totalGold;
  }

  function purchaseBoost(key){
    const prices = { passChance:5000, addAttempts:3000, autoPick:7000 };
    if(totalGold < prices[key]) return false;

    totalGold -= prices[key];
    if(key === 'passChance') boosts.passChanceActive = true;
    if(key === 'addAttempts') attemptsLeft += 5;
    if(key === 'autoPick') boosts.autoPickActive = true;

    save();
    return true;
  }

  function getBoardCopy(){
    return board.map((c,i)=>({index:i, opened:c.opened, isMine:c.opened && c.isMine}));
  }

  function getAttempts(){ return attemptsLeft; }
  function getTotals(){ return { totalGold, roundGold }; }

  /* ---------- Init ---------- */
  load();
  dailyResetIfNeeded();
  shuffleBoard();

  return {
    startRound,
    reveal,
    collectRound,
    purchaseBoost,
    getBoardCopy,
    getAttempts,
    getTotals
  };
})();