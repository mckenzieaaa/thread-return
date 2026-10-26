(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ThreadBoard=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const nodes=[
{id:'A',name:'起针处',x:95,y:440,kind:'start',icon:'针'},
{id:'B',name:'左侧补给',x:95,y:290,kind:'supply',reward:2,icon:'扣'},
{id:'C',name:'左龙尾',x:210,y:190,kind:'plain',icon:'·'},
{id:'L',name:'左龙印记',x:340,y:105,kind:'seal',seal:'left',icon:'左'},
{id:'D',name:'上沿',x:510,y:65,kind:'plain',icon:'·'},
{id:'R',name:'右龙印记',x:680,y:105,kind:'seal',seal:'right',icon:'右'},
{id:'E',name:'右龙尾',x:810,y:190,kind:'plain',icon:'·'},
{id:'F',name:'右侧补给',x:925,y:290,kind:'supply',reward:2,icon:'扣'},
{id:'G',name:'收针处',x:925,y:440,kind:'exit',icon:'归'},
{id:'H',name:'右下沿',x:705,y:505,kind:'plain',icon:'·'},
{id:'I',name:'下沿补给',x:510,y:535,kind:'supply',reward:3,icon:'扣'},
{id:'J',name:'左下沿',x:305,y:505,kind:'plain',icon:'·'},
{id:'N',name:'左侧穿线点',x:335,y:310,kind:'plain',icon:'·'},
{id:'M',name:'花心印记',x:510,y:310,kind:'seal',seal:'flower',icon:'花'},
{id:'O',name:'右侧穿线点',x:685,y:310,kind:'plain',icon:'·'}
];
const raw=[['A','B'],['B','C'],['C','L'],['L','D'],['D','R'],['R','E'],['E','F'],['F','G'],['G','H'],['H','I'],['I','J'],['J','A'],['C','N'],['N','M'],['M','O'],['O','E'],['J','N'],['O','H'],['L','M',2],['M','R',2]];
const edges=raw.map(([a,b,c=0],i)=>({id:i,a,b,steps:1,buttons:c}));
const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
const initial=()=>({pos:'A',steps:10,buttons:2,seals:[],claimed:[],trail:['A'],done:false});
const edge=(a,b)=>edges.find(e=>(e.a===a&&e.b===b)||(e.b===a&&e.a===b));
function reason(s,to){if(s.done)return '本局已经完成';if(!byId[to])return '无效位置';const e=edge(s.pos,to);if(!e)return '请先选择与棋子相连的位置';if(s.steps<e.steps)return '针步已经用完，可以撤回一步';if(s.buttons<e.buttons)return '这条捷径需要 2 枚纽扣';return ''}
function move(s,to){const error=reason(s,to);if(error)return {ok:false,error,state:s};const e=edge(s.pos,to),n=byId[to];const next={...s,steps:s.steps-e.steps,buttons:s.buttons-e.buttons,seals:[...s.seals],claimed:[...s.claimed],trail:[...s.trail,to],pos:to};let reward=0,newSeal=null;if(n.kind==='supply'&&!s.claimed.includes(to)){reward=n.reward;next.buttons+=reward;next.claimed.push(to)}if(n.seal&&!next.seals.includes(n.seal)){next.seals.push(n.seal);newSeal=n.seal}return {ok:true,state:next,reward,newSeal,edge:e}}
const canFinish=s=>!s.done&&s.pos==='G'&&s.seals.length===3&&s.buttons>=2;
function finish(s){if(!canFinish(s))return {ok:false,state:s,error:'收针需要三枚印记、2 枚纽扣，并抵达收针处'};return {ok:true,state:{...s,buttons:s.buttons-2,done:true}}}
const failed=s=>!s.done&&s.steps===0&&!canFinish(s);
const neighbors=s=>edges.filter(e=>e.a===s.pos||e.b===s.pos).map(e=>{const to=e.a===s.pos?e.b:e.a;return {node:byId[to],edge:e,error:reason(s,to)}});
const stars=s=>s.done?(s.steps>=2?3:s.steps>=1?2:1):0;
function plan(s){if(s.done)return [];let queue=[{s,path:[]}],head=0;const seen=new Set();while(head<queue.length){const {s:q,path}=queue[head++];if(canFinish(q))return path;const key=[q.pos,q.steps,q.buttons,[...q.seals].sort().join(''),[...q.claimed].sort().join('')].join('|');if(seen.has(key))continue;seen.add(key);for(const n of neighbors(q)){if(n.error)continue;const r=move(q,n.node.id);queue.push({s:r.state,path:[...path,n.node.id]})}}return null}
return {nodes,edges,byId,initial,edge,reason,move,finish,canFinish,failed,neighbors,stars,plan};
});
