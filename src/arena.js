import * as THREE from 'three';
import { SPELLS, clamp } from './combat.js';
const TAU=Math.PI*2;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
const palette={sage:{cloth:0x446b61,trim:0xc3ad80,eye:0xb2e1ca},rust:{cloth:0x7e4134,trim:0xc6a27a,eye:0xffb595},ivory:{cloth:0xb3a58b,trim:0xdbbf76,eye:0xffdf9d},violet:{cloth:0x5d5274,trim:0xb7a7d2,eye:0xdac4ff}};
function material(color,metalness=0,roughness=0.7){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
function mesh(geometry,mat,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,mat,w,h,d,x=0,y=0,z=0){return mesh(new THREE.BoxGeometry(w,h,d),mat,parent,x,y,z);}
function cylinder(parent,mat,rt,rb,h,x=0,y=0,z=0,n=8){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat,parent,x,y,z);}
function joint(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function makeBlade(parent,steel,gold,length=1.2,wide=0.11){
  const shape=new THREE.Shape();shape.moveTo(-wide,-0.20);shape.lineTo(wide,-0.20);shape.lineTo(wide*0.72,-length);shape.lineTo(0,-length-0.22);shape.lineTo(-wide*0.72,-length);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:0.055,bevelEnabled:true,bevelThickness:0.012,bevelSize:0.012,bevelSegments:1,steps:1});geo.translate(0,0,-0.027);
  mesh(geo,steel,parent);box(parent,gold,wide*4.6,0.06,0.11,0,-0.16,0);cylinder(parent,material(0x302a22),0.04,0.04,0.22,0,-0.015,0);mesh(new THREE.OctahedronGeometry(0.075),gold,parent,0,0.12,0);
}
function makeFighter(build){
  const p=palette[build.color]||palette.sage,root=new THREE.Group(),metal=material(0x6d7777,0.82,0.30),lightMetal=material(0xa1aca5,0.78,0.28),dark=material(0x242c2b,0.52,0.52),cloth=material(p.cloth,0,0.95),gold=material(p.trim,0.67,0.34);
  const glow=new THREE.MeshBasicMaterial({color:p.eye});
  const hips=joint(root,0,1.04,0),spine=joint(hips,0,0.05,0),head=joint(spine,0,0.92,0);
  cylinder(spine,metal,0.37,0.27,0.65,0,0.47,0,6);
  box(spine,cloth,0.38,0.62,0.065,0,0.38,0.255);
  box(spine,gold,0.035,0.52,0.03,0,0.43,0.30);
  mesh(new THREE.OctahedronGeometry(0.09),gold,spine,0,0.57,0.31);
  cylinder(spine,dark,0.18,0.18,0.14,0,0.85,0);
  cylinder(hips,dark,0.27,0.3,0.21,0,-0.04,0);
  box(hips,gold,0.12,0.09,0.12,0,0.02,0.30);
  for(const s of [-1,1]){const plate=box(hips,metal,0.21,0.3,0.12,s*0.2,-0.15,0.22);plate.rotation.z=s*0.14;}
  mesh(new THREE.IcosahedronGeometry(0.24,1),metal,head,0,0.16,0);
  box(head,lightMetal,0.39,0.18,0.15,0,0.15,0.17);
  box(head,dark,0.33,0.046,0.04,0,0.21,0.265);
  box(head,glow,0.23,0.018,0.015,0,0.213,0.291);
  box(head,gold,0.025,0.21,0.028,0,0.12,0.258);
  for(const s of [-1,1])box(head,dark,0.06,0.018,0.018,s*0.10,0.10,0.256);
  if(build.style==='reaver')for(const s of [-1,1]){const horn=mesh(new THREE.ConeGeometry(0.06,0.27,6),gold,head,s*0.22,0.32,0);horn.rotation.z=s*-0.5;}
  if(build.style==='spellblade'){const halo=mesh(new THREE.TorusGeometry(0.26,0.01,5,24),glow,head,0,0.3,-0.02);halo.rotation.x=Math.PI/2;}
  if(build.style==='duelist')box(head,cloth,0.07,0.28,0.23,0,0.39,-0.02);
  const parts={hips,spine,head};
  for(const [label,s]of [['r',-1],['l',1]]){
    const shoulder=joint(spine,s*0.40,0.72,0),elbow=joint(shoulder,0,-0.40,0),hand=joint(elbow,0,-0.37,0);
    const pauldron=mesh(new THREE.IcosahedronGeometry(build.style==='vanguard'?0.25:0.22,0),metal,shoulder,s*0.025,-0.055,0);pauldron.scale.set(1,0.75,1.05);
    cylinder(shoulder,dark,0.11,0.10,0.3,0,-0.22,0);
    cylinder(elbow,metal,0.13,0.09,0.28,0,-0.18,0);
    cylinder(elbow,gold,0.135,0.135,0.065,0,-0.09,0);
    mesh(new THREE.IcosahedronGeometry(0.105),dark,hand,0,-0.025,0);
    const thigh=joint(hips,s*0.18,-0.10,0),knee=joint(thigh,0,-0.45,0);
    cylinder(thigh,dark,0.145,0.12,0.40,0,-0.22,0);
    box(thigh,metal,0.21,0.3,0.12,0,-0.21,0.115);
    mesh(new THREE.IcosahedronGeometry(0.145),lightMetal,knee,0,-0.035,0.035);
    cylinder(knee,metal,0.11,0.09,0.34,0,-0.23,0);
    box(knee,dark,0.21,0.16,0.38,0,-0.43,0.08);
    parts[label+'Shoulder']=shoulder;parts[label+'Elbow']=elbow;parts[label+'Hand']=hand;parts[label+'Thigh']=thigh;parts[label+'Knee']=knee;
  }
  const blade=joint(parts.rHand,0,-0.055,0);
  if(build.weapon==='glaive'){
    cylinder(blade,gold,0.028,0.028,2.1,0,-0.36,0);
    makeBlade(blade,lightMetal,gold,1.45,0.16);blade.rotation.z=0.12;
  }else makeBlade(blade,lightMetal,gold,build.weapon==='greatsword'?1.52:build.weapon==='twins'?0.80:1.08,build.weapon==='greatsword'?0.16:0.10);
  if(build.weapon==='greatsword'){cylinder(blade,material(0x302a22),0.04,0.04,0.29,0,0.18,0);mesh(new THREE.OctahedronGeometry(0.07),gold,blade,0,0.36,0);}
  if(build.weapon==='twins')makeBlade(parts.lHand,lightMetal,gold,0.8,0.085);
  if(build.weapon==='swordshield'){
    const shield=joint(parts.lHand,0,-0.03,0.09);shield.rotation.x=1.4;
    const shape=new THREE.Shape();shape.moveTo(-0.27,0.29);shape.lineTo(0.27,0.29);shape.lineTo(0.28,-0.07);shape.lineTo(0,-0.46);shape.lineTo(-0.28,-0.07);shape.closePath();
    mesh(new THREE.ExtrudeGeometry(shape,{depth:0.065,bevelEnabled:true,bevelSegments:1,bevelThickness:0.025,bevelSize:0.02}),gold,shield);
    const face=mesh(new THREE.ShapeGeometry(shape),cloth,shield,0,0.0,0.10);face.scale.setScalar(0.88);
    box(shield,gold,0.045,0.42,0.02,0,0.015,0.13);box(shield,gold,0.3,0.045,0.02,0,0.075,0.13);
    parts.shield=shield;
  }
  let capeParent=spine;const cape=[];
  for(let i=0;i<4;i++){const seg=joint(capeParent,0,i===0?0.75:-0.24,i===0?-0.24:0);box(seg,cloth,0.56+i*0.04,0.26,0.028,0,-0.13,0);cape.push(seg);capeParent=seg;}
  const rune=mesh(new THREE.TorusGeometry(0.13,0.017,6,24),glow,parts.lHand,0,-0.07,0.09);rune.visible=false;
  return {root,parts,cape,blade,rune,build,pose:{},tip:new THREE.Vector3(),base:new THREE.Vector3(),lastX:0,lastZ:0};
}
function idlePose(t,style){
  const b=Math.sin(t*2.7)*0.015;
  return {hipsY:b,hipsX:0.035,spineX:0.05,spineY:0.14,headY:-0.12,
  rShoulder:[-0.40,0.0,-0.22],lShoulder:[-0.65,0.2,0.16],rElbow:[-1.10,0.1,0],lElbow:[-1.02,0,0],
  rThigh:[0.12,0,-0.04],lThigh:[-0.14,0,0.06],rKnee:[0.13,0,0],lKnee:[0.20,0,0]};
}
function poseMix(a,b,t){
  const out={...a};for(const [k,v]of Object.entries(b))out[k]=Array.isArray(v)?v.map((n,i)=>lerp(a[k]?.[i]||0,n,t)):lerp(a[k]||0,v,t);return out;
}
function attackPose(move,t,idle){
  const wind={spineY:-0.65,spineX:-0.08,rShoulder:[-1.30,-0.45,-0.9],rElbow:[-1.65,0,-0.18],lShoulder:[-0.40,0,0.1],hipsY:-0.07,rThigh:[0.28,0,0],lThigh:[-0.3,0,0],lKnee:[0.28,0,0]};
  const hit={spineY:0.70,spineX:0.14,rShoulder:[-0.92,0.40,0.58],rElbow:[-0.15,0,0.12],lShoulder:[-0.50,0.1,0.2],hipsY:-0.09};
  const recovery={spineY:0.22,rShoulder:[-0.6,0.15,0.3],rElbow:[-0.65,0,0]};
  let impact=0.47,first=0.29;
  if(move==='thrust'||move==='riposte'||move==='lunge'){
    Object.assign(wind,{spineY:-0.4,rShoulder:[-0.8,-0.15,-0.18],rElbow:[-1.70,0,0]});
    Object.assign(hit,{spineY:0.24,spineX:0.20,rShoulder:[-1.42,0,0.03],rElbow:[-0.05,0,0],hipsY:-0.08,lThigh:[-0.45,0,0],lKnee:[0.35,0,0]});
  }
  if(move==='overhead'){
    Object.assign(wind,{spineY:-0.18,spineX:-0.10,rShoulder:[-2.70,0,-0.13],rElbow:[-0.65,0,0],lShoulder:[-2.35,0,0.22],lElbow:[-0.80,0,0]});
    Object.assign(hit,{spineY:0.22,spineX:0.34,rShoulder:[-0.84,0,0],rElbow:[-0.22,0,0],lShoulder:[-0.92,0,0.1],lElbow:[-0.35,0,0],hipsY:-0.13});
  }
  if(move==='sweep'){
    Object.assign(wind,{hipsY:-0.32,spineX:0.30,rThigh:[0.55,0,0],lThigh:[-0.5,0,0],rKnee:[0.65,0,0],lKnee:[0.7,0,0]});
    Object.assign(hit,{hipsY:-0.40,spineX:0.45,spineY:0.9,rShoulder:[-0.1,0.3,0.5],rElbow:[-0.3,0,0],rThigh:[0.55,0,0],lThigh:[-0.7,0,0],rKnee:[0.65,0,0],lKnee:[0.70,0,0]});
  }
  if(move==='kick'){
    Object.assign(wind,{spineY:0,spineX:-0.13,rThigh:[-0.82,0,0],rKnee:[1.35,0,0],rShoulder:[-0.75,0,-0.15]});
    Object.assign(hit,{spineY:0.05,spineX:-0.20,rThigh:[-1.54,0,0],rKnee:[0.08,0,0],rShoulder:[-0.7,0,-0.2],rElbow:[-1.2,0,0]});
  }
  if(move==='shieldbash'||move==='pommel'){
    Object.assign(wind,{spineY:0.5,lShoulder:[-0.70,0.3,0.12],lElbow:[-1.6,0,0]});
    Object.assign(hit,{spineY:-0.5,spineX:0.16,lShoulder:[-1.4,0,0.15],lElbow:[-0.3,0,0],rShoulder:[-0.5,0,-0.3],rElbow:[-1.2,0,0]});
  }
  if(move==='launcher'){
    Object.assign(wind,{hipsY:-0.25,spineX:0.27,rShoulder:[0.2,-0.3,-0.3],rElbow:[-0.2,0,0],rKnee:[0.4,0,0],lKnee:[0.45,0,0]});
    Object.assign(hit,{hipsY:0.12,spineX:-0.15,rShoulder:[-2.3,0,0.18],rElbow:[-0.18,0,0],spineY:0.65});
  }
  if(move==='spell'){
    impact=0.55;first=0.40;
    Object.assign(wind,{spineY:0.10,lShoulder:[-1.0,0.35,0.5],lElbow:[-0.9,0,0],rShoulder:[-0.55,0,-0.4],rElbow:[-1.35,0,0]});
    Object.assign(hit,{spineY:-0.15,lShoulder:[-1.45,0,0.10],lElbow:[-0.08,0,0],rShoulder:[-0.55,0,-0.2],rElbow:[-1.15,0,0]});
  }
  if(move==='feint'){
    impact=0.64;first=0.48;
    if(t<0.32)return poseMix(idle,poseMix(wind,hit,smooth(t/0.30)),0.7);
  }
  let out=t<first?poseMix(idle,wind,smooth(t/first)):t<impact?poseMix(poseMix(idle,wind,1),hit,smooth((t-first)/(impact-first))):t<0.68?poseMix(poseMix(idle,hit,1),recovery,smooth((t-impact)/(0.68-impact))):poseMix(poseMix(idle,recovery,1),idle,smooth((t-0.68)/0.32));
  if(move==='spin'){out.spineY+=TAU*smooth(clamp((t-0.2)/0.65,0,1));out.rShoulder=[-1.0,0,-0.6];out.rElbow=[-0.18,0,0];out.hipsY=-0.1;}
  if(move==='doublecut'){
    const second=Math.sin(clamp((t-0.5)/0.35,0,1)*Math.PI);out.spineY=lerp(out.spineY,-0.7,second);
    out.lShoulder=out.lShoulder.map((v,i)=>lerp(v,[-1.1,0,-0.6][i],second));out.lElbow=[-0.3,0,0];
  }
  return out;
}
function defenderPose(response,t,idle,impact,knockout){
  const pulse=Math.sin(clamp((t-impact+0.03)/0.38,0,1)*Math.PI);
  let target={};
  if(response==='block')target={spineX:-0.15,spineY:-0.2,lShoulder:[-1.1,0.1,0.25],lElbow:[-1.35,0,0],rShoulder:[-1.0,0,-0.15],rElbow:[-1.4,0,0],hipsY:-0.11};
  if(response==='parry')target={spineY:-0.45,rShoulder:[-1.6,0.35,-0.4],rElbow:[-0.65,0,0],lShoulder:[-0.65,0,0.35],hipsY:-0.04};
  if(response==='dodge')target={spineX:0.4,spineY:-0.45,hipsY:-0.28,rThigh:[0.4,0,-0.3],lThigh:[-0.3,0,0.2],rKnee:[0.5,0,0],lKnee:[0.5,0,0]};
  if(response==='hit'||response==='break')target={spineX:-0.35,spineY:-0.35,headY:-0.3,rShoulder:[0.15,0,-0.7],lShoulder:[0.10,0,0.7],rElbow:[-0.6,0,0],lElbow:[-0.7,0,0],hipsY:-0.07};
  if(response==='launch')target={hipsY:0.65,hipsX:-0.7,spineX:-0.2,rThigh:[-0.4,0,-0.3],lThigh:[-0.3,0,0.4],rKnee:[0.9,0,0],lKnee:[0.8,0,0],rShoulder:[-1.9,0,-0.6],lShoulder:[-1.7,0,0.6]};
  const defensive=['block','parry','dodge'].includes(response);
  let blend=defensive?Math.sin(clamp((t-0.17)/0.67,0,1)*Math.PI):pulse;
  if(knockout&&t>impact){blend=smooth((t-impact)/0.35);target={...target,hipsY:-0.65,hipsX:0.4,spineX:0.65,rThigh:[-0.65,0,0],lThigh:[-0.65,0,0],rKnee:[1.4,0,0],lKnee:[1.4,0,0],headY:0.15};}
  return poseMix(idle,target,blend);
}
export class Arena {
  constructor(container,onImpact){
    this.container=container;this.onImpact=onImpact;this.preview=true;this.cameraMode='cinematic';this.quality='high';
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x18221e);this.scene.fog=new THREE.FogExp2(0x18221e,0.047);
    this.camera=new THREE.PerspectiveCamera(37,1,0.1,80);this.camera.position.set(6,4.1,11);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;container.appendChild(this.renderer.domElement);
    this.scene.add(new THREE.HemisphereLight(0xd1e8dc,0x33342c,2.2));
    const key=new THREE.DirectionalLight(0xffe5bd,3.8);key.position.set(-3,9,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:8,bottom:-8});key.shadow.bias=-0.0008;this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x92aab3,2.3);rim.position.set(4,5,-5);this.scene.add(rim);
    this.flash=new THREE.PointLight(0xffbe76,0,7);this.scene.add(this.flash);
    this.fighters=[];this.torches=[];this.sparks=[];this.waves=[];this.lastImpact=-1;this.camTarget=new THREE.Vector3(0,1.1,0);this.shake=0;
    this.makeArena();this.makeParticles();this.makeTrails();new ResizeObserver(()=>this.resize()).observe(container);this.resize();
  }
  makeArena(){
    const stone=material(0x444a41,0.04,0.98),darkStone=material(0x252e27,0,1),wood=material(0x3e332a,0,0.9),brass=material(0xaa8d58,0.7,0.45),rope=material(0x6b6556,0,1);
    const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d');ctx.fillStyle='#66695b';ctx.fillRect(0,0,1024,1024);
    let sr=928;const rand=()=>{sr=(sr*16807)%2147483647;return sr/2147483647;};
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=85+rand()*19;ctx.fillStyle='rgb('+v+','+(v+3)+','+(v-6)+')';ctx.fillRect(x*128+2,y*128+2,124,124);ctx.strokeStyle='rgba(29,36,28,.32)';ctx.beginPath();ctx.moveTo(x*128+rand()*110,y*128+5);ctx.lineTo(x*128+rand()*120,y*128+120);ctx.stroke();}
    for(let i=0;i<18000;i++){ctx.fillStyle=rand()<0.5?'rgba(12,19,15,.05)':'rgba(221,206,163,.05)';ctx.fillRect(rand()*1024,rand()*1024,2,2);}
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
    const floorMat=material(0xb3b2a3,0.08,0.93);floorMat.map=tex;
    box(this.scene,darkStone,12,0.6,9,0,-0.52,0);box(this.scene,stone,10.2,0.27,7.3,0,-0.15,0);box(this.scene,floorMat,9.65,0.07,6.85,0,0,0);
    box(this.scene,darkStone,70,0.1,70,0,-0.82,0);
    for(let i=0;i<3;i++)box(this.scene,stone,3.6+0.25*i,0.15,0.48,0,-0.17-i*0.16,3.6+i*0.44);
    const runeMat=new THREE.MeshBasicMaterial({color:0xaf9a70,transparent:true,opacity:0.34,depthWrite:false});
    for(const r of [1.25,1.37,2.2,2.3]){const ring=mesh(new THREE.TorusGeometry(r,0.018,4,80),runeMat,this.scene,0,0.045,0);ring.rotation.x=Math.PI/2;}
    for(let i=0;i<12;i++){const a=i*TAU/12;const mark=box(this.scene,runeMat,0.04,0.005,0.20,Math.cos(a)*1.7,0.05,Math.sin(a)*1.7);mark.rotation.y=-a;}
    for(const x of [-4.7,4.7])for(const z of [-3.25,3.25]){
      cylinder(this.scene,wood,0.13,0.19,1.48,x,0.72,z);cylinder(this.scene,brass,0.17,0.17,0.09,x,1.42,z);
      mesh(new THREE.SphereGeometry(0.15,8,8),brass,this.scene,x,1.57,z);
    }
    const rail=(a,b,y)=>{const points=[new THREE.Vector3(a[0],y,a[1]),new THREE.Vector3((a[0]+b[0])/2,y-0.12,(a[1]+b[1])/2),new THREE.Vector3(b[0],y,b[1])];mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,0.026,5,false),rope,this.scene);};
    for(const y of [0.60,1.04,1.40]){
      rail([-4.7,-3.25],[4.7,-3.25],y);rail([-4.7,-3.25],[-4.7,3.25],y);rail([4.7,-3.25],[4.7,3.25],y);
      // The foreground opening preserves an unobstructed view of the fighters.
    }
    for(const x of [-6.15,6.15])for(const z of [-4.1,4.1]){
      cylinder(this.scene,darkStone,0.35,0.48,0.45,x,-0.50,z);cylinder(this.scene,brass,0.095,0.19,1.5,x,0.40,z);cylinder(this.scene,brass,0.38,0.18,0.28,x,1.22,z);
      const flame=mesh(new THREE.IcosahedronGeometry(0.28,1),new THREE.MeshBasicMaterial({color:0xffb85e}),this.scene,x,1.6,z);flame.scale.set(0.7,1.5,0.7);
      const core=mesh(new THREE.IcosahedronGeometry(0.16),new THREE.MeshBasicMaterial({color:0xffefbc}),flame,0,-0.10,0);
      const light=new THREE.PointLight(0xffac60,4,9,2);light.position.set(x,1.8,z);this.scene.add(light);this.torches.push({flame,light,seed:x+z});
    }
    for(let i=-5;i<=5;i++){
      const x=i*2.9;box(this.scene,darkStone,0.80,7,1,x,2.55,-8.5);box(this.scene,stone,1.13,0.2,1.2,x,5.8,-8.5);
      const arch=mesh(new THREE.TorusGeometry(1.13,0.27,6,20,Math.PI),darkStone,this.scene,x+1.45,3.8,-8.5);
      box(this.scene,darkStone,2.1,0.6,1,x+1.45,5.45,-8.5);
      if(i%2===0){const banner=box(this.scene,material(i%4===0?0x414f45:0x513e33),0.85,2.4,0.045,x,4.0,-7.93);box(banner,brass,0.06,1.8,0.012,0,0,0.03);mesh(new THREE.OctahedronGeometry(0.21),brass,banner,0,0.3,0.045);}
    }
    for(let row=0;row<3;row++){
      box(this.scene,darkStone,29,0.35,0.85,0,-0.25+row*0.43,-5.1-row*0.75);
      for(let i=0;i<18;i++){const x=(i-8.5)*1.43+rand()*0.3;const spectator=joint(this.scene,x,0.05+row*0.43,-5.2-row*0.75);mesh(new THREE.IcosahedronGeometry(0.10),material(0x353a33),spectator,0,0.54,0);cylinder(spectator,material(0x29372f),0.14,0.18,0.36,0,0.28,0);}
    }
  }
  makeParticles(){
    const positions=new Float32Array(110*3);for(let i=0;i<110;i++){positions[i*3]=(Math.random()-0.5)*20;positions[i*3+1]=Math.random()*7;positions[i*3+2]=(Math.random()-0.5)*15;}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    this.dust=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xcbb98b,size:0.025,transparent:true,opacity:0.32,depthWrite:false}));this.scene.add(this.dust);
    this.sparkGeo=new THREE.BufferGeometry();this.sparkGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(180*3),3));this.sparkGeo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(180*3),3));
    this.sparkPoints=new THREE.Points(this.sparkGeo,new THREE.PointsMaterial({size:0.042,vertexColors:true,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));this.scene.add(this.sparkPoints);
  }
  makeTrails(){
    this.trails=[0,1].map(()=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*6*3),3));geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(24*6*3),3));const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));m.frustumCulled=false;this.scene.add(m);return {mesh:m,history:[]};});
  }
  setFighters(builds){
    for(const f of this.fighters){this.scene.remove(f.root);f.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
    this.fighters=builds.map(makeFighter);this.fighters.forEach((f,i)=>{this.scene.add(f.root);f.root.position.set(i===0?-1.5:1.5,0,0);f.root.rotation.y=i===0?Math.PI/2:-Math.PI/2;});
    this.trails.forEach(t=>t.history=[]);this.lastImpact=-1;
  }
  resize(){const {width,height}=this.container.getBoundingClientRect();this.renderer.setSize(width,height,false);this.camera.aspect=width/Math.max(1,height);this.camera.updateProjectionMatrix();}
  burst(position,color=0xffc784,magic=false){
    const c=new THREE.Color(color);for(let i=0;i<(magic?45:25);i++)this.sparks.push({p:position.clone(),v:new THREE.Vector3((Math.random()-0.5)*5,Math.random()*3.4,(Math.random()-0.5)*4),life:0.4+Math.random()*0.6,max:1,color:c});
    this.sparks=this.sparks.slice(-175);this.flash.color.copy(c);this.flash.position.copy(position);this.flash.intensity=magic?8:5;this.shake=magic?0.07:0.045;
    if(magic){const m=mesh(new THREE.TorusGeometry(0.3,0.022,5,44),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false}),this.scene,position.x,position.y,position.z);m.rotation.y=Math.PI/2;this.waves.push({mesh:m,life:0.7});}
  }
  applyPose(f,pose,dt,time){
    const k=1-Math.exp(-23*dt),parts=f.parts;
    parts.hips.position.y=lerp(parts.hips.position.y,1.04+(pose.hipsY||0),k);
    const angles={hips:[pose.hipsX||0,0,0],spine:[pose.spineX||0,pose.spineY||0,0],head:[0,pose.headY||0,0]};
    for(const name of ['rShoulder','lShoulder','rElbow','lElbow','rThigh','lThigh','rKnee','lKnee'])angles[name]=pose[name]||[0,0,0];
    for(const [name,e]of Object.entries(angles)){const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...e,'XYZ'));parts[name].quaternion.slerp(q,k);}
    f.cape.forEach((c,i)=>{c.rotation.x=0.13+Math.sin(time*3.5-i*0.75)*0.09+Math.abs(Math.sin(pose.spineY||0))*0.12;c.rotation.z=Math.sin(time*2+i)*0.025;});
  }
  constrainGrip(f){
    const shoulder=f.parts.lShoulder,elbow=f.parts.lElbow;
    const targetWorld=f.blade.localToWorld(new THREE.Vector3(0,f.build.weapon==='glaive'?0.32:0.21,0));
    const target=f.parts.spine.worldToLocal(targetWorld).sub(shoulder.position);
    const distance=clamp(target.length(),0.04,0.765),direction=target.clone().normalize(),pole=new THREE.Vector3(1,0,-0.4);
    pole.addScaledVector(direction,-pole.dot(direction)).normalize();
    const cosine=clamp((0.4*0.4+distance*distance-0.37*0.37)/(2*0.4*distance),-1,1);
    const elbowPoint=direction.clone().multiplyScalar(0.4*cosine).addScaledVector(pole,0.4*Math.sqrt(1-cosine*cosine));
    shoulder.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),elbowPoint.clone().normalize());
    const forearm=target.clone().sub(elbowPoint).applyQuaternion(shoulder.quaternion.clone().invert()).normalize();
    elbow.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),forearm);
    f.root.updateMatrixWorld(true);
  }
  update(dt,elapsed,sample=null){
    if(!this.fighters.length)return;
    this.torches.forEach(({flame,light,seed})=>{const flick=1+Math.sin(elapsed*9+seed)*0.10+Math.sin(elapsed*17+seed)*0.06;flame.scale.y=1.4*flick;flame.rotation.y=elapsed;light.intensity=3.4*flick;});
    this.dust.rotation.y=elapsed*0.012;
    const spacing=sample?.spacing||3.25,targetDrift=sample?.drift||0;
    this.fighters.forEach((f,i)=>{
      const idle=idlePose(elapsed+i*1.2,f.build.style);let pose=idle;
      const attacking=sample?.kind==='exchange'&&sample.attacker===i;
      if(sample?.kind==='exchange')pose=attacking?attackPose(sample.move,sample.t,idle):defenderPose(sample.response,sample.t,idle,sample.impact,sample.knockout);
      if(sample?.kind==='finish'){
        if(sample.winner===i)pose=poseMix(idle,{rShoulder:[-2.5,0,-0.2],rElbow:[-0.25,0,0],spineX:-0.06},smooth(sample.t));
        else pose=poseMix(idle,{hipsY:-0.55,spineX:0.5,rThigh:[-0.6,0,0],lThigh:[-0.5,0,0],rKnee:[1.4,0,0],lKnee:[1.4,0,0]},0.9);
      }
      let x=(i===0?-1:1)*spacing/2+targetDrift,z=0;
      if(this.preview){x=i===0?-1.15:2.35;z=i===0?0:-0.85;}
      if(sample?.kind==='exchange'){
        const pulse=Math.sin(clamp((sample.t-0.1)/0.7,0,1)*Math.PI);
        if(attacking)x+=(i===0?1:-1)*0.23*pulse;
        else if(sample.response==='dodge')z=-0.65*pulse;
        else if(['hit','break','launch'].includes(sample.response))x+=(i===0?-1:1)*0.2*Math.sin(clamp((sample.t-sample.impact)/0.5,0,1)*Math.PI);
      }
      const moveK=1-Math.exp(-(sample?.kind==='exchange'?12:3.5)*dt),previous=f.root.position.clone();
      f.root.position.x=lerp(f.root.position.x,x,moveK);f.root.position.z=lerp(f.root.position.z,z,moveK);
      const motion=f.root.position.distanceTo(previous)/Math.max(dt,0.001),stride=Math.sin(elapsed*8.5+i*Math.PI)*clamp(motion*0.15,0,0.28);
      if(sample?.kind!=='exchange'&&sample?.kind!=='finish'){pose.rThigh[0]+=stride;pose.lThigh[0]-=stride;pose.hipsY+=Math.abs(stride)*0.08;}
      const face=(i===0?Math.PI/2:-Math.PI/2)+(this.preview?(i===0?-0.24:0.14):0);
      f.root.rotation.y=lerp(f.root.rotation.y,face,1-Math.exp(-8*dt));
      this.applyPose(f,pose,dt,elapsed);
      f.rune.visible=attacking&&sample.move==='spell'&&sample.t>0.12&&sample.t<0.75;
      if(f.rune.visible){f.rune.material.color.set(SPELLS.find(s=>s.id===f.build.spell).color);f.rune.scale.setScalar(1.5+Math.sin(sample.t*Math.PI)*2);f.rune.rotation.z=elapsed*4;}
      f.root.position.y=0;
      f.root.updateMatrixWorld(true);
      const soles=['rKnee','lKnee'].map(name=>f.parts[name].localToWorld(new THREE.Vector3(0,-0.51,0.06)).y);
      f.root.position.y=Math.max(0,0.035-Math.min(...soles));
      f.root.updateMatrixWorld(true);
      if(['greatsword','glaive'].includes(f.build.weapon)&&!f.rune.visible)this.constrainGrip(f);
      const length=f.build.weapon==='greatsword'?1.73:f.build.weapon==='twins'?1.03:f.build.weapon==='glaive'?1.72:1.31;
      f.tip.copy(f.blade.localToWorld(new THREE.Vector3(0,-length,0)));f.base.copy(f.blade.localToWorld(new THREE.Vector3(0,-0.25,0)));
      const trail=this.trails[i],active=attacking&&sample.move!=='spell'&&sample.move!=='kick'&&sample.t>0.25&&sample.t<0.74;
      if(active)trail.history.unshift({tip:f.tip.clone(),base:f.base.clone()});else if(trail.history.length)trail.history.pop();
      trail.history=trail.history.slice(0,13);
      const positions=trail.mesh.geometry.attributes.position,colors=trail.mesh.geometry.attributes.color;
      let n=0;
      for(let j=0;j<trail.history.length-1;j++){
        const a=trail.history[j],b=trail.history[j+1],col=new THREE.Color(i===0?0xdcc393:0xdba289).multiplyScalar(1-j/13);
        for(const p of [a.base,a.tip,b.tip,a.base,b.tip,b.base]){positions.setXYZ(n,p.x,p.y,p.z);colors.setXYZ(n,col.r,col.g,col.b);n++;}
      }
      trail.mesh.geometry.setDrawRange(0,n);positions.needsUpdate=true;colors.needsUpdate=true;
    });
    if(sample?.kind==='exchange'&&sample.t>=sample.impact&&this.lastImpact!==sample.index){
      this.lastImpact=sample.index;
      if(sample.response!=='dodge'){
        const victim=this.fighters[sample.response==='ward'?sample.attacker:1-sample.attacker];
        const point=victim.root.position.clone().add(new THREE.Vector3(0,sample.move==='sweep'?0.65:1.4,0));
        const magic=sample.move==='spell';this.burst(point,magic?SPELLS.find(s=>s.id===sample.spell).color:sample.response==='parry'?0xc7e7e0:0xffc487,magic);
      }
      this.onImpact?.(sample);
    }
    this.flash.intensity*=Math.exp(-12*dt);this.shake*=Math.exp(-10*dt);
    this.sparks=this.sparks.filter(s=>(s.life-=dt)>0);const p=this.sparkGeo.attributes.position,c=this.sparkGeo.attributes.color;
    this.sparks.forEach((s,i)=>{s.v.y-=dt*4;s.p.addScaledVector(s.v,dt);p.setXYZ(i,s.p.x,s.p.y,s.p.z);const fade=clamp(s.life*1.6,0,1);c.setXYZ(i,s.color.r*fade,s.color.g*fade,s.color.b*fade);});
    p.needsUpdate=true;c.needsUpdate=true;this.sparkGeo.setDrawRange(0,this.sparks.length);
    this.waves=this.waves.filter(w=>{w.life-=dt;w.mesh.scale.setScalar(1+(0.7-w.life)*5);w.mesh.material.opacity=w.life;if(w.life<=0){this.scene.remove(w.mesh);w.mesh.geometry.dispose();w.mesh.material.dispose();return false;}return true;});
    const big=sample?.kind==='exchange'&&['spell','overhead','launcher'].includes(sample.move),cameraPunch=big?Math.sin(sample.t*Math.PI)*0.8:0;
    const cinematic=this.cameraMode==='cinematic';
    const desired=this.preview?new THREE.Vector3(5.7,3.3,9.7):new THREE.Vector3(cinematic?1.7+Math.sin(elapsed*0.22)*1.2:0,cinematic?2.9+Math.sin(elapsed*0.17)*0.18:3.25,cinematic?9.6+spacing*0.3-cameraPunch:11.2);
    if(this.camera.aspect<0.85){
      const portrait=clamp(0.91/this.camera.aspect,1,2.4);
      desired.z*=portrait;desired.x*=0.65;desired.y=4.2;
    }
    const target=this.preview?new THREE.Vector3(this.camera.aspect>1.2?1.1:0,1.08,0):new THREE.Vector3(targetDrift*0.4,1.06+(big?0.08:0),0);
    this.camera.position.lerp(desired,1-Math.exp(-2.4*dt));this.camTarget.lerp(target,1-Math.exp(-3.5*dt));
    if(!this.preview&&cinematic){this.camera.position.x+=Math.sin(elapsed*68)*this.shake;this.camera.position.y+=Math.cos(elapsed*53)*this.shake*0.5;}
    this.camera.lookAt(this.camTarget);this.renderer.render(this.scene,this.camera);
  }
  resetReplay(){this.lastImpact=-1;this.sparks=[];this.trails.forEach(t=>t.history=[]);}
  setQuality(low){this.renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.8));this.renderer.shadowMap.enabled=!low;this.resize();}
}
