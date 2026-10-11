const assert=require('node:assert/strict');
const {create}=require('./audio.js');
let contexts=[];
class Param{constructor(){this.value=0;}setValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}cancelScheduledValues(){}}
class Node{constructor(ctx){this.context=ctx;this.gain=new Param();this.frequency=new Param();this.loop=false;this.stopped=false;this.starts=0;}connect(target){this.target=target;}disconnect(){}start(){this.starts++;this.context.started.push(this);}stop(){this.stopped=true;}}
class Context{constructor(){this.state='suspended';this.currentTime=0;this.sampleRate=22050;this.destination={};this.started=[];contexts.push(this);}createGain(){return new Node(this);}createBufferSource(){return new Node(this);}createOscillator(){return new Node(this);}createBuffer(channels,length,rate){return{duration:length/rate,getChannelData:()=>new Float32Array(length)};}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}}
const buffers={active:{name:'active',duration:33},calm:{name:'calm',duration:7.3},bet:{name:'bet',duration:.19}};
const turn=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const audio=create({AudioContext:Context,loadBuffers:async()=>buffers});
 assert.equal(contexts.length,0,'entering the page must be silent');assert.equal(audio.state().mode,null);
 await audio.unlock();const context=contexts[0];assert.equal(context.started.length,0,'unlock alone must not begin a tune');
 await audio.activate('active');assert.equal(context.started.filter(n=>n.loop).length,1);assert.equal(context.started.at(-1).buffer,buffers.active);
 await audio.activate('active');assert.equal(context.started.length,1,'repeated bet changes must not restart the music');
 await audio.effect('up');assert.equal(context.started.at(-1).buffer,buffers.bet);assert.equal(context.started.at(-1).loop,false,'the bet effect must never loop');
 const firstBet=context.started.at(-1);await audio.effect('down');assert.equal(firstBet.stopped,true,'rapid taps must not stack bet sounds');
 const music=context.started[0];audio.configure({effects:false});assert.equal(music.stopped,false,'muting FX must not stop music');let count=context.started.length;await audio.effect('up');assert.equal(context.started.length,count);
 audio.configure({effects:true});audio.startSpin();await turn();assert.ok(context.started.some(n=>n.loop&&n.buffer!==buffers.active),'rolling has its own source');
 audio.reelStop();await turn();audio.endSpin();assert.ok(context.started.filter(n=>n.loop&&n.buffer!==buffers.active).every(n=>n.stopped));
 await audio.activate('calm');assert.equal(context.started.at(-1).buffer,buffers.calm);assert.equal(music.stopped,true);
 audio.configure({music:false});assert.equal(context.started.at(-1).stopped,true);await audio.effect('up');assert.equal(context.started.at(-1).buffer,buffers.bet,'FX work with music muted');
 audio.configure({enabled:false});count=context.started.length;await audio.effect('up');await audio.activate('active');assert.equal(context.started.length,count,'master mute survives game actions');
 audio.configure({enabled:true,music:true});await audio.unlock();audio.setHidden(true);count=context.started.length;await audio.effect('up');assert.equal(context.started.length,count);assert.equal(context.state,'suspended');
 audio.setHidden(false);await turn();assert.equal(context.state,'running');audio.reset();assert.equal(audio.state().mode,null);assert.ok(context.started.filter(n=>n.loop).every(n=>n.stopped));audio.destroy();
 let resolve;const pending=new Promise(r=>resolve=r);const delayed=create({AudioContext:Context,loadBuffers:()=>pending});
 const activate=delayed.activate('active');delayed.configure({enabled:false});resolve(buffers);await activate;assert.equal(contexts[1].started.length,0,'loading completion must not undo a mute');delayed.destroy();
 const unsupported=create({});assert.equal(await unsupported.activate('active'),false);
 console.log('PASS audio: silent entry, separate non-looping bet effect, active/calm beds, no duplicate loops, independent volumes/mutes, spin lifecycle, hidden-page pause, reset and async mute race.');
})().catch(e=>{console.error(e);process.exitCode=1;});
