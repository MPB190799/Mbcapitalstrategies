(function(){
  var bar = document.getElementById('mb-sticky-cta');

  function mbStickySetBodyPad(){
    if(!bar || bar.style.display === 'none') {
      document.body.style.paddingBottom = '';
    } else {
      document.body.style.paddingBottom = bar.offsetHeight + 'px';
    }
  }

  window.mbStickyDismiss = function(){
    bar.style.display = 'none';
    localStorage.setItem('mbctadismissed','1');
    document.body.style.paddingBottom = '';
    // let cookie banner drop back to bottom:0 if still visible
    var cb = document.getElementById('cookie-banner');
    if(cb) cb.style.bottom = '0';
  };

  if(localStorage.getItem("mbctadismissed")){
    bar.style.display = 'none';
  } else {
    // Show only after user scrolls 400px — prevents CLS on load and stacking with cookie modal
    var shown = false;
    function mbStickyShow(){
      if(shown) return;
      // CRO-Fix 2026-07-03 web-design-agent: waehrend die Sale-Top-Bar aktiv ist, NICHT
      // zusaetzlich die Bottom-Sticky-Bar zeigen -- sonst Gold-Bar-Sandwich (oben+unten),
      // frisst auf Mobile zu viel Viewport und reizueberflutet (Marco-Regel: dezent, nie
      // aufdringlich). Newsletter-CTA ist bereits above-the-fold im Hero praesent.
      var saleBar = document.querySelector('.ip-sale');
      if(saleBar && saleBar.style.display !== 'none' && saleBar.offsetHeight > 0) return;
      shown = true;
      bar.style.display = 'block';
      mbStickySetBodyPad();
      var cb = document.getElementById('cookie-banner');
      if(cb) cb.style.bottom = bar.offsetHeight + 'px';
    }
    window.addEventListener('scroll', function(){
      if(window.scrollY > 400) mbStickyShow();
    }, {passive:true});
    window.addEventListener('resize', mbStickySetBodyPad);
  }

  var ENDPOINT="https://mb-newsletter-subscribe.mbcapitalstrategies.workers.dev/subscribe";
  window.mbStickySubscribe=function(){
    var el=document.getElementById("mb-sticky-email"),msg=document.getElementById("mb-sticky-msg");
    var email=el?el.value.trim():"";
    if(!email||!email.includes("@")){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Bitte gueltige E-Mail eingeben.";}return;}
    if(msg){msg.style.display="block";msg.style.color="#D4AF37";msg.textContent="Anmeldung...";}
    if(typeof gtag==="function"){gtag("event","newsletter_cta_click",{event_category:"engagement",event_label:"sticky-de"});}
    fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email})})
    .then(function(r){return r.json();})
    .then(function(d){if(msg){msg.style.display="block";if(d.ok){msg.style.color="#22c55e";msg.textContent=d.msg||"Fast geschafft! Bitte E-Mail bestaetigen.";if(el)el.value="";if(typeof gtag==="function"){gtag("event","newsletter_signup",{event_category:"engagement",event_label:"sticky-de",method:"double-opt-in"});}}else{msg.style.color="#ef4444";msg.textContent=d.msg||"Fehler. Nochmal versuchen.";}}}
    ).catch(function(){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Verbindungsfehler. Spaeter nochmal versuchen.";}});
  };
})();
