const boardEl=document.getElementById('board');
const attemptsEl=document.getElementById('attempts');
const totalGoldEl=document.getElementById('totalGold');
const roundGoldEl=document.getElementById('roundGold');
const resetTimer=document.getElementById('resetTimer');
const overlay=document.getElementById('overlay');
const autoPickWrap=document.getElementById('autoPickWrap');
const autoPickBtn=document.getElementById('autoPickBtn');

function animateGold(el,from,to){
  if(from===to) return;
  const s=performance.now();
  function f(t){
    const p=Math.min((t-s)/500,1);
    el.textContent=Math.floor(from+(to-from)*p);
    if(p<1) requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}

function mineFX(){
  document.body.classList.add('shake');
  overlay.classList.add('mine-flash');
  setTimeout(()=>{
    document.body.classList.remove('shake');
    overlay.classList.remove('mine-flash');
  },400);
}

function updateTimer(){
  if(Mines.get().attempts>0){
    resetTimer.classList.add('hidden');return;
  }
  resetTimer.classList.remove('hidden');
  const n=new Date(),r=new Date();r.setUTCHours(24,0,0,0);
  const d=r-n;
  resetTimer.textContent=`⏳ ${Math.floor(d/3600000)}h ${Math.floor(d/60000)%60}m`;
}

function render(){
  const s=Mines.get();
  attemptsEl.textContent=s.attempts;
  roundGoldEl.textContent=s.round;
  animateGold(totalGoldEl,+totalGoldEl.textContent||0,s.total);

  autoPickWrap.classList.toggle('hidden',!(s.autoPickActive&&s.active));

  boardEl.innerHTML='';
  s.board.forEach((c,i)=>{
    const b=document.createElement('div');
    b.className='cell'+(c.o?(c.m?' mine':' safe'):'');
    b.textContent=c.o?(c.m?'💣':'⭐'):'';
    b.onclick=()=>{
      const r=Mines.reveal(i);
      if(r?.mine) mineFX();
      render();
    };
    boardEl.appendChild(b);
  });
  updateTimer();
}

autoPickBtn.onclick=()=>{
  const r=Mines.autoPick();
  if(r?.mine) mineFX();
  render();
};

document.getElementById('startRound').onclick=()=>{Mines.start();render()}
document.getElementById('collectRound').onclick=()=>{Mines.collect();render()}

render();
setInterval(updateTimer,1000);