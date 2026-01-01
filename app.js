let state='loading';
let gold=0,energy=6500,tapPower=1,autoTap=false,lang='EN';
let lastTap=0;

const dict={
 EN:{boosts:'BOOSTS',passive:'+1 GOLD / 3 sec'},
 RU:{boosts:'БУСТЫ',passive:'+1 ЗОЛОТО / 3 сек'}
};

// Loader
let p=0;
const loader=document.getElementById('loader');
const pText=document.getElementById('loaderPercent');
const loaderInt=setInterval(()=>{
 p+=Math.floor(Math.random()*6)+4;
 if(p>=100){
  p=100;clearInterval(loaderInt);
  document.body.classList.remove('loading');
  loader.remove();
  document.getElementById('app').classList.remove('hidden');
  state='game';
 }
 pText.textContent=p+'%';
},80);

// Elements
const circle=document.getElementById('circle');
const goldText=document.getElementById('goldText');
const energyText=document.getElementById('energyText');
const passiveText=document.getElementById('passiveText');
const boostsTitle=document.getElementById('boostsTitle');

function updateUI(){
 goldText.textContent=gold+' GOLD';
 energyText.textContent=energy;
}

// Tap engine
circle.addEventListener('click',e=>{
 if(state!=='game') return;
 const now=Date.now();
 if(now-lastTap<60) return;
 lastTap=now;

 if(energy<=0) return;
 energy--;
 gold+=tapPower;
 updateUI();

 const r=circle.getBoundingClientRect();
 const x=e.clientX-r.left;
 const y=e.clientY-r.top;
 circle.style.setProperty('--x',x+'px');
 circle.style.setProperty('--y',y+'px');
 circle.classList.add('active');
 setTimeout(()=>circle.classList.remove('active'),150);
});

// Boosts
document.querySelectorAll('.boost').forEach(btn=>{
 btn.onclick=()=>{
  const t=btn.dataset.type;
  if(t==='x2'&&gold>=2000){tapPower=2;gold-=2000}
  if(t==='auto'&&gold>=3000){autoTap=true;gold-=3000}
  if(t==='energy'&&gold>=500){energy+=1000;gold-=500}
  updateUI();
 }
});

// Auto tap
setInterval(()=>{
 if(autoTap&&state==='game'){
  gold++;
  updateUI();
 }
},1000);

// Language
document.getElementById('langBtn').onclick=()=>{
 lang=lang==='EN'?'RU':'EN';
 boostsTitle.textContent=dict[lang].boosts;
 passiveText.textContent=dict[lang].passive;
 document.getElementById('langBtn').textContent=lang;
};
