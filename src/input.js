export class Sound {
  constructor(){this.enabled=true;this.ctx=null;this.volume=0.35;}
  unlock(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(C)this.ctx=new C();}this.ctx?.resume().catch(()=>{});}
  tone(freq,type,duration,gain=0.12,slide=0){if(!this.enabled||!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),t+duration);g.gain.setValueAtTime(gain*this.volume,t);g.gain.exponentialRampToValueAtTime(0.001,t+duration);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+duration);}
  click(){this.tone(640,'sine',0.07,0.08,-180);}
  impact(beat){
    if(!this.enabled||!this.ctx)return;
    if(beat.response==='dodge'){this.tone(150,'triangle',0.13,0.04,250);return;}
    if(beat.move==='spell'){this.tone(210,'sine',0.42,0.24,430);this.tone(630,'triangle',0.32,0.08,-310);return;}
    const duration=beat.response==='parry'?0.2:0.13;
    const buffer=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*duration),this.ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
    const source=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=beat.response==='parry'?3200:beat.response==='block'?1400:680;filter.Q.value=0.7;gain.gain.value=this.volume*0.45;source.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);source.start();
    this.tone(beat.response==='parry'?1200:80,beat.response==='parry'?'sine':'triangle',0.18,0.22,-35);
  }
  bell(){[440,660,880].forEach(f=>this.tone(f,'sine',0.9,0.09));}
}
export function gamepadIntent(pad,previous=[],lastDirection=0,now=0){
  if(!pad)return {actions:[],buttons:[],direction:0};
  const buttons=pad.buttons.map(b=>typeof b==='number'?b>0.5:b.pressed);
  const map={0:'confirm',1:'back',2:'secondary',3:'camera',4:'tabPrev',5:'tabNext',9:'start'};
  const actions=Object.entries(map).filter(([n])=>buttons[n]&&!previous[n]).map(([,v])=>v);
  const direction=buttons[12]||pad.axes[1]<-0.55?'up':buttons[13]||pad.axes[1]>0.55?'down':buttons[14]||pad.axes[0]<-0.55?'left':buttons[15]||pad.axes[0]>0.55?'right':0;
  if(direction&&(direction!==lastDirection.direction||now-lastDirection.time>260))actions.push(direction);
  return {actions,buttons,direction};
}
export class Controller {
  constructor(onAction,onChange,seat){
    this.onAction=onAction;this.onChange=onChange;this.seat=seat;this.previous={};this.directions={};this.count=-1;this.pads=[];
    window.addEventListener('gamepadconnected',()=>this.poll(performance.now()));
    window.addEventListener('gamepaddisconnected',()=>this.poll(performance.now()));
  }
  poll(now){
    this.pads=Array.from(navigator.getGamepads?.()||[]).filter(p=>p?.connected&&p.mapping==='standard');
    if(this.pads.length!==this.count){this.count=this.pads.length;this.onChange(this.pads);}
    const required=this.seat();
    for(let n=0;n<this.pads.length;n++){
      const pad=this.pads[n],previous=this.previous[pad.index]||[],last=this.directions[pad.index]||{direction:0,time:0},intent=gamepadIntent(pad,previous,last,now);
      this.previous[pad.index]=intent.buttons;
      if(intent.direction!==last.direction||intent.actions.some(a=>['up','down','left','right'].includes(a)))this.directions[pad.index]={direction:intent.direction,time:now};
      if(required!==null&&n!==required)continue;
      for(const a of intent.actions)this.onAction(a);
    }
  }
  rumble(power=0.25){for(const p of this.pads)p.vibrationActuator?.playEffect('dual-rumble',{duration:100,strongMagnitude:power,weakMagnitude:power*0.5}).catch(()=>{});}
}
