/* Rendering only: spin timing never selects or changes the paid result. */
(function(root){
 const H=123,Y=426,X=[22,194,366,537,708],W=157;
 const art={
  star:{box:[32,866,134,116],path:[[.04,.71],[.12,.60],[.16,.20],[.27,.08],[.50,.04],[.68,.12],[.76,.31],[.82,.36],[.84,.49],[.96,.37],[1,.51],[.99,.70],[.90,.81],[.67,.82],[.51,.70],[.36,.94],[.15,.97],[.02,.90]]},
  mask:{box:[29,984,146,129],path:[[.03,.56],[.06,.37],[.14,.19],[.34,.17],[.47,.04],[.68,.01],[.87,.10],[.85,.20],[.94,.35],[1,.51],[.93,.64],[.79,.58],[.76,.69],[.96,.88],[.71,.87],[.67,.99],[.48,.85],[.29,1],[.25,.82],[.06,.88],[.20,.66],[.06,.66]]},
  ruby:{box:[216,750,116,108],path:[[.03,.36],[.20,.16],[.75,.16],[.77,.04],[.79,.16],[.83,.17],[.96,.33],[.98,.46],[.53,.98],[.45,.98],[.01,.47]]},
  emerald:{box:[380,749,133,108],path:[[.02,.10],[.12,.02],[.30,.12],[.59,.24],[.84,.41],[.98,.58],[.97,.76],[.77,.99],[.54,.92],[.40,.72],[.26,.43],[.10,.22],[.05,.40],[0,.36]]},
  orb:{box:[565,754,105,104],path:[[.09,.30],[.24,.12],[.48,.05],[.73,.14],[.86,.08],[.88,.22],[.95,.37],[.97,.68],[.81,.90],[.55,.99],[.25,.91],[.07,.72],[.02,.48]]},
  gem:{box:[54,754,101,96],path:[[.02,.42],[.36,.02],[.69,.02],[.84,.23],[.86,.34],[.98,.43],[.98,.65],[.62,.98],[.36,.97],[.01,.66]]}
 };
 const initial=[['gem','star','mask'],['ruby','ruby','ruby'],['emerald','emerald','ruby'],['orb','orb','star'],['gem','gem','star']];
 function progress(t){t=Math.max(0,Math.min(1,t)); // integrated acceleration, cruise, deceleration
  const a=.065,b=.88,area=a/2+(b-a)+(1-b)/2;
  if(t<a)return t*t/(2*a*area);
  if(t<b)return (a/2+t-a)/area;
  const u=t-b;return (a/2+b-a+u-u*u/(2*(1-b)))/area;
 }
 function plan(before,result,fast,reduced){return result.map((end,c)=>{const steps=reduced?0:24+c*8;const sequence=Array.from({length:steps+5},(_,i)=>Object.keys(art)[(i*3+c+i%4)%6]);before[c].forEach((k,r)=>sequence[steps+r]=k);end.forEach((k,r)=>sequence[r]=k);return {steps,sequence,duration:reduced?150:(fast?520:1120)+c*(fast?120:350)};});}
 const sprites=new Map(),streaks=new Map();
 function drawSymbol(ctx,image,kind,x,y,moving=false){const a=art[kind],sw=a.box[2],sh=a.box[3],dx=x+(W-sw)/2,dy=y+(H-sh)/2;
  let sprite=sprites.get(kind);if(!sprite){sprite=document.createElement('canvas');sprite.width=sw;sprite.height=sh;const sc=sprite.getContext('2d');sc.beginPath();a.path.forEach(([px,py],i)=>sc[i?'lineTo':'moveTo'](px*sw,py*sh));sc.closePath();sc.clip();sc.drawImage(image,...a.box,0,0,sw,sh);sprites.set(kind,sprite);}
  if(moving){let streak=streaks.get(kind);if(!streak){streak=document.createElement('canvas');streak.width=sw+12;streak.height=sh+180;const sc=streak.getContext('2d');sc.filter='blur(3px)';sc.globalAlpha=1/17;for(let off=-60;off<=60;off+=6)sc.drawImage(sprite,6,90+off);streaks.set(kind,streak);}ctx.drawImage(streak,dx-6,dy-90);}
  else ctx.drawImage(sprite,dx,dy,sw,sh);
 }
 function draw(ctx,image,grid,spins,elapsed){
  for(let c=0;c<5;c++){
   const x=X[c];ctx.save();ctx.beginPath();ctx.rect(x,Y,W,H*3);ctx.clip();
   const bg=ctx.createLinearGradient(x,0,x+W,0);bg.addColorStop(0,'#300246');bg.addColorStop(.48,'#790698');bg.addColorStop(1,'#31013e');ctx.fillStyle=bg;ctx.fillRect(x,Y,W,H*3);
   ctx.strokeStyle=spins?.[c]&&elapsed<spins[c].duration?'#bc57c006':'#bc57c020';ctx.lineWidth=1;ctx.beginPath();for(let yy=Y-12;yy<Y+H*3+24;yy+=18)for(let xx=x-12;xx<x+W+12;xx+=24){ctx.moveTo(xx,yy);ctx.lineTo(xx+12,yy+9);ctx.lineTo(xx,yy+18);ctx.lineTo(xx-12,yy+9);ctx.closePath();}ctx.stroke();
   const spin=spins?.[c];if(spin&&elapsed<spin.duration){const t=elapsed/spin.duration,d=spin.steps*progress(t),moving=t>.06&&t<.90;
    for(let j=Math.floor(-d)-2;j<Math.ceil(3-d)+2;j++){const k=spin.sequence[j+spin.steps];if(k)drawSymbol(ctx,image,k,x,Y+(j+d)*H,moving);}
   }
   else grid[c].forEach((k,r)=>drawSymbol(ctx,image,k,x,Y+r*H));
   const shade=ctx.createLinearGradient(0,Y,0,Y+3*H);shade.addColorStop(0,'#ffffff48');shade.addColorStop(.1,'#ffffff00');shade.addColorStop(.87,'#00000000');shade.addColorStop(1,'#18002288');ctx.fillStyle=shade;ctx.fillRect(x,Y,W,H*3);ctx.restore();
  }

 }
 const api={progress,plan,draw,initial};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReelView=api;
})(globalThis);
