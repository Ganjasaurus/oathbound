import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultBuild,getStats,itemCost,planFight,sampleFight,randomBuild,STYLES,WEAPONS,ITEMS} from '../src/combat.js';
import {gamepadIntent} from '../src/input.js';

test('the same builds and seed reproduce the entire choreography',()=>{
 const builds=[defaultBuild(),randomBuild(42)];
 assert.deepEqual(planFight(builds,813),planFight(builds,813));
 assert.notDeepEqual(planFight(builds,813).beats,planFight(builds,814).beats);
 const copy=structuredClone(builds);planFight(builds,91);assert.deepEqual(builds,copy);
});
test('every discipline and weapon combination produces a valid continuous duel',()=>{
 for(const style of STYLES)for(const weapon of WEAPONS)for(let seed=1;seed<=18;seed++){
 const a={...defaultBuild(),style:style.id,weapon:weapon.id};
 const plan=planFight([a,randomBuild(seed*71)],seed*221);
 assert.ok(plan.duration>8&&plan.duration<75);
 let last=2.8,dead=false;
 for(const beat of plan.beats){
 assert.equal(beat.start,last);assert.ok(beat.end>beat.start);last=beat.end;
 if(beat.kind==='exchange'){assert.equal(dead,false);assert.ok(beat.before[beat.attacker].hp>0);assert.ok(beat.impact>0&&beat.impact<1);}
 for(const [i,s]of beat.after.entries()){
 assert.ok(Number.isFinite(s.hp)&&Number.isFinite(s.stamina)&&Number.isFinite(s.mana));
 assert.ok(s.hp>=0&&s.hp<=plan.stats[i].hp+0.001);
 assert.ok(s.stamina>=0&&s.stamina<=100);assert.ok(s.mana>=0&&s.mana<=s.maxMana);
 if(s.hp===0)dead=true;
 }
 }
 assert.equal(last,plan.duration);
 const ratios=plan.final.map((s,i)=>s.hp/plan.stats[i].hp);
 assert.equal(plan.winner,ratios[0]===ratios[1]?null:ratios[0]>ratios[1]?0:1);
 }
});
test('damage resolves at contact, with no result leaked before the impact',()=>{
 const plan=planFight([defaultBuild(),defaultBuild(1)],177);
 const beat=plan.beats.find(b=>b.kind==='exchange'&&b.damage>0);
 assert.deepEqual(sampleFight(plan,beat.start+beat.duration*(beat.impact-0.001)).state,beat.before);
 assert.deepEqual(sampleFight(plan,beat.start+beat.duration*(beat.impact+0.001)).state,beat.after);
 assert.equal(sampleFight(plan,0).kind,'intro');
 assert.equal(sampleFight(plan,plan.duration).kind,'finish');
});
test('relics affect real stats and AI behavior',()=>{
 const bare={...defaultBuild(),items:[]},owl={...bare,items:['owl']},hunter={...bare,items:['hunter']};
 assert.equal(getStats(owl).power,getStats(bare).power);
 assert.ok(getStats(owl).insight>getStats(bare).insight);
 assert.equal(getStats({...bare,items:['iron']}).hp,getStats(bare).hp+28);
 const rates={bare:{parry:0,defence:0,combo:0},owl:{parry:0,defence:0,combo:0},hunter:{parry:0,defence:0,combo:0}};
 for(let seed=1;seed<=400;seed++)for(const [key,build]of Object.entries({bare,owl,hunter})){
 const plan=planFight([build,randomBuild(seed)],seed*37),r=rates[key];
 for(const b of plan.beats)if(b.kind==='exchange'&&b.attacker===1){r.defence++;if(b.response==='parry')r.parry++;}
 r.combo+=plan.final[0].combos;
 }
 assert.ok(rates.owl.parry/rates.owl.defence>rates.bare.parry/rates.bare.defence);
 assert.ok(rates.hunter.combo>rates.bare.combo*1.25);
});
test('generated opponents fit the same gear budget as players',()=>{
 for(let seed=1;seed<300;seed++)for(const level of ['initiate','standard','master']){
 const b=randomBuild(seed,level);assert.ok(itemCost(b)<=8&&b.items.length<=3);
 assert.ok(b.items.every(id=>ITEMS.some(i=>i.id===id)));
 }
});
const pad=(pressed=[],axes=[0,0])=>({buttons:Array.from({length:16},(_,i)=>({pressed:pressed.includes(i)})),axes});
test('Xbox controls produce edge-triggered actions and repeatable directional navigation',()=>{
 assert.deepEqual(gamepadIntent(pad([0])).actions,['confirm']);
 assert.deepEqual(gamepadIntent(pad([0]),[true]).actions,[]);
 assert.deepEqual(gamepadIntent(pad([1,2,3,4,5,9])).actions,['back','secondary','camera','tabPrev','tabNext','start']);
 assert.deepEqual(gamepadIntent(pad([],[0,-0.9]),[],{direction:0,time:0},100).actions,['up']);
 assert.deepEqual(gamepadIntent(pad([15]),[],{direction:'right',time:100},200).actions,[]);
 assert.deepEqual(gamepadIntent(pad([15]),[],{direction:'right',time:100},400).actions,['right']);
});
