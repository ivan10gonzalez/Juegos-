const assert=require('node:assert/strict');const {progress,plan,initial}=require('./reels');
assert.equal(progress(0),0);assert.equal(progress(1),1);let prev=0;for(let i=0;i<=1000;i++){const p=progress(i/1000);assert(p>=prev&&p<=1);prev=p;}
const result=Array.from({length:5},(_,c)=>['ruby','mask','orb']);
for(const [fast,reduced] of [[false,false],[true,false],[false,true]]){
 const spins=plan(initial,result,fast,reduced);
 spins.forEach((spin,c)=>{assert.deepEqual(spin.sequence.slice(0,3),result[c]);if(!reduced){assert.deepEqual(spin.sequence.slice(spin.steps,spin.steps+3),initial[c]);if(c)assert(spin.duration>spins[c-1].duration);}assert(spin.duration>0);});
}
console.log('PASS continuous monotonic travel, staggered stops, initial continuity and final result preserved in normal/turbo/reduced motion.');
const {sample,endTime,requestStop}=require('./reels');
for(const fast of [false,true]){
 const spins=plan(initial,result,fast,false),when=(spins[1].duration+spins[2].duration)/2;
 assert.equal(spins.filter(s=>!sample(s,when).active).length,2);
 const stopped=requestStop(spins,when);
 assert.equal(stopped[0],spins[0]);assert.equal(stopped[1],spins[1]);
 for(let c=0;c<5;c++){
  assert.equal(sample(stopped[c],when).distance,sample(spins[c],when).distance,'no jump at stop click');
  assert.equal(stopped[c].sequence,spins[c].sequence,'stopping cannot change the result');
  assert.ok(endTime(stopped[c])<=Math.max(when,spins[c].duration));
  let previous=sample(stopped[c],when).distance;
  for(let elapsed=when;elapsed<=when+250;elapsed+=5){const next=sample(stopped[c],elapsed);assert.ok(next.distance>=previous);previous=next.distance;}
  assert.equal(sample(stopped[c],when+250).active,false);
  assert.equal(sample(stopped[c],when+250).distance,spins[c].steps);
 }
 assert.deepEqual(requestStop(stopped,when+10),stopped,'repeated stop clicks do not extend the animation');
}
console.log('PASS quick stop: two settled reels preserved, continuous monotonic braking, all remaining reels stop within 250 ms, unchanged outcome, repeated clicks safe.');
