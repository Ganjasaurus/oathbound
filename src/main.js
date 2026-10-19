import './style.css';
import {Arena} from './arena.js';
import {Sound,Controller} from './input.js';
import {STYLES,WEAPONS,SPELLS,ITEMS,TACTICS,MOVE_LIST,defaultBuild,getStats,itemCost,planFight,sampleFight,randomBuild,clamp} from './combat.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
sword:'M5 19 19 5 20 4 19 9 9 19M5 14l5 5M4 20l3-3',
shield:'M12 3 20 6v6c0 4-5 8-8 10-3-2-8-6-8-10V6Z M12 7v10M8 11h8',
blades:'M4 20 13 4 14 10 8 18M20 20 11 4 10 10 16 18M3 15l7 4M21 15l-7 4',
spear:'M12 22V5M8 8l4-6 4 6-4 3Z',
fortress:'M4 21V8h4V4h3v5h2V4h3v4h4v13M9 21v-5a3 3 0 0 1 6 0v5M4 12h16',
axe:'M12 21V3M12 5c-5-2-9 0-9 5 4 1 7 0 9-2M12 5c5-2 9 0 9 5-4 1-7 0-9-2',
rune:'M12 2 20 12 12 22 4 12Z M12 6v12M8 12h8',
flame:'M13 2c2 7-1 7 1 11 2-1 3-3 3-5 7 8 2 14-5 14S1 16 6 10c0 4 3 5 4 4 1-4-1-7 3-12Z',
snow:'M12 2v20M3 7l18 10M3 17 21 7M9 3l3 3 3-3M9 21l3-3 3 3',
eye:'M2 12c5-8 15-8 20 0-5 8-15 8-20 0Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
knot:'M6 4 20 18 16 22 2 8Z M18 4 4 18 8 22 22 8Z',
gem:'M7 3h10l5 7-10 12L2 10Z M2 10h20M7 3l5 19 5-19',
heart:'M12 21C-2 12 3-2 12 6c9-8 14 6 0 15Z',
wing:'M3 20C4 6 13 1 21 3c-2 10-10 15-18 17Z M3 20 17 7M6 13l7 1',
leaf:'M3 21C2 4 13 3 21 3c0 14-8 18-18 18Z M3 21 16 8',
play:'M8 4 20 12 8 20Z',
pause:'M7 4v16M17 4v16',
arrow:'M4 12h16M14 6l6 6-6 6',
shuffle:'M3 5h3l12 14h3M3 19h3L18 5h3M18 2l3 3-3 3M18 16l3 3-3 3',
sound:'M3 9h4l5-5v16l-5-5H3Z M16 8c3 2 3 6 0 8M19 5c6 4 6 10 0 14',
mute:'M3 9h4l5-5v16l-5-5H3Z M17 9l5 6M22 9l-5 6',
help:'M9 8a3 3 0 1 1 5 3c-2 1-2 2-2 3M12 18v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
gear:'M9 3h6l1 4 4 1v8l-4 1-1 4H9l-1-4-4-1V8l4-1Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
controller:'M7 7h10c3 0 6 11 4 12-2 1-4-4-5-4H8c-1 0-3 5-5 4C1 18 4 7 7 7Z M6 10v5M3.5 12.5h5M16 11h.1M19 13h.1',
check:'M5 12l4 4L20 5',back:'M19 12H4M10 6l-6 6 6 6',
camera:'M3 7h4l2-3h6l2 3h4v13H3Z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
close:'M5 5l14 14M19 5 5 19',star:'M12 2 15 9 23 10 17 15 19 23 12 19 5 23 7 15 1 10 9 9Z',
repeat:'M4 7h13l-3-3M20 17H7l3 3M20 7v6M4 17v-6'
};
const icon=(name,size=22)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(paths[name]||paths.rune)+'"/></svg>';
const tabs=[['style','Discipline','sword'],['armory','Armory','shield'],['instinct','Instinct','eye'],['relics','Relics','gem']];
const state={view:'setup',mode:'ai',shared:true,player:0,tab:'style',builds:[defaultBuild(0),defaultBuild(1)],difficulty:'standard',bestOf:1,round:1,wins:[0,0],plans:[],plan:null,time:0,paused:false,speed:1,camera:'cinematic',lens:true,replaying:false,roundRecorded:false,adapting:false,modal:null,renown:0,low:false,rumble:true};
try{
 const saved=JSON.parse(localStorage.getItem('oathbound.v1')||'null');
 if(saved){
 state.renown=Number(saved.renown)||0;
 if(Array.isArray(saved.builds)&&saved.builds.length===2)state.builds=saved.builds.map((b,i)=>{
 const base=defaultBuild(i);for(const [key,list]of [['style',STYLES],['weapon',WEAPONS],['spell',SPELLS]])if(list.some(v=>v.id===b[key]))base[key]=b[key];
 base.name=String(b.name||base.name).slice(0,24);base.items=Array.isArray(b.items)?[...new Set(b.items)].filter(id=>ITEMS.some(v=>v.id===id)).slice(0,3):base.items;
 while(itemCost(base)>8)base.items.pop();for(const key of ['aggression','patience','arcana'])base[key]=clamp(Number.isFinite(Number(b[key]))?Number(b[key]):base[key],0,100);
 if(['sage','rust','ivory','violet'].includes(b.color))base.color=b.color;return base;
 });
 }
}catch{}
const save=()=>{try{localStorage.setItem('oathbound.v1',JSON.stringify({builds:state.builds,renown:state.renown}));}catch{}};
$('#app').innerHTML=`
<div id="arena" class="arena" aria-label="3D medieval fighting arena"></div><div class="atmosphere"></div>
<header class="topbar"><a class="brand" href="#" aria-label="Oathbound home"><span class="brand-sigil">${icon('blades',31)}</span><span>OATHBOUND<small>THE LIVING DUEL</small></span></a><div class="top-center"><span class="live-dot"></span> PROTOTYPE <span class="version">01</span></div><div class="top-tools"><span id="pad-status" class="pad-status">${icon('controller',19)} <span>Keyboard & mouse</span></span><button class="icon-button" data-action="sound" aria-label="Toggle sound" id="sound-button">${icon('sound')}</button><button class="icon-button" data-action="help" aria-label="How to play">${icon('help')}</button><button class="icon-button" data-action="settings" aria-label="Settings">${icon('gear')}</button></div></header>
<main id="setup" class="setup"></main>
<section id="fight-hud" class="fight-hud" hidden><div class="fighter-hud p1" id="hud0"></div><div class="match-clock"><span id="round-label">ROUND 01</span><strong id="clock">60</strong><span id="seed-label"></span></div><div class="fighter-hud p2" id="hud1"></div></section>
<div id="fight-overlay" class="fight-overlay" hidden><div id="callout" class="callout"></div><div id="ai-lens" class="ai-lens"></div><div class="playback"><div class="playback-main"><button class="small-button" data-action="pause" id="pause-button">${icon('pause',16)} Pause</button><button class="small-button" data-action="speed" id="speed-button">1×</button><button class="small-button" data-action="camera" id="camera-button">${icon('camera',17)} Cinematic</button><button class="small-button" data-action="lens" id="lens-button">${icon('eye',17)} AI lens</button><button class="small-button" data-action="forge">${icon('back',16)} Forge</button></div><div class="progress-track"><div id="progress-fill"></div></div><div class="replay-scrub" id="scrub-wrap" hidden><label for="scrub">REPLAY</label><input id="scrub" type="range" min="0" max="1000" value="0" aria-label="Scrub replay"></div></div></div>
<footer class="bottom-bar"><span class="footer-mark">STEEL. INSTINCT. SPECTACLE.</span><div id="control-hints"></div><span class="renown" id="renown"></span></footer>
<div id="modal-root"></div><div id="toast" class="toast" role="status"></div>
`;
const sound=new Sound();
let controller,arena;
try{arena=new Arena($('#arena'),beat=>{sound.impact(beat);if(state.rumble)controller?.rumble(beat.move==='spell'?0.40:beat.response==='parry'?0.15:0.23);});}
catch(error){
 $('#arena').innerHTML='<div class="graphics-error"><h2>3D graphics could not start</h2><p>Enable hardware acceleration and open this game in Chrome or Edge.</p><code>'+esc(error.message)+'</code></div>';
}
controller=new Controller(handlePad,pads=>{
 $('#pad-status').innerHTML=icon('controller',19)+' <span>'+(pads.length===0?'Keyboard & mouse':pads.length===1?'Controller connected':pads.length+' controllers connected')+'</span>';
 $('#pad-status').classList.toggle('connected',pads.length>0);
},()=>!state.modal&&state.view==='setup'&&state.mode==='local'&&!state.shared&&controller?.pads.length>=2?state.player:null);
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
function statBars(build){
 const s=getStats(build),bars=[['Vitality',s.hp/190,s.hp],['Power',s.power/26,s.power],['Speed',s.speed/1.6,s.speed.toFixed(2)+'×'],['Guard',s.guard,Math.round(s.guard*100)],['Insight',s.insight,Math.round(s.insight*100)],['Arcana',s.magic,Math.round(s.magic*100)]];
 return bars.map(([name,ratio,value])=>'<div class="stat"><span>'+name+'</span><div class="stat-track"><i style="width:'+clamp(ratio*100,0,100)+'%"></i></div><b>'+value+'</b></div>').join('');
}
function renderSetup(){
 state.view='setup';arena&&(arena.preview=true);$('#setup').hidden=false;$('#fight-hud').hidden=true;$('#fight-overlay').hidden=true;document.body.classList.remove('in-fight');
 const b=state.builds[state.player],style=STYLES.find(v=>v.id===b.style);
 $('#setup').innerHTML=`
 <div class="hero"><p class="eyebrow"><span></span> A CINEMATIC AUTO-FIGHTER</p><h1>Build an instinct.<br><em>Forge a legend.</em></h1><p class="hero-description">You shape the fighter.<br>The instincts write the fight.</p><div class="mode-switch" role="group" aria-label="Game mode"><button data-action="mode" data-value="ai" class="${state.mode==='ai'?'active':''}">${icon('sword',17)} Versus AI</button><button data-action="mode" data-value="local" class="${state.mode==='local'?'active':''}">${icon('controller',19)} Local duel</button></div><div class="mode-options">${state.mode==='ai'?`<label>OPPONENT <select id="difficulty" aria-label="AI difficulty"><option value="initiate" ${state.difficulty==='initiate'?'selected':''}>Initiate</option><option value="standard" ${state.difficulty==='standard'?'selected':''}>Seasoned</option><option value="master" ${state.difficulty==='master'?'selected':''}>Master</option></select></label>`:`<button class="text-choice ${state.shared?'active':''}" data-action="shared" data-value="true">Pass & play</button><span> / </span><button class="text-choice ${!state.shared?'active':''}" data-action="shared" data-value="false">Two controllers</button>`}<label class="format-label"><select id="format" aria-label="Match format"><option value="1" ${state.bestOf===1?'selected':''}>Single duel</option><option value="3" ${state.bestOf===3?'selected':''}>Best of three</option></select></label></div></div>
 <div class="arena-label"><span class="location-mark">${icon('fortress',24)}</span><div><p>THE OLD KEEP</p><span>Torchlit proving ground</span></div><span class="location-line"></span><span class="arena-tag">3D · LIVE PREVIEW</span></div>
 <aside class="forge" aria-label="Fighter customization"><div class="forge-heading"><div class="forge-player"><span class="player-dot ${state.player===1?'rust':''}"></span> PLAYER ${state.player+1}<span class="forge-step">${state.adapting?'ROUND '+state.round+' · ADAPT':state.mode==='local'?(state.player===0?'01 / 02':'02 / 02'):'YOUR FIGHTER'}</span></div><div class="name-line"><input id="fighter-name" value="${esc(b.name)}" maxlength="24" aria-label="Fighter name"><button class="icon-button compact" data-action="random" aria-label="Randomize fighter" title="Randomize fighter">${icon('shuffle',18)}</button></div><p class="fighter-subtitle">${style.title}</p></div>
 <nav class="forge-tabs" aria-label="Customization categories">${tabs.map(([id,name,glyph])=>'<button data-action="tab" data-value="'+id+'" class="'+(state.tab===id?'active':'')+'" aria-current="'+(state.tab===id?'true':'false')+'">'+icon(glyph,16)+'<span>'+name+'</span></button>').join('')}</nav>
 <div class="forge-scroll" id="forge-scroll">${renderTab(b)}<div class="stats" id="stats">${statBars(b)}</div></div>
 <div class="forge-bottom"><div class="appearance"><span>HERALDRY</span><div class="swatches">${['sage','rust','ivory','violet'].map(color=>'<button class="swatch '+color+' '+(b.color===color?'selected':'')+'" data-action="color" data-value="'+color+'" aria-label="'+color+' armor color" aria-pressed="'+(b.color===color)+'">'+(b.color===color?icon('check',13):'')+'</button>').join('')}</div><span class="equipment-count">${b.items.length} / 3 RELICS</span></div><button class="ready-button" data-action="ready"><span class="pad-letter a">A</span><span>${state.mode==='local'&&state.player===0?'Lock in · Player two':state.adapting?'Begin round '+state.round:'Enter the arena'}</span>${icon('arrow',20)}</button><p class="ready-note">${state.mode==='local'&&state.player===0?(state.shared?'Lock in your build, then pass the controller.':'Each player builds a fighter in turn.'):'The duel is planned. The performance is live.'}</p></div>
 </aside>`;
 $('#control-hints').innerHTML='<span><i class="pad-letter a">A</i> Select</span><span><i class="pad-letter b">B</i> Back</span><span><i class="pad-wide">LB / RB</i> Category</span><span class="keyboard-hint">Arrows + Enter work too</span>';
 $('#renown').innerHTML=icon('star',13)+' '+state.renown+' ROUND WINS';
 arena?.setFighters(state.builds);
 save();
}
function renderTab(b){
 if(state.tab==='style')return `<div class="section-caption"><span>CHOOSE YOUR DISCIPLINE</span><span>01</span></div><div class="style-grid">${STYLES.map(s=>`<button class="style-card ${b.style===s.id?'selected':''}" data-action="style" data-value="${s.id}" aria-pressed="${b.style===s.id}"><span class="card-icon" style="color:${s.color}">${icon(s.glyph,28)}</span><span class="card-check">${b.style===s.id?icon('check',13):''}</span><strong>${s.name}</strong><small>${s.description}</small></button>`).join('')}</div><div class="forge-tip">${icon('eye',16)}<p>Your discipline changes how your fighter reads openings, commits to attacks, and recovers.</p></div>`;
 if(state.tab==='armory')return `<div class="section-caption"><span>STEEL & SPELL</span><span>02</span></div><div class="weapon-grid">${WEAPONS.map(w=>`<button class="weapon-card ${b.weapon===w.id?'selected':''}" data-action="weapon" data-value="${w.id}" aria-pressed="${b.weapon===w.id}">${icon(w.glyph,30)}<strong>${w.name}</strong><small>${w.detail}</small></button>`).join('')}</div><div class="section-caption secondary"><span>A TOUCH OF MAGIC</span><span>ONE SPELL</span></div><div class="spell-grid">${SPELLS.map(s=>`<button class="spell-card ${b.spell===s.id?'selected':''}" data-action="spell" data-value="${s.id}" title="${s.detail}" aria-pressed="${b.spell===s.id}"><span style="color:${s.color}">${icon(s.glyph,24)}</span><strong>${s.name}</strong></button>`).join('')}</div><p class="detail-note">${SPELLS.find(s=>s.id===b.spell).detail} Mana is limited; your instincts decide when to use it.</p>`;
 if(state.tab==='instinct')return `<div class="section-caption"><span>TEACH AN INSTINCT</span><span>03</span></div><div class="tactic-grid">${TACTICS.map(t=>`<button class="tactic-card ${b.aggression===t.aggression&&b.patience===t.patience&&b.arcana===t.arcana?'selected':''}" data-action="tactic" data-value="${t.id}"><strong>${t.name}</strong><small>${t.description}</small></button>`).join('')}</div><div class="sliders">${[['aggression','Pressure','Patient','Relentless'],['patience','Discipline','Instinctive','Deliberate'],['arcana','Magic affinity','Steel first','Rune weaver']].map(([id,name,l,r])=>`<label class="slider-label" for="${id}"><span>${name}</span><b id="${id}-value">${b[id]}</b></label><input type="range" id="${id}" data-tuning="${id}" min="0" max="100" value="${b[id]}" aria-label="${name}"><div class="slider-ends"><span>${l}</span><span>${r}</span></div>`).join('')}</div><p class="detail-note">These are priorities, not commands. Your fighter still reads distance, fatigue, and the opponent’s habits.</p>`;
 return `<div class="section-caption"><span>EQUIP YOUR ADVANTAGE</span><span>${itemCost(b)} / 8 MARKS</span></div><p class="detail-note relic-note">Three slots. Eight marks. A keener mind can beat a stronger blade.</p><div class="relic-grid">${ITEMS.map(item=>{
 const selected=b.items.includes(item.id),locked=!selected&&(b.items.length>=3||itemCost(b)+item.cost>8);
 return `<button class="relic-card ${selected?'selected':''} ${locked?'unavailable':''}" data-action="item" data-value="${item.id}" aria-pressed="${selected}" aria-label="${item.name}: ${item.description}" title="${item.description}"><span class="relic-icon">${icon(item.glyph,24)}</span><span class="relic-text"><small>${item.type}</small><strong>${item.name}</strong><span>${item.description}</span></span><b class="relic-cost">${selected?icon('check',13):item.cost}</b></button>`;
 }).join('')}</div>`;
}
function newSeed(){return crypto.getRandomValues(new Uint32Array(1))[0];}
function ready(){
 sound.unlock();sound.click();save();
 if(state.mode==='local'&&state.player===0){showModal('handoff');return;}
 if(!state.adapting){state.wins=[0,0];state.round=1;state.plans=[];}
 if(state.mode==='ai'&&!state.adapting)state.builds[1]=randomBuild(newSeed(),state.difficulty);
 startFight();
}
function startFight(replay=false){ const recorded=state.roundRecorded;
 closeModal();state.view='fight';state.paused=false;state.time=0;state.replaying=replay;state.roundRecorded=replay&&recorded;
 if(!replay){state.plan=planFight(state.builds,newSeed());state.plans.push(state.plan);state.roundRecorded=false;state.adapting=false;}
 arena&&(arena.preview=false);arena?.setFighters(state.plan.builds);arena?.resetReplay();
 $('#setup').hidden=true;$('#fight-hud').hidden=false;$('#fight-overlay').hidden=false;document.body.classList.add('in-fight');
 for(let i=0;i<2;i++){
 const b=state.plan.builds[i],s=STYLES.find(s=>s.id===b.style),w=WEAPONS.find(w=>w.id===b.weapon);
 $('#hud'+i).innerHTML=`<div class="hud-name"><span>${state.mode==='ai'&&i===1?'AI · ':('P'+(i+1)+' · ')}${esc(b.name)}</span><div class="round-pips">${Array.from({length:state.bestOf===3?2:1},(_,j)=>'<i class="'+(state.wins[i]>j?'won':'')+'"></i>').join('')}</div></div><div class="health-track"><div id="health${i}"></div></div><div class="hud-details"><span>${s.name.replace('The ','')} · ${w.name}</span><b id="hp${i}"></b></div><div class="resource-bars"><div class="resource stamina" title="Stamina"><span>STAMINA</span><i><b id="stamina${i}"></b></i></div><div class="resource mana" title="Mana"><span>MANA</span><i><b id="mana${i}"></b></i></div></div>`;
 }
 $('#round-label').textContent='ROUND '+String(state.round).padStart(2,'0');$('#seed-label').textContent='SEED '+state.plan.seed;
 $('#scrub-wrap').hidden=!replay;
 $('#control-hints').innerHTML='<span><i class="pad-letter a">A</i> Pause</span><span><i class="pad-letter x">X</i> Speed</span><span><i class="pad-letter y">Y</i> Camera</span><span class="keyboard-hint">Space · pause / C · camera / Esc · menu</span>';
 sound.bell();updatePlayback();$('#pause-button').focus({preventScroll:true});
}
function updatePlayback(){
 $('#pause-button').innerHTML=icon(state.paused?'play':'pause',16)+' '+(state.paused?'Play':'Pause');$('#speed-button').textContent=state.speed+'×';$('#camera-button').innerHTML=icon('camera',17)+' '+(state.camera==='cinematic'?'Cinematic':'Side view');$('#lens-button').classList.toggle('active',state.lens);$('#ai-lens').hidden=!state.lens;arena&&(arena.cameraMode=state.camera);
}
function returnForge(adapt=false){
 closeModal();state.player=0;state.tab='style';state.paused=false;state.adapting=adapt;state.replaying=false;
 if(!adapt){state.round=1;state.wins=[0,0];state.plans=[];}
 renderSetup();
}
function showModal(type){
 state.modal=type;$('#modal-root').innerHTML='<div class="modal-backdrop"><section class="modal '+(type==='result'?'result-modal':'')+'" role="dialog" aria-modal="true" aria-label="'+type+'" tabindex="-1">'+modalContent(type)+'</section></div>';
 if(type==='pause')state.paused=true;
 const el=$('#modal-root button.primary')||$('#modal-root button');el?.focus({preventScroll:true});
}
function closeModal(){state.modal=null;$('#modal-root').innerHTML='';}
function modalContent(type){
 if(type==='handoff')return `<p class="eyebrow">LOCAL DUEL · PLAYER ONE IS READY</p><div class="handoff-icon">${icon('controller',50)}</div><h2>Your turn,<br><em>player two.</em></h2><p>${state.shared?'Pass the controller and build your fighter.':'Player two can now use their controller to build a fighter.'}</p><div class="modal-actions"><button class="primary" data-action="handoff"><i class="pad-letter a">A</i> Build player two ${icon('arrow',18)}</button><button class="secondary" data-action="close">${icon('back',16)} Back to player one</button></div>`;
 if(type==='help')return `<p class="eyebrow">WELCOME TO THE OLD KEEP</p><h2>Write the instinct.<br><em>Watch the duel.</em></h2><ol class="help-steps"><li><b>Forge your fighter.</b> Pick a discipline, weapon, spell, and up to three relics within eight marks.</li><li><b>Teach a fighting instinct.</b> Set pressure, discipline, and magic affinity. Smart relics change decisions; attribute relics change the body.</li><li><b>Let the fight unfold.</b> The AI plans a complete duel, reading habits, stamina, range, and openings. Smooth movement presents those decisions in real time.</li><li><b>Learn, adapt, replay.</b> Watch the AI lens, compare the result, and replay the same seed. Best-of-three matches let you adjust builds between rounds.</li></ol><div class="control-table"><span>Xbox</span><span>Keyboard</span><span>Navigate</span><b>D-pad / left stick</b><b>Arrows / Tab</b><span>Select / pause</span><b>A / Menu</b><b>Enter / Space</b><span>Back / menu</span><b>B</b><b>Esc</b><span>Forge category</span><b>LB / RB</b><b>Q / E</b><span>Speed / camera</span><b>X / Y</b><b>F / C</b></div><p class="detail-note">Plug in a standard Xbox controller and press a button to connect. Shared-controller local play works with one pad; two-controller play assigns the first pad to P1 and the second to P2.</p><button class="primary" data-action="close">Understood ${icon('arrow',18)}</button>`;
 if(type==='settings')return `<p class="eyebrow">MAKE YOURSELF COMFORTABLE</p><h2>The director’s<br><em>preferences.</em></h2><div class="settings-list"><button data-action="sound"><span>Sound effects<small>Procedural steel, impacts, and spell tones</small></span><b>${sound.enabled?'ON':'OFF'}</b></button><button data-action="quality"><span>Graphics quality<small>Lower quality disables shadows and reduces resolution</small></span><b>${state.low?'LOW':'HIGH'}</b></button><button data-action="rumble"><span>Controller vibration<small>Brief feedback when a strike lands</small></span><b>${state.rumble?'ON':'OFF'}</b></button><button data-action="camera"><span>Camera direction<small>Gentle cinematic motion or a fixed side camera</small></span><b>${state.camera==='cinematic'?'CINEMA':'SIDE'}</b></button></div><button class="primary" data-action="close">Return ${icon('arrow',18)}</button>`;
 if(type==='pause')return `<p class="eyebrow">THE ARENA HOLDS ITS BREATH</p><h2>A moment<br><em>between blows.</em></h2><div class="modal-actions"><button class="primary" data-action="continue">${icon('play',17)} Continue the duel</button><button class="secondary" data-action="replay">${icon('repeat',17)} Replay this choreography</button><button class="secondary" data-action="forge">${icon('back',17)} Return to the forge</button></div>`;
 if(type==='result'){
 const plan=state.plan,w=plan.winner,complete=state.bestOf===1||state.wins.some(n=>n>=2),title=w===null?'An even oath.':plan.builds[w].name,stats=plan.final;
 return `<p class="eyebrow">${complete?'THE DUEL IS DECIDED':'ROUND '+state.round+' IS DECIDED'} · ${plan.finish}</p><div class="result-symbol">${icon(w===null?'blades':'star',40)}</div><h2>${esc(title)}<br><em>${w===null?'Honours shared.':complete?'Claims the arena.':'Takes the round.'}</em></h2><p class="result-score">${esc(plan.builds[0].name)} <b>${state.wins[0]} : ${state.wins[1]}</b> ${esc(plan.builds[1].name)}</p><div class="result-stats"><div><span>THE PERFORMANCE</span><b>P1</b><b>P2</b></div>${[['Clean hits','hits'],['Damage dealt','damage'],['Parries','parries'],['Combo openings','combos'],['Spells woven','casts']].map(([l,k])=>'<div><span>'+l+'</span><b>'+Math.round(stats[0][k])+'</b><b>'+Math.round(stats[1][k])+'</b></div>').join('')}</div><p class="result-seed">SEED ${plan.seed} <span>·</span> ${plan.duration.toFixed(1)} SECONDS <span>·</span> ${plan.beats.filter(b=>b.kind==='exchange').length} EXCHANGES</p><div class="modal-actions"><button class="primary" data-action="${complete?'rematch':'nextRound'}"><i class="pad-letter a">A</i> ${complete?'Another duel':'Begin round '+(state.round+1)} ${icon('arrow',18)}</button><div class="split-actions"><button class="secondary" data-action="replay">${icon('repeat',16)} Watch replay</button><button class="secondary" data-action="${complete?'forge':'adapt'}">${icon('eye',16)} ${complete?'Change build':'Adapt loadouts'}</button></div></div>`;
 }
 return '';
}
function finishRound(){
 if(!state.roundRecorded){
 state.roundRecorded=true;const w=state.plan.winner;if(w!==null)state.wins[w]++;
 if(w===0){state.renown++;save();}sound.bell();
 }
 state.view='result';showModal('result');
}
function cycleSpeed(){const speeds=[0.5,1,1.5,2];state.speed=speeds[(speeds.indexOf(state.speed)+1)%speeds.length];updatePlayback();}
function action(name,value){
 sound.unlock();if(!['pause','continue','speed','camera','lens'].includes(name))sound.click();
 const b=state.builds[state.player];
 switch(name){
 case 'mode':state.mode=value;state.player=0;state.adapting=false;renderSetup();break;
 case 'shared':state.shared=value==='true';renderSetup();break;
 case 'tab':state.tab=value;renderSetup();break;
 case 'style':b.style=value;renderSetup();break;
 case 'weapon':b.weapon=value;renderSetup();break;
 case 'spell':b.spell=value;renderSetup();break;
 case 'color':b.color=value;renderSetup();break;
 case 'tactic':{const t=TACTICS.find(t=>t.id===value);Object.assign(b,{aggression:t.aggression,patience:t.patience,arcana:t.arcana});renderSetup();break;}
 case 'item':
 if(b.items.includes(value))b.items=b.items.filter(id=>id!==value);
 else{const item=ITEMS.find(i=>i.id===value);if(b.items.length>=3){toast('Three relic slots are full. Unequip one to make room.');return;}if(itemCost(b)+item.cost>8){toast('This would exceed eight marks. Unequip a relic first.');return;}b.items.push(value);}
 renderSetup();break;
 case 'random':{const color=b.color;state.builds[state.player]={...randomBuild(newSeed()),name:state.player===0?'Ashen Knight':'Hollow Warden',color};renderSetup();toast('A new instinct is forged.');break;}
 case 'ready':ready();break;
 case 'handoff':closeModal();state.player=1;state.tab='style';renderSetup();$('#fighter-name').blur();$('.style-card')?.focus();break;
 case 'close':closeModal();if(state.view==='fight'){state.paused=false;updatePlayback();}break;
 case 'help':if(state.view==='fight')state.paused=true;showModal('help');break;
 case 'settings':if(state.view==='fight')state.paused=true;showModal('settings');break;
 case 'sound':sound.enabled=!sound.enabled;$('#sound-button').innerHTML=icon(sound.enabled?'sound':'mute');if(state.modal==='settings')showModal('settings');break;
 case 'quality':state.low=!state.low;arena?.setQuality(state.low);showModal('settings');break;
 case 'rumble':state.rumble=!state.rumble;showModal('settings');break;
 case 'pause':state.paused=!state.paused;updatePlayback();break;
 case 'continue':closeModal();state.paused=false;updatePlayback();break;
 case 'speed':cycleSpeed();break;
 case 'camera':state.camera=state.camera==='cinematic'?'side':'cinematic';updatePlayback();if(state.modal==='settings')showModal('settings');break;
 case 'lens':state.lens=!state.lens;updatePlayback();break;
 case 'forge':returnForge();break;
 case 'replay':startFight(true);break;
 case 'rematch':state.round=1;state.wins=[0,0];state.plans=[];startFight();break;
 case 'nextRound':state.round++;startFight();break;
 case 'adapt':state.round++;returnForge(true);break;
 }
}
$('#app').addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;
 const name=el.dataset.action,value=el.dataset.value;action(name,value);
 if(state.view==='setup'&&!state.modal){const target=$$('[data-action="'+name+'"]').find(n=>n.dataset.value===value);target?.focus({preventScroll:true});}
});
$('.brand').addEventListener('click',e=>{e.preventDefault();if(state.view==='setup')return;returnForge();});
$('#app').addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='fighter-name'){state.builds[state.player].name=el.value.trim()||'Nameless Knight';save();}
 if(el.dataset.tuning){state.builds[state.player][el.dataset.tuning]=Number(el.value);$('#'+el.dataset.tuning+'-value').textContent=el.value;save();}
 if(el.id==='scrub'&&state.plan){state.time=Number(el.value)/1000*state.plan.duration;state.paused=true;arena?.resetReplay();updatePlayback();}
});
$('#app').addEventListener('change',e=>{
 if(e.target.id==='difficulty')state.difficulty=e.target.value;
 if(e.target.id==='format')state.bestOf=Number(e.target.value);
});
function navigable(){const scope=state.modal?$('#modal-root'):state.view==='setup'?$('#setup'):$('#fight-overlay');return [...scope.querySelectorAll('button:not([disabled]),input[type="range"],select')].filter(e=>e.getClientRects().length);}
function navigate(direction){
 const elements=navigable();if(!elements.length)return;
 const current=elements.includes(document.activeElement)?document.activeElement:null;
 if(!current){elements[0].focus({preventScroll:true});return;}
 if(current.type==='range'&&(direction==='left'||direction==='right')){current.value=clamp(Number(current.value)+(direction==='right'?5:-5),Number(current.min),Number(current.max));current.dispatchEvent(new Event('input',{bubbles:true}));return;}
 if(current.tagName==='SELECT'&&(direction==='left'||direction==='right')){current.selectedIndex=clamp(current.selectedIndex+(direction==='right'?1:-1),0,current.options.length-1);current.dispatchEvent(new Event('change',{bubbles:true}));return;}
 const a=current.getBoundingClientRect(),cx=a.x+a.width/2,cy=a.y+a.height/2,vertical=direction==='up'||direction==='down',sign=direction==='up'||direction==='left'?-1:1;
 let best=null,score=Infinity;
 for(const e of elements){if(e===current)continue;const r=e.getBoundingClientRect(),dx=r.x+r.width/2-cx,dy=r.y+r.height/2-cy,along=(vertical?dy:dx)*sign,cross=Math.abs(vertical?dx:dy);if(along<4)continue;const value=along+cross*2.2;if(value<score){best=e;score=value;}}
 if(best){best.focus({preventScroll:true});best.scrollIntoView({block:'nearest',behavior:'smooth'});}
}
function handlePad(name){
 if(['up','down','left','right'].includes(name)){navigate(name);return;}
 if(state.modal){
 if(name==='back'){if(state.modal==='result')returnForge();else if(state.modal==='pause')action('continue');else action('close');return;}
 if(name==='confirm'||name==='start'){if(document.activeElement?.closest('#modal-root')&&document.activeElement.tagName==='BUTTON')document.activeElement.click();else $('#modal-root .primary')?.click();}return;
 }
 if(state.view==='setup'){
 if(name==='confirm'){if(document.activeElement?.tagName==='BUTTON')document.activeElement.click();else navigable()[0]?.focus();}
 if(name==='start')ready();
 if(name==='secondary')action('random');
 if(name==='tabPrev'||name==='tabNext'){const n=tabs.findIndex(t=>t[0]===state.tab);action('tab',tabs[(n+(name==='tabNext'?1:3))%4][0]);$('.forge-tabs .active')?.focus({preventScroll:true});}
 if(name==='back'&&state.player===1){state.player=0;renderSetup();}
 }else if(state.view==='fight'){
 if(name==='confirm')action('pause');
 if(name==='start'||name==='back')showModal('pause');
 if(name==='secondary')cycleSpeed();
 if(name==='camera')action('camera');
 }
}
window.addEventListener('keydown',e=>{
 if(e.key==='Tab'&&state.modal){
 const choices=navigable();if(choices.length){e.preventDefault();const index=choices.indexOf(document.activeElement);choices[(index+(e.shiftKey?-1:1)+choices.length)%choices.length].focus();}return;
 }
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(e.key==='Escape'){e.preventDefault();handlePad('back');return;}
 if(e.key==='Enter'&&document.activeElement?.tagName!=='BUTTON'){e.preventDefault();handlePad('confirm');return;}
 if(e.key.startsWith('Arrow')){e.preventDefault();navigate(e.key.slice(5).toLowerCase());return;}
 if(state.modal)return;
 if(state.view==='fight'){
 if(e.code==='Space'){e.preventDefault();action('pause');}
 if(e.key.toLowerCase()==='c')action('camera');
 if(e.key.toLowerCase()==='f')cycleSpeed();
 if(e.key.toLowerCase()==='r')startFight(true);
 }else{
 if(e.key.toLowerCase()==='q')handlePad('tabPrev');
 if(e.key.toLowerCase()==='e')handlePad('tabNext');
 }
 if(e.key.toLowerCase()==='m')action('sound');
});
window.addEventListener('visibilitychange',()=>{if(document.hidden&&state.view==='fight'&&!state.paused){state.paused=true;updatePlayback();}});
let last=performance.now(),elapsed=0,lastCall=-2;
function frame(now){
 const dt=Math.min((now-last)/1000,0.05);last=now;elapsed+=dt;controller.poll(now);
 let sample=null;
 if(state.plan&&['fight','result'].includes(state.view)){
 if(state.view==='fight'&&!state.paused&&!state.modal)state.time=Math.min(state.plan.duration,state.time+dt*state.speed);
 sample=sampleFight(state.plan,state.time);
 for(let i=0;i<2;i++){const s=sample.state[i];$('#health'+i).style.width=(s.hp/s.maxHp*100)+'%';$('#hp'+i).textContent=Math.ceil(s.hp)+' / '+s.maxHp;$('#stamina'+i).style.width=s.stamina+'%';$('#mana'+i).style.width=(s.mana/s.maxMana*100)+'%';}
 $('#clock').textContent=String(Math.max(0,Math.ceil(state.plan.duration-3.2-state.time))).padStart(2,'0');$('#progress-fill').style.width=(state.time/state.plan.duration*100)+'%';
 if(state.replaying)$('#scrub').value=state.time/state.plan.duration*1000;
 if(state.lens){
 const index=sample.index,landed=sample.kind==='exchange'&&sample.t>=sample.impact;
 if($('#ai-lens').dataset.beat!==index+':'+landed){
 $('#ai-lens').dataset.beat=index+':'+landed;
 const name=sample.kind==='exchange'?state.plan.builds[sample.attacker].name:'THE DUEL';
 const move=sample.kind==='exchange'?MOVE_LIST.find(m=>m.id===sample.move).name:sample.kind==='intro'?'Reading the opponent':sample.kind==='finish'?'The oath is settled':'Footwork & recovery';
 $('#ai-lens').innerHTML='<div class="lens-title">'+icon('eye',15)+' AI LENS <span>'+esc(name)+'</span></div><strong>'+move+(sample.isCombo?' <small>COMBO</small>':'')+'</strong><p>'+(sample.kind==='exchange'&&!landed?'Measures the opening and commits to a line.':sample.reason||'Two instincts. One continuous fight.')+'</p>';
 }
 }
 const call=$('#callout');
 if(sample.kind==='intro'){call.textContent=sample.t<0.55?'READY':'FIGHT';call.className='callout intro show';}
 else if(sample.kind==='exchange'&&sample.t>=sample.impact&&sample.t<sample.impact+0.28){
 const labels={parry:'PARRY',dodge:'EVADE',break:'GUARD BREAK',launch:'LAUNCH',ward:'AEGIS',block:'BLOCK'};
 call.textContent=sample.knockout?'KNOCKOUT':labels[sample.response]||(sample.isCombo?'COMBO':'' );call.className='callout '+(sample.response==='parry'?'cool':'')+' '+(call.textContent?'show':'');
 }else{call.className='callout';}
 if(state.time>=state.plan.duration&&state.view==='fight')finishRound();
 }
 arena?.update(dt,sample?state.time:elapsed,sample);requestAnimationFrame(frame);
}
renderSetup();requestAnimationFrame(frame);
