(function(){
  window.mbContactSubscribeDe=function(){
    var el=document.getElementById("mb-contact-email-de"),
        cb=document.getElementById("mb-contact-optin-de"),
        msg=document.getElementById("mb-contact-msg-de");
    var email=el?el.value.trim():"";
    if(!email||!email.includes("@")){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Bitte gueltige E-Mail eingeben.";}return;}
    if(!cb||!cb.checked){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Bitte Datenschutz akzeptieren.";}return;}
    if(msg){msg.style.display="block";msg.style.color="#D4AF37";msg.textContent="Anmeldung...";}
    if(typeof gtag==="function"){gtag("event","newsletter_cta_click",{event_category:"engagement",event_label:"contact-de"});}
    fetch("https://mb-newsletter-subscribe.mbcapitalstrategies.workers.dev/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email})})
    .then(function(r){return r.json();})
    .then(function(d){if(msg){msg.style.display="block";if(d.ok){msg.style.color="#22c55e";msg.textContent=d.msg||"Fast geschafft! Bitte E-Mail bestaetigen (Double-Opt-In).";if(el)el.value="";if(cb)cb.checked=false;if(typeof gtag==="function"){gtag("event","newsletter_signup",{event_category:"engagement",event_label:"contact-de",method:"double-opt-in"});}}else{msg.style.color="#ef4444";msg.textContent=d.msg||"Fehler. Bitte nochmal versuchen.";}}}
    ).catch(function(){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Verbindungsfehler. Spaeter nochmal versuchen.";}});
  };
})();
