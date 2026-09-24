const assert=require('node:assert/strict');const {progress,plan,initial}=require('./reels');
assert.equal(progress(0),0);assert.equal(progress(1),1);let prev=0;for(let i=0;i<=1000;i++){const p=progress(i/1000);assert(p>=prev&&p<=1);prev=p;}
const result=Array.from({length:5},(_,c)=>['ruby','mask','orb']);
for(const [fast,reduced] of [[false,false],[true,false],[false,true]]){
 const spins=plan(initial,result,fast,reduced);
 spins.forEach((spin,c)=>{assert.deepEqual(spin.sequence.slice(0,3),result[c]);if(!reduced){assert.deepEqual(spin.sequence.slice(spin.steps,spin.steps+3),initial[c]);if(c)assert(spin.duration>spins[c-1].duration);}assert(spin.duration>0);});
}
console.log('PASS continuous monotonic travel, staggered stops, initial continuity and final result preserved in normal/turbo/reduced motion.');
