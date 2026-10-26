(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ThreadBoard=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const {nodes,edges}=typeof module==='object'&&module.exports?require('./map-data.js'):globalThis.ThreadPattern;
const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
const initial=()=>({pos:'A',steps:10,buttons:4,seals:[],claimed:[],trail:['A'],done:false});
const edge=(a,b)=>edges.find(e=>(e.a===a&&e.b===b)||(e.b===a&&e.a===b));
function reason(s,to){if(s.done)return '本局已经完成';if(!byId[to])return '无效位置';const e=edge(s.pos,to);if(!e)return '请先选择与棋子相连的位置';if(s.steps<e.steps)return '针步已经用完，可以撤回一步';if(s.buttons<e.buttons)return '这条跨纹捷径需要 '+e.buttons+' 枚纽扣';return ''}
function move(s,to){const error=reason(s,to);if(error)return {ok:false,error,state:s};const e=edge(s.pos,to),n=byId[to];const next={...s,steps:s.steps-e.steps,buttons:s.buttons-e.buttons,seals:[...s.seals],claimed:[...s.claimed],trail:[...s.trail,to],pos:to};let reward=0,newSeal=null;if(n.kind==='supply'&&!s.claimed.includes(to)){reward=n.reward;next.buttons+=reward;next.claimed.push(to)}if(n.seal&&!next.seals.includes(n.seal)){next.seals.push(n.seal);newSeal=n.seal}return {ok:true,state:next,reward,newSeal,edge:e}}
const canFinish=s=>!s.done&&s.pos==='G'&&s.seals.length===3&&s.buttons>=2;
function finish(s){if(!canFinish(s))return {ok:false,state:s,error:'收针需要三枚印记、2 枚纽扣，并抵达收针处'};return {ok:true,state:{...s,buttons:s.buttons-2,done:true}}}
const failed=s=>!s.done&&s.steps===0&&!canFinish(s);
const neighbors=s=>edges.filter(e=>e.a===s.pos||e.b===s.pos).map(e=>{const to=e.a===s.pos?e.b:e.a;return {node:byId[to],edge:e,error:reason(s,to)}});
const stars=s=>s.done?(s.steps>=2?3:s.steps>=1?2:1):0;
function plan(s){if(s.done)return [];let queue=[{s,path:[]}],head=0;const seen=new Set();while(head<queue.length){const {s:q,path}=queue[head++];if(canFinish(q))return path;const key=[q.pos,q.steps,q.buttons,[...q.seals].sort().join(''),[...q.claimed].sort().join('')].join('|');if(seen.has(key))continue;seen.add(key);for(const n of neighbors(q)){if(n.error)continue;const r=move(q,n.node.id);queue.push({s:r.state,path:[...path,n.node.id]})}}return null}
return {nodes,edges,byId,initial,edge,reason,move,finish,canFinish,failed,neighbors,stars,plan};
});
