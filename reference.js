'use strict';
const $=s=>document.querySelector(s), canvas=$('#gameCanvas'),ctx=canvas.getContext('2d');
const image=new Image();image.src='assets/reference-frame.jpg';
// The complete original frame is retained as an atlas. Browser chrome is never drawn.
const FRAME={x:0,y:249,w:886,h:1483};
const tiles={star:[3,693,170,129],mask:[360,693,170,129],ruby:[360,822,170,129],emerald:[183,822,170,129],orb:[360,951,170,129]};
let balance=539340,stake=2000,rounds=[],grid=null,busy=false,ready=false,fast=false,animation=0,phase='idle',changed=false,muted=true;
const format=value=>(value/100).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
function base(){ctx.drawImage(image,FRAME.x,FRAME.y,FRAME.w,FRAME.h,0,0,886,1483);}
function cell(kind,c,r){const tile=tiles[kind];ctx.drawImage(image,...tile,3+c*177.2,444+r*129,170,129);}
function paint(){
 if(!ready)return;base();
 if(grid)for(let c=0;c<5;c++)for(let r=0;r<3;r++)cell(grid[c][r],c,r);
 // Visible provenance replaces the captured provider/session identifier.
 ctx.fillStyle='#100015';ctx.fillRect(0,1451,886,32);ctx.fillStyle='#bba9bf';ctx.font='17px Arial';ctx.textAlign='center';ctx.fillText('DEMO EDUCATIVA · FICHAS FICTICIAS · SIN PREMIOS REALES',443,1471);
 if(changed){ctx.fillStyle='#100015';ctx.fillRect(0,1409,886,42);ctx.textAlign='center';ctx.font='bold 29px Arial';ctx.fillStyle='#e9b253';ctx.fillText('CRÉDITO',205,1439);ctx.fillStyle='white';ctx.fillText(format(balance),366,1439);ctx.fillStyle='#e9b253';ctx.fillText('APUESTA',560,1439);ctx.fillStyle='white';ctx.fillText(format(stake),730,1439);}
 if(phase!=='idle'){
  // Reuse unlettered background from the same controls panel behind status text.
  ctx.drawImage(image,0,1174,886,75,0,862,886,75);ctx.textAlign='center';ctx.font='900 37px Arial';ctx.fillStyle='white';ctx.fillText(phase==='spin'?'¡BUENA SUERTE!':phase==='end'?'FIN DE LA DEMOSTRACIÓN':'RONDA COMPLETADA',443,912);
 }
 if(busy){ctx.fillStyle='#24072c';ctx.beginPath();ctx.arc(443,1125,80,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff5582';ctx.lineWidth=8;ctx.strokeRect(414,1096,58,58);}
}
function controls(){const stopped=rounds.length>=10;$('.spin-control').disabled=!ready||busy||stopped;for(const s of ['.plus-control','.minus-control','.stake-control','.reset-control'])$(s).disabled=!ready||busy;$('#resetMenu').disabled=busy;}
function info(){const used=rounds.reduce((s,r)=>s+r.stake,0),paid=rounds.reduce((s,r)=>s+r.payout,0);$('#summary').textContent=`${rounds.length} rondas · Usadas: ${format(used)} · Recibidas: ${format(paid)} · Neto: ${format(paid-used)} fichas.`;$('#history').replaceChildren();rounds.forEach((r,i)=>{const tr=document.createElement('tr');[String(i+1),format(r.stake),format(r.payout),format(r.payout-r.stake)].forEach(text=>{const td=document.createElement('td');td.textContent=text;tr.append(td);});$('#history').append(tr);});if(!$('#info').open)$('#info').showModal();}
async function audioToggle(){const audio=$('#audio');if(muted){try{await audio.play();muted=false;}catch{$('#status').textContent='Tocá nuevamente para activar el audio.';return;}}else{audio.pause();muted=true;}$('.sound-control').setAttribute('aria-pressed',String(!muted));$('.sound-control').setAttribute('aria-label',muted?'Activar sonido de la grabación':'Silenciar sonido');$('#audioNote').textContent=muted?'DEMO · ♫ apagado':'DEMO · ♫ activado';}
function changeStake(direction){if(busy)return;const values=[1000,2000,5000];stake=values[Math.max(0,Math.min(2,values.indexOf(stake)+direction))];changed=true;paint();$('#status').textContent='Fichas por ronda: '+format(stake);}
function reset(){if(busy)return;balance=539340;rounds=[];grid=null;phase='idle';changed=stake!==2000;paint();controls();$('#status').textContent='Demostración reiniciada.';}
$('.spin-control').addEventListener('click',()=>{
 if(!ready||busy||rounds.length>=10)return;
 if(balance<stake){$('#status').textContent='Fichas ficticias insuficientes.';return;}
 const result=AulaAzar.round(balance,stake),spent=stake;balance-=spent;changed=true;busy=true;phase='spin';controls();$('#status').textContent='Girando una ronda de demostración.';
 const start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?180:fast?650:1900;
 function frame(now){const elapsed=now-start;if(elapsed<duration){grid=Array.from({length:5},(_,c)=>elapsed>duration-500+c*90?result.grid[c]:Array.from({length:3},(_,r)=>AulaAzar.SYMBOLS[(Math.floor(elapsed/70)+c+r)%5]));paint();animation=requestAnimationFrame(frame);return;}
 balance=result.balance;grid=result.grid;rounds.push({stake:spent,payout:result.payout});busy=false;phase=rounds.length>=10?'end':'complete';paint();controls();$('#status').textContent=`Ronda ${rounds.length}. Recibidas ${format(result.payout)}. Saldo ${format(balance)} fichas ficticias.`;if(rounds.length>=10)info();}
 animation=requestAnimationFrame(frame);
});
$('.plus-control').addEventListener('click',()=>changeStake(1));$('.minus-control').addEventListener('click',()=>changeStake(-1));$('.reset-control').addEventListener('click',reset);$('.info-control').addEventListener('click',info);$('.sound-control').addEventListener('click',audioToggle);$('.menu-control').addEventListener('click',()=>$('#menu').showModal());$('.stake-control').addEventListener('click',()=>$('#stakes').showModal());$('.speed-control').addEventListener('click',()=>{fast=!fast;$('.speed-control').setAttribute('aria-pressed',String(fast));$('#status').textContent=fast?'Animación rápida':'Animación normal';});
$('.fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.reference-game').requestFullscreen();}catch{$('#status').textContent='La pantalla completa no está disponible en este navegador.';}});
$('#openInfo').addEventListener('click',()=>{$('#menu').close();info();});$('#audioMenu').addEventListener('click',audioToggle);$('#resetMenu').addEventListener('click',()=>{reset();$('#menu').close();});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('[data-stake]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;stake=Number(b.dataset.stake);changed=true;paint();$('#stakes').close();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)$('#audio').pause();else if(!muted)$('#audio').play().catch(()=>{});});
image.onload=()=>{ready=true;paint();controls();};image.onerror=()=>{$('#status').textContent='No se pudo cargar la imagen de referencia. Recargá la página.';const p=document.createElement('p');p.className='loading-error';p.textContent='No se pudo cargar la imagen. Revisá la conexión y recargá.';$('.reference-game').append(p);};if(image.complete&&image.naturalWidth)image.onload();controls();
