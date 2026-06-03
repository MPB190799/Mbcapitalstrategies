#!/usr/bin/env python3
"""
inject_functional_cta.py
Ersetzt statische Newsletter-CTAs (Link-only) in DE-Blog-Seiten
durch funktionale Inline-Subscribe-Formulare mit Cloudflare-Worker-Endpoint.
web-design-agent, 2026-06-02
"""
import os
import re

BLOG_DIR = os.path.dirname(os.path.abspath(__file__)) + "/blog"

# Altes statisches CTA-Muster das ersetzt wird (nur a-href Variante)
OLD_CTA_STATIC = '''  <a href="https://mbcapitalstrategies.com/#newsletter" style="display:inline-block;padding:12px 24px;background:#D4AF37;color:#000;text-decoration:none;border-radius:4px;font-weight:700;font-size:0.9rem;">PDF + Newsletter holen &rarr;</a>
  <p style="color:#6b7a99;font-size:0.72rem;margin:10px 0 0;">Keine Anlageberatung. Abmeldung jederzeit. DSGVO. Double-Opt-In.</p>
</div>'''

# Neues funktionales CTA (Inline-Formular + Fallback-Link)
NEW_CTA_FUNCTIONAL = '''  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;" id="mb-mid-form-SLOT">
    <input type="email" id="mb-mid-email-SLOT" placeholder="deine@email.de" required
      style="padding:11px 14px;border:1px solid #1e1e35;background:#080810;color:#f0f4ff;border-radius:4px;flex:1;min-width:180px;font-size:0.88rem;">
    <button onclick="mbBlogSubscribe('mb-mid-email-SLOT','mb-mid-msg-SLOT')" data-cta="newsletter-de-blog"
      style="padding:11px 22px;background:#D4AF37;color:#000;border:0;border-radius:4px;font-weight:700;cursor:pointer;font-size:0.88rem;white-space:nowrap;">PDF + Newsletter holen</button>
  </div>
  <p id="mb-mid-msg-SLOT" style="color:#6b7a99;font-size:0.75rem;margin:4px 0 0;display:none;"></p>
  <p style="color:#6b7a99;font-size:0.72rem;margin:8px 0 0;">Keine Anlageberatung. Abmeldung jederzeit. DSGVO. Double-Opt-In.</p>
</div>
<script>
(function(){
  if(typeof window.mbBlogSubscribe==="undefined"){
    var EP="https://mb-newsletter-subscribe.mbcapitalstrategies.workers.dev/subscribe";
    window.mbBlogSubscribe=function(eId,mId){
      var el=document.getElementById(eId),msg=document.getElementById(mId);
      var email=el?el.value.trim():"";
      if(!email||!email.includes("@")){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Bitte eine gueltige E-Mail-Adresse eingeben.";}return;}
      if(msg){msg.style.display="block";msg.style.color="#D4AF37";msg.textContent="Wird angemeldet...";}
      fetch(EP,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email})})
      .then(function(r){return r.json();})
      .then(function(d){if(msg){msg.style.display="block";if(d.ok){msg.style.color="#22c55e";msg.textContent=d.msg||"Fast geschafft! Bitte E-Mail bestaetigen.";if(el)el.value="";}else{msg.style.color="#ef4444";msg.textContent=d.msg||"Fehler. Bitte nochmal versuchen.";}}})
      .catch(function(){if(msg){msg.style.display="block";msg.style.color="#ef4444";msg.textContent="Verbindungsfehler. Bitte spaeter nochmal versuchen.";}});
    };
  }
})();
</script>'''

def get_slot_id(filepath):
    """Generate a unique slot ID from filename."""
    base = os.path.basename(filepath).replace(".html", "").replace("-", "")[:12]
    return base

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already has functional subscribe
    if "mbBlogSubscribe" in content or "mbMidSubscribe" in content or "workers.dev" in content:
        return False, "already_has_functional_cta"

    # Skip redirect pages
    if 'meta http-equiv="refresh"' in content:
        return False, "redirect_page"

    # Check if has static CTA to replace
    if OLD_CTA_STATIC not in content:
        return False, "no_static_cta_found"

    slot = get_slot_id(filepath)
    new_cta = NEW_CTA_FUNCTIONAL.replace("SLOT", slot)
    new_content = content.replace(OLD_CTA_STATIC, new_cta, 1)  # replace first occurrence only

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, "upgraded"

def main():
    files = sorted([
        os.path.join(BLOG_DIR, f)
        for f in os.listdir(BLOG_DIR)
        if f.endswith(".html")
    ])

    upgraded = []
    skipped = []
    errors = []

    for fp in files:
        try:
            ok, reason = process_file(fp)
            if ok:
                upgraded.append(os.path.basename(fp))
                print(f"  UPGRADED: {os.path.basename(fp)}")
            else:
                skipped.append((os.path.basename(fp), reason))
        except Exception as e:
            errors.append((os.path.basename(fp), str(e)))
            print(f"  ERROR: {os.path.basename(fp)} — {e}")

    print(f"\nSummary: {len(upgraded)} upgraded, {len(skipped)} skipped, {len(errors)} errors")
    if upgraded:
        print("Upgraded files:")
        for f in upgraded:
            print(f"  - {f}")

if __name__ == "__main__":
    main()
