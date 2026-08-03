(function(){
  window.mbHeroSubscribeDe=function(){
    var el=document.getElementById("hero-email-de"),msg=document.getElementById("hero-msg-de");
    var email=el?el.value.trim():"";
    if(!email||!email.includes("@")){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Bitte gueltige E-Mail eingeben.";}return;}
    if(msg){msg.style.display="block";msg.style.color="#D4AF37";msg.textContent="Anmeldung...";}
    if(typeof gtag==="function"){gtag("event","newsletter_cta_click",{event_category:"engagement",event_label:"hero-de"});}
    fetch("https://mb-newsletter-subscribe.mbcapitalstrategies.workers.dev/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email})})
    .then(function(r){return r.json();})
    .then(function(d){if(msg){msg.style.display="block";if(d.ok){msg.style.color="#22c55e";msg.textContent="Fast geschafft! Dein PDF liegt unten bereit ↓ — bitte bestaetige noch deine E-Mail (Double-Opt-In).";if(el)el.value="";var dl=document.getElementById("hero-yoc-dl");if(dl){dl.style.display="inline-flex";try{dl.click();}catch(e){}}if(typeof gtag==="function"){gtag("event","newsletter_signup",{event_category:"engagement",event_label:"hero-de",method:"double-opt-in"});gtag("event","lead_magnet_download",{event_category:"engagement",event_label:"top-10-yoc-pdf"});}}else{msg.style.color="#ef4444";msg.textContent=d.msg||"Fehler. Nochmal versuchen.";}}}
    ).catch(function(){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Verbindungsfehler.";}});
  };
})();
