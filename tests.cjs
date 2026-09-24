const assert = require('node:assert/strict');
const { evaluate, round, SYMBOLS } = require('./engine.js');
assert.equal(evaluate(['ruby','ruby','ruby','orb','star'],20).payout,300);
assert.equal(evaluate(['orb','orb','orb','orb','star'],20).payout,1000);
assert.equal(evaluate(['star','star','star','star','star'],20).payout,2000);
assert.equal(evaluate(['star','orb','orb','orb','orb'],20).payout,0);
assert.throws(()=>round(1,20));
let total=0,paid=0;
for(let n=0;n<3125;n++){
 let code=n; const row=Array.from({length:5},()=>{const s=SYMBOLS[code%5];code=Math.floor(code/5);return s;});
 const result=evaluate(row,1);total+=result.payout;if(result.payout)paid++;
}
assert.equal(total/3125,.96);assert.equal(paid/3125,.04);
const result=round(2000,20,()=>0);assert.equal(result.balance,3980);assert.equal(result.grid.length,5);
console.log('OK: pagos, ausencia de premio, saldo, 3125 combinaciones, devolución 96 % y probabilidad de pago 4 %.');
