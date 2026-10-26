const assert=require('node:assert/strict');
const R=require('./rules.js');
const fresh=R.initial();
const path=R.plan(fresh);
assert(path&&path.length<=10,'The level must be solvable within its budget.');
let s=fresh;
for(const to of path){const r=R.move(s,to);assert(r.ok);s=r.state;assert(s.steps>=0&&s.buttons>=0);}
assert(R.canFinish(s));
const result=R.finish(s);assert(result.ok&&result.state.done);assert(R.stars(result.state)>=1);
assert.deepEqual(fresh,R.initial(),'Planning and moves must not mutate prior snapshots used by undo.');
assert.equal(R.move(fresh,'G').ok,false,'Nonadjacent movement must be rejected.');
assert.equal(R.finish(fresh).ok,false,'Early finish must be rejected.');
let supply=R.move(fresh,'B').state;
assert.equal(supply.buttons,6);
supply=R.move(supply,'A').state;supply=R.move(supply,'B').state;
assert.equal(supply.buttons,6,'Supplies cannot be farmed by revisiting.');
assert.equal(R.move({...fresh,pos:'L',buttons:1},'M').ok,false,'A shortcut must charge its full button cost.');
assert(R.failed({...fresh,steps:0}));
assert(R.canFinish({...s,steps:0})&&!R.failed({...s,steps:0}),'Finishing on the last step must remain possible.');
assert.equal(R.move(result.state,'F').ok,false,'A completed board must not allow further moves.');
console.log('Board rules passed: solvability, immutable snapshots, movement, resource accounting, single-use rewards and finish boundaries.');

for(const e of R.edges){
 const coords=e.d.match(/-?\d+(?:\.\d+)?/g).map(Number),a=R.byId[e.a],b=R.byId[e.b];
 assert(Math.hypot(coords[0]-a.x,coords[1]-a.y)<.2);
 assert(Math.hypot(coords.at(-2)-b.x,coords.at(-1)-b.y)<.2);
}
assert(R.edges.filter(e=>!e.bridge).length>R.edges.filter(e=>e.bridge).length);
console.log('Pattern-route endpoints match their nodes; most routes follow original contours.');
