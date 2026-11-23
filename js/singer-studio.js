"use strict";
(() => {
 const $ = id => document.getElementById(id);
 let recorder=null, chunks=[], blob=null, stream=null, started=0, tick=null;
 const status = msg => $("status").textContent=msg;
 const fmt = ms => {const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
 $("record").addEventListener("click",async()=>{
  try{
   if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error("इस ब्राउज़र में ऑडियो रिकॉर्डिंग उपलब्ध नहीं है।");
   stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
   chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
   recorder.onstop=()=>{
    blob=new Blob(chunks,{type:recorder.mimeType||"audio/webm"});const url=URL.createObjectURL(blob);
    $("preview").src=url;$("preview").hidden=false;$("download").disabled=false;$("clear").disabled=false;$("generate").disabled=false;
    stream?.getTracks().forEach(t=>t.stop());stream=null;status("रिकॉर्डिंग तैयार है। सुनकर जाँचें; फिर AI अनुरोध तैयार कर सकते हैं।");
   };
   recorder.start();started=Date.now();$("record").disabled=true;$("stop").disabled=false;status("रिकॉर्डिंग चालू है… अब अपनी आवाज़ में गीत की पंक्तियाँ गाएँ।");
   tick=setInterval(()=>$("timer").textContent=fmt(Date.now()-started),250);
  }catch(e){status(e.message||"माइक्रोफोन शुरू नहीं हो सका। ब्राउज़र अनुमति जाँचें।")}
 });
 $("stop").addEventListener("click",()=>{if(recorder?.state==="recording"){recorder.stop();clearInterval(tick);$("record").disabled=false;$("stop").disabled=true}});
 $("download").addEventListener("click",()=>{if(!blob)return;const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="meri-aawaz-sample.webm";a.click();URL.revokeObjectURL(a.href)});
 $("clear").addEventListener("click",()=>{blob=null;$("preview").removeAttribute("src");$("preview").hidden=true;$("download").disabled=true;$("clear").disabled=true;$("generate").disabled=true;$("timer").textContent="00:00";status("नई रिकॉर्डिंग के लिए तैयार।")});
 $("consent").addEventListener("change",e=>{$("generate").disabled=!blob||!e.target.checked});
 $("generate").addEventListener("click",()=>{
  if(!blob||!$("consent").checked)return;
  const request={song:$("song").value.trim(),language:$("language").value,rights:$("rights").value,voice_sample_file:"meri-aawaz-sample.webm",consent:true,workflow:"voice-enrollment -> singing-voice-synthesis -> licensed-accompaniment -> mix-master"};
  status("AI backend अभी कॉन्फ़िगर नहीं है। अनुरोध विवरण तैयार हुआ है; वास्तविक पूरा गीत बनाने के लिए backend/API integration आवश्यक है।");
  const text=JSON.stringify(request,null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download="meri-aawaz-ai-request.json";a.click();URL.revokeObjectURL(a.href);
 });
 window.addEventListener("beforeunload",()=>{stream?.getTracks().forEach(t=>t.stop());clearInterval(tick)});
})();