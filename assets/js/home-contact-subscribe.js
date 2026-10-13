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
    // Worker entfernt 2026-10-04 — Brevo Form auf /insider/
    if(msg){msg.style.display="block";msg.style.color="#D4AF37";msg.textContent="Wechsel zum Anmeldeformular...";}
    window.location.href = '/insider/?ref=homepage-contact&email=' + encodeURIComponent(email);
  };
})();
