const c=window.LETTER;
document.querySelector('#dedication').textContent='for my love. with all my heart.';

const letterArticle=document.querySelector('article');
document.querySelector('#left').remove();document.querySelector('#right').remove();document.querySelector('#paragraphs').remove();
c.paragraphs.forEach((t,i)=>{const p=document.createElement('p');p.className='letter-paragraph';t.split(/(exquisite|my future rn)/g).forEach(part=>{if(part==='exquisite'||part==='my future rn'){const strong=document.createElement('strong');strong.textContent=part;p.append(strong)}else p.append(document.createTextNode(part))});p.style.setProperty('--row',i+2);p.style.setProperty('--mobile-row',i*2+2);letterArticle.append(p)});
const signature=document.querySelector('#signature');
const signoff=document.createElement('span');signoff.textContent=c.signature;
const signatureImage=document.createElement('img');signatureImage.src='assets/shan-signature.png';signatureImage.alt='shan’s handwritten signature';signatureImage.className='handwritten-signature';const signatureInk=document.createElement('span');signatureInk.className='signature-ink';signatureInk.setAttribute('role','img');signatureInk.setAttribute('aria-label','shan’s handwritten signature');signature.append(signoff,signatureInk);
letterArticle.style.setProperty('--signature-row',c.paragraphs.length+2);
letterArticle.style.setProperty('--end-row',c.paragraphs.length+3);
letterArticle.style.setProperty('--panel-end',c.paragraphs.length+4);
letterArticle.style.setProperty('--mobile-signature-row',c.paragraphs.length*2+2);
letterArticle.style.setProperty('--mobile-end-row',c.paragraphs.length*2+3);
letterArticle.style.setProperty('--mobile-panel-end',c.paragraphs.length*2+4);
c.photos.forEach((p,i)=>{const f=document.createElement('figure');f.className='memory-photo '+(i%2?'right-photo':'left-photo');const paragraphIndex=p.paragraphIndex??Math.round(i*(c.paragraphs.length-2)/(c.photos.length-1));f.style.setProperty('--row',paragraphIndex+2);f.style.setProperty('--mobile-row',paragraphIndex*2+3);const img=document.createElement('img');img.src=p.src;img.alt=p.caption;img.loading='lazy';if(p.rotate){f.classList.add('rotated-photo');const wrap=document.createElement('div');wrap.className='rotation-wrap';wrap.append(img);f.append(wrap)}else f.append(img);letterArticle.append(f)});
const audio=document.querySelector('#audio'),sound=document.querySelector('#sound');let ctx,gain,playing=false;
if(c.music){audio.src=c.music;audio.volume=0.65;}
function ambient(){ctx=new(window.AudioContext||window.webkitAudioContext)();gain=ctx.createGain();gain.gain.value=.045;gain.connect(ctx.destination);[130.81,164.81,196,261.63].forEach((f,i)=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;o.detune.value=i*2;const g=ctx.createGain();g.gain.value=.22;o.connect(g);g.connect(gain);o.start()});return ctx.resume()}
function label(){sound.textContent=playing?'♫ Music on':'♫ Music off';sound.setAttribute('aria-label',playing?'Pause background music':'Play background music')}
let opening=false;
const introLines=[
 'before anything',
 'take a deep breath',
 'and know that this little corner of the world',
 'was made for you.',
 'there are so many things i want to say,',
 'and today feels like the right moment',
 'slow down your caffeinated brain',
 'and listen',
 "as long as you're with me",
 "you'll be just fine"
];
document.querySelector('#yes').onclick=async()=>{
 if(opening)return;opening=true;
 const gate=document.querySelector('#gate');confirmation.hidden=true;gate.classList.add('suspense','story-intro');
 const stage=document.createElement('div');stage.className='intro-stage';stage.setAttribute('aria-live','polite');stage.setAttribute('aria-atomic','true');gate.append(stage);
 const mute=document.createElement('button');mute.className='intro-mute';mute.textContent='sound on';mute.setAttribute('aria-label','Mute introduction sound');gate.append(mute);
 let drone=null,revealGain=null,started=Promise.resolve(),muted=false;const oscillators=[];
 try{
  ctx=new(window.AudioContext||window.webkitAudioContext)();ctx.resume();
  drone=ctx.createGain();drone.gain.setValueAtTime(0,ctx.currentTime);drone.gain.linearRampToValueAtTime(.35,ctx.currentTime+2);drone.connect(ctx.destination);
  const introTrack=new Audio('assets/intro-theme.m4a');introTrack.loop=false;introTrack.preload='auto';
  ctx.createMediaElementSource(introTrack).connect(drone);introTrack.play().catch(()=>{mute.textContent='sound off'});
  oscillators.push({stop:()=>introTrack.pause()});
  if(c.music){revealGain=ctx.createGain();revealGain.gain.value=0;ctx.createMediaElementSource(audio).connect(revealGain);revealGain.connect(ctx.destination);started=audio.play().catch(()=>{});}
 }catch{mute.hidden=true}
 mute.onclick=()=>{muted=!muted;if(drone){drone.gain.cancelScheduledValues(ctx.currentTime);drone.gain.setTargetAtTime(muted?0:.35,ctx.currentTime,.15)}mute.textContent=muted?'sound off':'sound on';mute.setAttribute('aria-label',muted?'Unmute introduction sound':'Mute introduction sound');};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 await wait(900);
 for(let i=0;i<introLines.length;i++){
  stage.classList.remove('line-visible');await wait(450);stage.textContent=introLines[i];
  stage.classList.toggle('last-intro-line',i===introLines.length-1);
  stage.classList.add('line-visible');await wait(i===introLines.length-1?6000:5400);
 }
 if(drone){drone.gain.cancelScheduledValues(ctx.currentTime);drone.gain.setTargetAtTime(0,ctx.currentTime,.35);setTimeout(()=>oscillators.forEach(o=>o.stop()),1500);}
 document.querySelector('#experience').hidden=false;gate.style.opacity=0;gate.style.pointerEvents='none';setTimeout(()=>gate.remove(),1500);
 try{await started;if(c.music){audio.currentTime=0;if(revealGain)revealGain.gain.setTargetAtTime(muted?0:1,ctx.currentTime,.5);if(muted){audio.pause();playing=false;revealGain.gain.setValueAtTime(1,ctx.currentTime+1)}else{await audio.play();playing=true}}else{await ambient();playing=true}}catch{playing=false}
 label();sound.focus({preventScroll:true});
};

sound.onclick=async()=>{try{if(playing){if(c.music)audio.pause();else await ctx.suspend();playing=false}else{if(c.music)await audio.play();else if(ctx)await ctx.resume();else await ambient();playing=true}}catch{playing=false}label()};
window.addEventListener('scroll',()=>{const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.width=(total>0?scrollY/total*100:0)+'%'},{passive:true});

const openButton=document.querySelector('#open'), confirmation=document.querySelector('#confirmation');
openButton.onclick=()=>{openButton.hidden=true;confirmation.hidden=false;document.querySelector('#yes').focus()};
document.querySelector('#back').onclick=()=>{
 confirmation.hidden=true;openButton.hidden=true;
 const gate=document.querySelector('#gate');gate.classList.add('goodbye');
 const message=document.createElement('p');message.className='goodbye-message';message.textContent='your lost';message.setAttribute('role','status');gate.append(message);
 setTimeout(()=>{window.close();document.body.classList.add('closed');gate.replaceChildren();document.title='';},2000);
};

const pixelBackground=document.querySelector('#pixel-background');
for(let i=0;i<48;i++){
 const heart=document.createElement('span');heart.className='pixel-heart';
 heart.innerHTML='<svg viewBox="0 0 9 8" fill="currentColor" shape-rendering="crispEdges"><path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1Z"/></svg>';
 heart.style.left=((i*47)%100)+'%';heart.style.top=((i*31)%100)+'%';
 heart.style.setProperty('--duration',(13+i%8*2)+'s');heart.style.setProperty('--delay',(-i*3)+'s');
 heart.style.setProperty('--size',(16+i%4*7)+'px');heart.style.color=['#ed4998','#9862dc','#ef9760','#47bdb4'][i%4];pixelBackground.append(heart);
}

const finalFrame=document.querySelector('#final-photo');
if(c.finalPhoto?.src){const img=document.createElement('img');img.src=c.finalPhoto.src;img.alt=c.finalPhoto.alt;img.loading='lazy';finalFrame.append(img)}
else{const placeholder=document.createElement('div');placeholder.className='photo-empty';const label=document.createElement('span');label.textContent='YOUR MOST SPECIAL PHOTO';placeholder.append(label);finalFrame.append(placeholder)}

// Reveal each photograph once as it enters the viewport.
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const photoObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('photo-visible');photoObserver.unobserve(entry.target)}})},{threshold:.12});
 document.querySelectorAll('.memory-photo,#final-photo').forEach(frame=>{frame.classList.add('photo-reveal');photoObserver.observe(frame)});
}
