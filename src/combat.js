export const STYLES = [
{id:'vanguard',name:'The Vanguard',title:'Hold the line. Own the opening.',description:'Disciplined guards, shield pressure, and punishing counterattacks.',glyph:'fortress',color:'#81a99a',hp:142,power:15,speed:0.9,guard:0.68,insight:0.60,magic:0.28,poise:0.76},
{id:'duelist',name:'The Duelist',title:'A blade ahead of the thought.',description:'Quick footwork, precise parries, and fluid multi-hit combinations.',glyph:'sword',color:'#dbc299',hp:120,power:13,speed:1.2,guard:0.45,insight:0.76,magic:0.34,poise:0.45},
{id:'reaver',name:'The Reaver',title:'Make every opening a wound.',description:'Heavy launchers, relentless pressure, and dangerous finishing blows.',glyph:'axe',color:'#cd826e',hp:138,power:19,speed:0.84,guard:0.32,insight:0.40,magic:0.30,poise:0.83},
{id:'spellblade',name:'The Spellblade',title:'Steel has a second language.',description:'Weaves close-range runes into swordplay to break a stubborn defence.',glyph:'rune',color:'#a79cca',hp:116,power:13,speed:1.04,guard:0.43,insight:0.68,magic:0.86,poise:0.42}
];
export const WEAPONS = [
{id:'swordshield',name:'Sword & shield',detail:'Control / defence',glyph:'shield',power:0,speed:0,guard:0.16,reach:1.65},
{id:'greatsword',name:'Greatsword',detail:'Power / guard breaks',glyph:'sword',power:4,speed:-0.12,guard:-0.04,reach:1.95},
{id:'twins',name:'Twin blades',detail:'Speed / combinations',glyph:'blades',power:-1,speed:0.16,guard:-0.08,reach:1.45},
{id:'glaive',name:'Runic glaive',detail:'Reach / spacing',glyph:'spear',power:1,speed:-0.04,guard:0.02,reach:2.18}
];
export const SPELLS = [
{id:'ember',name:'Ember strike',detail:'A close-range burst that cracks guards.',color:'#ffa360',glyph:'flame'},
{id:'frost',name:'Winter sigil',detail:'Interrupts momentum and slows the next exchange.',color:'#8bdde6',glyph:'snow'},
{id:'ward',name:'Aegis pulse',detail:'Restores health when your fighter finds breathing room.',color:'#a9d6b0',glyph:'rune'}
];
export const ITEMS = [
{id:'owl',name:"Owl's Eye",cost:3,glyph:'eye',type:'INSTINCT',description:'Reads repeated attacks. More adaptive parries and fewer predictable attacks.',effect:{insight:0.20}},
{id:'hunter',name:"Hunter's Knot",cost:3,glyph:'knot',type:'INSTINCT',description:'Recognises a stagger. More follow-up combos and longer pressure strings.',effect:{combo:0.26}},
{id:'mirror',name:'Mirror Charm',cost:3,glyph:'rune',type:'INSTINCT',description:'Baits committed attacks. More feints, ripostes, and opportunistic counters.',effect:{counter:0.23,insight:0.06}},
{id:'patient',name:'Patient Stone',cost:2,glyph:'gem',type:'INSTINCT',description:'Conserves stamina. Defends while tired and chooses safer openings.',effect:{discipline:0.24,guard:0.05}},
{id:'iron',name:'Ironheart',cost:3,glyph:'heart',type:'ATTRIBUTE',description:'+28 vitality and stronger resistance to launchers.',effect:{hp:28,poise:0.12}},
{id:'edge',name:'Serrated Oath',cost:3,glyph:'sword',type:'ATTRIBUTE',description:'+4 weapon power. Every clean hit lands harder.',effect:{power:4}},
{id:'wind',name:'Windstep',cost:3,glyph:'wing',type:'ATTRIBUTE',description:'+15% attack speed. More evasive footwork.',effect:{speed:0.15,evasion:0.09}},
{id:'emberstone',name:'Runeblood',cost:3,glyph:'flame',type:'ARCANA',description:'More potent magic and +25 mana for additional spell weaves.',effect:{magic:0.19,mana:25}},
{id:'anchor',name:'Anchor Plate',cost:2,glyph:'shield',type:'ATTRIBUTE',description:'Improves blocking and poise, with a small speed penalty.',effect:{guard:0.10,poise:0.13,speed:-0.06}},
{id:'second',name:'Second Breath',cost:2,glyph:'leaf',type:'INSTINCT',description:'Recovers stamina faster; manages exhaustion more effectively.',effect:{recovery:5,discipline:0.08}}
];
export const TACTICS = [
{id:'balanced',name:'Measured',aggression:52,patience:60,arcana:42,description:'Read the opponent. Take the opening.'},
{id:'pressure',name:'Relentless',aggression:90,patience:25,arcana:35,description:'Close the distance. Keep them guessing.'},
{id:'counter',name:'Counterplay',aggression:28,patience:90,arcana:45,description:'Invite commitment. Answer with precision.'},
{id:'arcane',name:'Rune weaver',aggression:55,patience:65,arcana:90,description:'Make steel and magic work together.'}
];
export const MOVE_LIST = [
{id:'slash',name:'Crosscut',damage:1,cost:12,duration:1.30,height:'mid',tag:'blade'},
{id:'thrust',name:'Needle thrust',damage:0.90,cost:10,duration:1.16,height:'mid',tag:'precision'},
{id:'overhead',name:'Falling oath',damage:1.45,cost:23,duration:1.72,height:'high',tag:'heavy'},
{id:'sweep',name:'Low reaping cut',damage:0.85,cost:15,duration:1.42,height:'low',tag:'low'},
{id:'kick',name:'Front kick',damage:0.65,cost:10,duration:1.30,height:'mid',tag:'kick'},
{id:'spin',name:'Turning crescent',damage:1.24,cost:21,duration:1.78,height:'mid',tag:'spin'},
{id:'launcher',name:'Rising steel',damage:1.13,cost:22,duration:1.72,height:'high',tag:'launcher'},
{id:'shieldbash',name:'Shield breaker',damage:0.72,cost:17,duration:1.35,height:'mid',tag:'shield'},
{id:'doublecut',name:'Twin oath',damage:1.22,cost:19,duration:1.52,height:'mid',tag:'combo'},
{id:'riposte',name:'Perfect answer',damage:1.23,cost:13,duration:1.28,height:'mid',tag:'counter'},
{id:'feint',name:'False promise',damage:0.82,cost:12,duration:1.62,height:'mid',tag:'feint'},
{id:'spell',name:'Runic strike',damage:1.20,cost:13,duration:1.92,height:'mid',tag:'magic'},
{id:'lunge',name:'Wolf lunge',damage:1.1,cost:17,duration:1.54,height:'mid',tag:'gap'},
{id:'pommel',name:'Close-quarters elbow',damage:0.55,cost:7,duration:1.04,height:'mid',tag:'close'}
];
const moveMap=Object.fromEntries(MOVE_LIST.map(m=>[m.id,m]));
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function defaultBuild(player=0) {
return {name:player===0?'Ashen Knight':'Hollow Warden',style:player===0?'duelist':'vanguard',weapon:'swordshield',spell:player===0?'ember':'frost',items:player===0?['owl','wind']:['iron','anchor'],aggression:52,patience:60,arcana:42,color:player===0?'sage':'rust'};
}
export function itemCost(build){return build.items.reduce((s,id)=>s+(ITEMS.find(i=>i.id===id)?.cost||0),0);}
export function getStats(build) {
const s=STYLES.find(s=>s.id===build.style)||STYLES[0],w=WEAPONS.find(w=>w.id===build.weapon)||WEAPONS[0];
const stats={hp:s.hp,power:s.power+w.power,speed:s.speed+w.speed,guard:s.guard+w.guard,insight:s.insight,magic:s.magic,poise:s.poise,reach:w.reach,mana:70,combo:0.1,counter:0.08,discipline:0.1,evasion:0,recovery:0};
for(const id of build.items){const item=ITEMS.find(i=>i.id===id);if(item)for(const [k,v]of Object.entries(item.effect))stats[k]=(stats[k]||0)+v;}
stats.speed=clamp(stats.speed,0.65,1.6);
for(const k of ['guard','insight','magic','poise','combo','counter','discipline','evasion'])stats[k]=clamp(stats[k],0,0.96);
return stats;
}
export function seededRandom(seed){let state=(Number(seed)>>>0)||1;return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function weighted(rng,entries){let roll=rng()*entries.reduce((s,[,v])=>s+Math.max(0.01,v),0);for(const [v,w]of entries){roll-=Math.max(0.01,w);if(roll<=0)return v;}return entries.at(-1)[0];}
function snapshot(fs){return fs.map(f=>({hp:Math.max(0,f.hp),stamina:clamp(f.stamina,0,100),mana:Math.max(0,f.mana),maxHp:f.stats.hp,maxMana:f.stats.mana,hits:f.hits,damage:f.damage,parries:f.parries,combos:f.combos,casts:f.casts}));}
function chooseMove(a,b,rng,spacing){
return weighted(rng,MOVE_LIST.filter(m=>m.id!=='riposte'&&(m.id!=='shieldbash'||a.build.weapon==='swordshield')&&(m.id!=='spell'||a.mana>=22)).map(m=>{
let w=m.id==='slash'||m.id==='thrust'?3.3:1;
if(m.tag==='heavy'||m.tag==='launcher')w*=a.build.style==='reaver'?2.9:0.9;
if(m.tag==='precision'||m.tag==='feint')w*=a.build.style==='duelist'?2.2:1;
if(m.tag==='magic'){w*=0.4+(a.build.arcana/100)*4.5*a.stats.magic;if(a.build.spell==='ward')w*=a.hp>a.stats.hp*0.9?0.08:a.hp<a.stats.hp*0.5?2.2:1;}
if(m.tag==='shield')w*=a.build.style==='vanguard'?3:1.5;
if(m.tag==='combo')w*=a.build.weapon==='twins'?3:1;
if(m.tag==='feint')w*=1+a.stats.counter*4+b.stats.guard;
if(m.tag==='gap')w*=spacing>2?3.2:0.75;
if(m.tag==='low')w*=b.memory.high>2?2.4:1.1;
if(m.id===a.lastMove)w*=0.45+(1-a.stats.insight)*0.4;
if(b.memory[m.height]>2)w*=1-a.stats.insight*0.38;
if(a.stamina<m.cost+14)w*=0.1+(m.cost<13?1.7:0);
if(m.tag==='heavy')w*=0.5+a.build.aggression/100;
return [m,w];
}));
}
export function planFight(builds,seed=1,options={}) {
const rng=seededRandom(seed);
const fighters=builds.map(build=>{const stats=getStats(build);return {build:structuredClone(build),stats,hp:stats.hp,stamina:100,mana:stats.mana,memory:{high:0,mid:0,low:0},hits:0,damage:0,parries:0,combos:0,casts:0,lastMove:null,slowed:0};});
const beats=[];let time=2.8,lastAttacker=-1,pressure=0,spacing=3.6;
const maxTime=options.maxTime||58,initiative=rng()<0.5?0:1;
function add(beat){beat.start=time;beat.end=time+beat.duration;beat.index=beats.length;beats.push(beat);time=beat.end;}
add({kind:'footwork',duration:1.4,spacing:2.25,drift:0,response:'guard',before:snapshot(fighters),after:snapshot(fighters),reason:'Both fighters test the distance.'});
function exchange(attacker,move,isCombo=false,forcedResponse=null){
const a=fighters[attacker],defender=1-attacker,b=fighters[defender],before=snapshot(fighters);
a.stamina=Math.max(0,a.stamina-move.cost);
const isSpell=move.id==='spell';if(isSpell){a.mana-=22;a.casts++;}
let response=forcedResponse;
const discipline=b.build.patience/100,read=clamp(b.stats.insight*(0.32+b.memory[move.height]*0.12)+b.stats.counter*0.2,0.1,0.88),fatigue=b.stamina<20?0.5:1;
if(!response){
const chance=rng();
const parry=clamp((0.035+read*0.16+discipline*0.1)*fatigue*(isSpell?0.05:1)*(move.tag==='feint'?0.4:1),0,0.34);
const evade=clamp((0.07+b.stats.speed*0.04+b.stats.evasion+discipline*0.05)*fatigue*(move.height==='low'?0.6:1),0,0.27);
const block=clamp((b.stats.guard*0.36+discipline*0.09)*fatigue*(move.tag==='feint'?0.4:1),0,0.48);
response=chance<parry?'parry':chance<parry+evade?'dodge':chance<parry+evade+block?'block':'hit';
if(response==='block'&&(move.tag==='heavy'||move.tag==='shield'||isSpell)&&rng()<0.28+(a.stats.power-12)*0.015)response='break';
if(response==='hit'&&move.tag==='launcher'&&rng()>b.stats.poise*0.65)response='launch';
}
let damage=0,heal=0;const ward=isSpell&&a.build.spell==='ward';
if(ward){response='ward';heal=Math.min(a.stats.hp-a.hp,14+a.stats.magic*10);a.hp+=heal;}
else if(['hit','break','launch','block'].includes(response)){
damage=Math.round(a.stats.power*move.damage*(isSpell?0.85+a.stats.magic*0.7:1)*(a.stamina<12?0.7:1)*(0.9+rng()*0.2)*(response==='block'?0.18:1)*(response==='break'?1.15:1));
damage=Math.min(Math.ceil(b.hp),Math.max(1,damage));b.hp=Math.max(0,b.hp-damage);a.damage+=damage;
if(response!=='block')a.hits++;b.stamina=Math.max(0,b.stamina-(response==='block'?13:response==='break'?24:6));
if(isSpell&&a.build.spell==='frost')b.slowed=2;
}else if(response==='parry'){b.parries++;b.stamina=Math.max(0,b.stamina-8);}
else if(response==='dodge')b.stamina=Math.max(0,b.stamina-7);
b.memory[move.height]++;a.lastMove=move.id;
const duration=clamp(move.duration/(a.stats.speed*(a.slowed>0?0.82:1)),0.92,2.3);if(a.slowed>0)a.slowed--;
const impact=move.tag==='feint'?0.64:move.tag==='magic'?0.55:0.47;
const reasons={parry:'Reads the '+move.height+' attack and turns the blade aside.',dodge:'Slips the attack with lateral footwork.',block:'Absorbs the strike behind a guarded stance.',break:'A committed strike overwhelms the guard.',hit:isCombo?'Recognises the stagger and extends the combination.':a.stamina<20?'Risks an opening despite low stamina.':'Finds an opening in the opponent’s defence.',launch:'Catches the recovery and lifts the opponent off balance.',ward:'Uses a quiet opening to restore vitality.'};
if(move.tag==='feint')reasons.hit='A false opening draws out the guard before the real strike.';
if(isSpell&&!ward)reasons.hit='Weaves '+SPELLS.find(s=>s.id===a.build.spell).name.toLowerCase()+' into close-range swordplay.';
add({kind:'exchange',attacker,move:move.id,response,damage,heal,duration,impact,isCombo,spacing:Math.min(a.stats.reach+0.05,['kick','shield','close'].includes(move.tag)?1.28:1.82),drift:(rng()-0.5)*0.45,before,after:snapshot(fighters),reason:reasons[response],spell:a.build.spell,knockout:b.hp<=0});
return response;
}
while(time<maxTime&&fighters.every(f=>f.hp>0)){
let attacker=lastAttacker<0?initiative:weighted(rng,fighters.map((f,i)=>[i,(0.4+f.stats.speed*0.45+f.build.aggression/180)*(f.stamina<20?0.4:1)*(lastAttacker===i&&pressure>2?0.4:1)]));
const a=fighters[attacker],b=fighters[1-attacker];
if(a.stamina<24||b.stamina<16||(beats.length>3&&rng()<0.16)){
const before=snapshot(fighters);fighters.forEach(f=>{f.stamina=clamp(f.stamina+20+f.stats.recovery+f.stats.discipline*12,0,100);f.mana=Math.min(f.stats.mana,f.mana+2);});
spacing=2.5+rng()*0.9;add({kind:'footwork',duration:1.25+rng()*0.55,spacing,drift:(rng()-0.5)*1.1,before,after:snapshot(fighters),response:'guard',reason:'Resets the distance and recovers stamina.'});
}
const move=chooseMove(a,b,rng,spacing),response=exchange(attacker,move);spacing=1.8;
if(response==='parry'&&b.hp>0&&a.hp>0&&b.stamina>15&&rng()<0.56+b.stats.counter){attacker=1-attacker;exchange(attacker,moveMap.riposte);}
else if(['hit','break','launch'].includes(response)&&a.hp>0&&b.hp>0&&a.stamina>20&&rng()<0.18+a.stats.combo+a.build.aggression/400+(response==='launch'?0.4:0)){
a.combos++;exchange(attacker,moveMap[response==='launch'?'doublecut':a.build.weapon==='twins'?'doublecut':rng()<0.5?'slash':'thrust'],true,response==='launch'?'hit':null);
if(b.hp>0&&a.stamina>24&&a.stats.combo>0.25&&rng()<0.45)exchange(attacker,moveMap.spin,true);
}
const before=snapshot(fighters);fighters.forEach(f=>{f.stamina=clamp(f.stamina+9+f.stats.recovery*0.45+f.stats.discipline*5,0,100);});
if(fighters.every(f=>f.hp>0))add({kind:'footwork',duration:0.55+rng()*0.4,spacing:1.8+rng()*0.55,drift:(rng()-0.5)*0.8,before,after:snapshot(fighters),response:'guard',reason:'Circles into the next exchange.'});
pressure=lastAttacker===attacker?pressure+1:1;lastAttacker=attacker;
}
const ratio=fighters.map(f=>f.hp/f.stats.hp),winner=ratio[0]===ratio[1]?null:ratio[0]>ratio[1]?0:1,finish=fighters.some(f=>f.hp<=0)?'KNOCKOUT':'DECISION',final=snapshot(fighters);
add({kind:'finish',duration:3.2,winner,spacing:2.25,drift:0,before:final,after:final,response:'guard',reason:finish==='KNOCKOUT'?'The final opening decides the duel.':'The bell awards the duel by remaining vitality.'});
return {seed:Number(seed)>>>0,builds:structuredClone(builds),beats,duration:time,winner,finish,final,stats:fighters.map(f=>f.stats)};
}
export function sampleFight(plan,time){
if(time<2.8)return {kind:'intro',t:time/2.8,spacing:3.6,drift:0,before:plan.beats[0].before,after:plan.beats[0].before,state:plan.beats[0].before,index:-1};
const beat=plan.beats.find(b=>time>=b.start&&time<b.end)||plan.beats.at(-1),t=clamp((time-beat.start)/beat.duration,0,1);
const state=beat.kind==='exchange'?(t>=beat.impact?beat.after:beat.before):beat.after.map((f,i)=>({...f,stamina:beat.before[i].stamina+(f.stamina-beat.before[i].stamina)*t}));
return {...beat,t,state};
}
export function randomBuild(seed,level='standard'){
const rng=seededRandom(seed),build=defaultBuild(1);build.style=STYLES[Math.floor(rng()*STYLES.length)].id;build.weapon=WEAPONS[Math.floor(rng()*WEAPONS.length)].id;build.spell=SPELLS[Math.floor(rng()*SPELLS.length)].id;
build.name=({vanguard:'Hollow Warden',duelist:'Silver Vesper',reaver:'Cinder Reaver',spellblade:'Veil Sorcerer'})[build.style];build.items=[];
const available=[...ITEMS];for(let i=0;i<(level==='initiate'?1:2);i++){const n=Math.floor(rng()*available.length);build.items.push(available.splice(n,1)[0].id);}
const t=TACTICS[Math.floor(rng()*TACTICS.length)];Object.assign(build,{aggression:t.aggression,patience:t.patience,arcana:t.arcana});
if(level==='master'){build.items=['owl',build.style==='reaver'?'hunter':'mirror'];build.patience=Math.min(100,build.patience+15);}
return build;
}
