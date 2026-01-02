const Mines = (function(){
  const SIZE=25, MINES=5, REWARD=10, MAX_ATTEMPTS=10;
  let board=[], attempts=MAX_ATTEMPTS, total=0, round=0, active=false;
  let autoPickActive=true; // для теста включено

  function gen(){
    board=Array.from({length:SIZE},()=>({o:false,m:false}));
    let p=0;
    while(p<MINES){
      let i=Math.random()*SIZE|0;
      if(!board[i].m){board[i].m=true;p++}
    }
  }

  function start(){
    if(attempts<=0) return false;
    round=0;active=true;gen();return true;
  }

  function reveal(i){
    if(!active||board[i].o) return null;
    board[i].o=true;
    if(board[i].m){
      attempts--;round=0;active=false;gen();
      return {mine:true};
    }
    round+=REWARD;
    return {safe:true};
  }

  function autoPick(){
    if(!autoPickActive||!active) return null;
    const closed=board.map((c,i)=>!c.o?i:null).filter(i=>i!==null);
    if(!closed.length) return null;
    autoPickActive=false;
    return reveal(closed[Math.random()*closed.length|0]);
  }

  function collect(){total+=round;round=0;active=false}

  return{
    start,reveal,autoPick,collect,
    get:()=>({board,attempts,total,round,active,autoPickActive})
  }
})();