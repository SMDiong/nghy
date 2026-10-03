(()=>{
 const $=id=>document.getElementById(id);
 const entry=$('entry'),choices=$('record-choices'),open=$('choose-record'),skip=$('without-recording'),error=$('record-error');
 $('open').onclick=()=>{entry.hidden=true;choices.hidden=false;open.focus();};
 const status=$('record-status'),section=$('reaction'),video=$('reaction-video'),save=$('save-reaction'),del=$('delete-reaction'),end=$('end-recording');
 let recorder,stream,chunks=[],url,request=0;
 const release=()=>{if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;};
 function stop(){if(recorder?.state==='recording'){recorder.stop();status.hidden=true;end.disabled=true;$('reaction-note').textContent='preparing your recording…';}else release();}
 function proceed(){entry.hidden=true;choices.hidden=true;confirmation.hidden=false;$('yes').focus();}
 skip.onclick=()=>{request++;open.disabled=false;proceed();};
 open.onclick=async()=>{
  if(open.disabled)return;
  open.disabled=true;const token=++request;error.textContent='';
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){error.textContent='recording is unavailable in this browser. you can continue without recording.';open.disabled=false;return;}
  try{
   const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:true});
   if(token!==request){media.getTracks().forEach(t=>t.stop());return;}
   stream=media;
   const mime=['video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
   recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];
   recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   recorder.onstop=()=>{
    release();status.hidden=true;end.hidden=true;
    const type=recorder.mimeType||mime||'video/webm',blob=new Blob(chunks,{type});chunks=[];
    if(!blob.size){$('reaction-note').textContent='no recording was captured.';return;}
    url=URL.createObjectURL(blob);video.src=url;video.hidden=false;save.href=url;save.download='my-reaction.'+(type.includes('mp4')?'mp4':'webm');save.hidden=false;del.hidden=false;
    $('reaction-note').textContent='your recording stays on this device. save it before closing this page, then share it if you want.';
   };
   recorder.onerror=()=>{stop();error.textContent='recording stopped because of a camera error.';};
   recorder.start(1000);status.hidden=false;section.hidden=false;proceed();
  }catch{release();error.textContent='camera or microphone access was unavailable. you can try again or continue without recording.';open.disabled=false;}
 };
 $('stop-recording').onclick=stop;end.onclick=stop;
 del.onclick=()=>{video.pause();video.removeAttribute('src');video.load();if(url)URL.revokeObjectURL(url);url=null;video.hidden=true;save.hidden=true;save.removeAttribute('href');del.hidden=true;$('reaction-note').textContent='recording deleted.';};
 const back=$('back').onclick;$('back').onclick=()=>{request++;stop();back();};
 window.addEventListener('pagehide',()=>{request++;stop();release();if(url)URL.revokeObjectURL(url);});
})();
