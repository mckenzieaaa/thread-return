const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/level2-data.js','utf8'),scope);
const def=scope.window.ThreadLevelTwo,R=require('./rules.js').create(def),fresh=R.initial();
assert.equal(fresh.steps,16);assert.equal(fresh.buttons,5);
assert.match(R.reason({...fresh,pos:'C'},'L'),/结心/,'Golden bridges must require the central seal.');
assert.equal(R.reason({...fresh,pos:'C',seals:['flower']},'L'),'');
const path=R.plan(fresh);assert(path&&path.length<=16,'Level two must be solvable within its budget.');
let s=fresh;for(const id of path){const r=R.move(s,id);assert(r.ok);s=r.state}assert(R.canFinish(s));assert(R.finish(s).state.done);assert.equal(fresh.trail.length,1);
assert(!R.canFinish({...s,seals:['left','right']}));
for(const e of R.edges){const c=e.d.match(/-?\d+(?:\.\d+)?/g).map(Number),a=R.byId[e.a],b=R.byId[e.b];assert(Math.hypot(c[0]-a.x,c[1]-a.y)<.2);assert(Math.hypot(c.at(-2)-b.x,c.at(-1)-b.y)<.2)}
console.log('Level two passed: independent budget, seal-gated bridges, solvability, finish and curve endpoints.');console.log('Verified path:',path.join(' → '));
