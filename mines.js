// mines.js
// Core mines logic separated from UI concerns.
// Exposes a simple API the UI can call.
//
// Rules:
// - Grid 5x5 (25 cells).
// - Daily attempts: default 10.
// - Each safe cell gives +10 GOLD.
// - If player hits a mine -> current round gold resets to 0.
// - Safe cell reveals a star icon; mine reveals a bomb.
// - Logic does NOT handle persistence beyond session (can be extended).

const Mines = (function(){
  const ROWS = 5;
  const COLS = 5;
  const CELLS = ROWS * COLS;
  const SAFE_REWARD = 10;
  const DEFAULT_ATTEMPTS = 10;

  // Game state
  let board = []; // { isMine, opened }
  let attemptsLeft = DEFAULT_ATTEMPTS;
  let totalGold = 0;
  let roundGold = 0;
  let roundActive = false;

  // Boosts state
  let boosts = {
    passChanceActive: false, // one-time use
    autoPickActive: false
  };

  // Utility: generate board with random mines. For the product, mines count should be set for a fair daily experience.
  function shuffleBoard(seedMines = 5){
    board = new Array(CELLS).fill(0).map(() => ({ isMine: false, opened: false }));
    // Place mines randomly (seedMines mines)
    let placed = 0;
    while(placed < seedMines){
      const idx = Math.floor(Math.random() * CELLS);
      if(!board[idx].isMine){
        board[idx].isMine = true;
        placed++;
      }
    }
  }

  // Start a new round: reset round values, ensure attempts left > 0
  function startRound(){
    if(attemptsLeft <= 0) return { ok:false, reason:'no_attempts' };
    shuffleBoard();
    roundGold = 0;
    roundActive = true;
    return { ok:true };
  }

  // Reveal a cell index (0..24)
  // Returns an object describing result to update UI
  function reveal(index, opts = {}){
    if(!roundActive) return { ok:false, reason:'no_round' };
    if(index < 0 || index >= CELLS) return { ok:false, reason:'bad_index' };
    const cell = board[index];
    if(cell.opened) return { ok:false, reason:'already_opened' };

    // Deduct attempt
    attemptsLeft = Math.max(0, attemptsLeft - 1);

    // Check passChance boost (one-time)
    if(boosts.passChanceActive){
      // 100% pass for next reveal: treat as safe even if mine
      boosts.passChanceActive = false;
      cell.opened = true;
      cell.isMine = false;
      roundGold += SAFE_REWARD;
      return { ok:true, safe:true, reward:SAFE_REWARD, attemptsLeft, roundGold, totalGold };
    }

    // Auto pick support: if active, decide success based on probability
    if(opts.autoPick && boosts.autoPickActive){
      // 95% chance of safe
      const roll = Math.random();
      const success = roll < 0.95;
      if(success){
        cell.opened = true;
        cell.isMine = false;
        roundGold += SAFE_REWARD;
        return { ok:true, safe:true, reward:SAFE_REWARD, attemptsLeft, roundGold, totalGold };
      }else{
        // fail: treat as mine
        cell.opened = true;
        cell.isMine = true;
        const lost = roundGold;
        roundGold = 0;
        roundActive = false;
        return { ok:true, mine:true, lost, attemptsLeft, roundGold, totalGold };
      }
    }

    // Normal reveal
    cell.opened = true;
    if(cell.isMine){
      // Mine hit: round resets to 0 and round ends
      const lost = roundGold;
      roundGold = 0;
      roundActive = false;
      return { ok:true, mine:true, lost, attemptsLeft, roundGold, totalGold };
    } else {
      // Safe
      roundGold += SAFE_REWARD;
      return { ok:true, safe:true, reward:SAFE_REWARD, attemptsLeft, roundGold, totalGold };
    }
  }

  // Collect current round gold into total
  function collectRound(){
    totalGold += roundGold;
    const collected = roundGold;
    roundGold = 0;
    roundActive = false;
    return { collected, totalGold };
  }

  // Purchase boost (deduct gold). Returns true/false
  function purchaseBoost(boostKey){
    const prices = {
      passChance: 5000,
      addAttempts: 3000,
      autoPick: 7000
    };
    const cost = prices[boostKey];
    if(!cost || totalGold < cost) return { ok:false, reason:'insufficient' };
    totalGold -= cost;

    if(boostKey === 'passChance'){
      boosts.passChanceActive = true;
    } else if(boostKey === 'addAttempts'){
      attemptsLeft += 5;
    } else if(boostKey === 'autoPick'){
      boosts.autoPickActive = true;
    }
    return { ok:true, cost, totalGold };
  }

  // Getters
  function getBoardCopy(){ return board.map((c,i) => ({ index:i, opened:c.opened, isMine: c.opened ? c.isMine : false })); }
  function getAttempts(){ return attemptsLeft; }
  function getTotals(){ return { totalGold, roundGold }; }
  function addGold(amount){ totalGold += amount; return totalGold; }

  // Reset for testing/development
  function resetAll(){
    attemptsLeft = DEFAULT_ATTEMPTS;
    totalGold = 0;
    roundGold = 0;
    roundActive = false;
    boosts = { passChanceActive:false, autoPickActive:false };
    shuffleBoard();
  }

  // Initialize board on load
  shuffleBoard();

  return {
    startRound, reveal, collectRound, purchaseBoost,
    getBoardCopy, getAttempts, getTotals, addGold, resetAll
  };
})();