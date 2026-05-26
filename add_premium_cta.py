"""Inject sector-contextual Premium-Newsletter-CTA before the existing free-newsletter
section on top-traffic pages. Idempotent: skips files that already have the marker.
Run from C:/Users/marco/mb_sites/Mbcapitalstrategies/.
"""

from pathlib import Path

MARKER = "<!-- MB-PREMIUM-CTA-V1 -->"

PAGES = {
    "tools/dividendenrechner.html":            ("alle", "Dividenden-Aktien"),
    "tools/yield-on-cost-rechner.html":        ("alle", "Dividenden-Aktien"),
    "tools/dividenden-snowball-rechner.html":  ("alle", "Dividenden-Aktien"),
    "tools/dividenden-reinvest-rechner.html":  ("alle", "Dividenden-Aktien"),
    "bestenlisten/beste-tanker-aktien-2026.html": ("shipping", "Tanker-Aktien"),
    "bestenlisten/beste-tanker-aktien-2025.html": ("shipping", "Tanker-Aktien"),
    "blog/petrobras-analyse-2026.html":        ("oelgas", "Petrobras &amp; Öl &amp; Gas-Aktien"),
    "upstream-aktien/index.html":              ("oelgas", "Upstream-Aktien"),
    "blog/tanker-charterraten-sanktionen-2026.html": ("shipping", "Tanker-Aktien"),
    "blog/quellensteuer-kanada-australien.html": ("alle", "internationalen Dividenden-Aktien"),
    "mining-aktien/index.html":                ("mining", "Mining-Aktien"),
    "rohstoff-superzyklus-master.html":        ("alle", "Rohstoff-Aktien"),
}

CONTEXTS = {
    "shipping": {
        "headline": "Jeden Tanker-Quartalsbericht direkt im Postfach.",
        "subline": "Frontline, Star Bulk, Maersk, DHT & 46 weitere Shipping-Aktien — pro Earnings-Release eine ausführliche deutsche Analyse mit Charterraten, TCE, Fleet-Updates.",
        "sektor_preselect": "shipping",
    },
    "mining": {
        "headline": "Jeden Mining-Quartalsbericht direkt im Postfach.",
        "subline": "Newmont, Barrick, BHP, Vale & 76 weitere Mining-Aktien — pro Earnings-Release eine deutsche Tiefenanalyse mit AISC, Reserven, Capex-Disziplin.",
        "sektor_preselect": "mining",
    },
    "oelgas": {
        "headline": "Jeden Öl-&amp;-Gas-Quartalsbericht direkt im Postfach.",
        "subline": "ExxonMobil, Shell, Petrobras, ConocoPhillips & 96 weitere — pro Earnings-Release deutsche Tiefenanalyse mit Cashflow, Buybacks, Reserve-Replacement.",
        "sektor_preselect": "oelgas",
    },
    "alle": {
        "headline": "Jeden Quartalsbericht deiner Aktien direkt im Postfach.",
        "subline": "9 Sektoren · 30–100 Aktien pro Sektor · pro Earnings-Release eine deutsche Tiefenanalyse mit Charts, KPIs, CEO-Quotes &amp; Sektor-Peer-Vergleich.",
        "sektor_preselect": "",
    },
}


def build_cta(ctx_key: str, page_topic: str) -> str:
    ctx = CONTEXTS[ctx_key]
    return f"""
{MARKER}
<!-- Premium Newsletter CTA (sector-contextual) -->
<div style="background:linear-gradient(135deg,rgba(212,175,55,0.10) 0%,rgba(212,175,55,0.04) 100%);border-top:1px solid rgba(212,175,55,0.35);border-bottom:1px solid rgba(212,175,55,0.35);padding:36px 20px;text-align:center;margin:0;">
  <div style="max-width:680px;margin:0 auto;">
    <p style="color:#d4af37;font-size:0.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px;font-family:Montserrat,sans-serif;">Premium · MB Earnings Insider</p>
    <h3 style="color:#f5f6fa;font-size:1.4rem;font-weight:700;margin:0 0 10px;font-family:Montserrat,sans-serif;line-height:1.3;">📊 {ctx["headline"]}</h3>
    <p style="color:#cbd5dd;font-size:0.92rem;margin:0 0 16px;font-family:Montserrat,sans-serif;line-height:1.5;">{ctx["subline"]}</p>
    <p style="color:#9aa6c0;font-size:0.82rem;margin:0 0 18px;font-family:Montserrat,sans-serif;">
      <strong style="color:#d4af37;">ab 5 €/Monat</strong> · 30 Tage gratis testen · 1-Klick-Cancel · <strong style="color:#d4af37;">Promo INSIDER1</strong> spart 1 €
    </p>
    <a href="/newsletter/?utm_source=internal&amp;utm_medium=cta&amp;utm_campaign={page_topic}" style="display:inline-block;padding:13px 28px;background:#d4af37;color:#0f1115;font-weight:700;text-decoration:none;border-radius:6px;font-size:0.95rem;font-family:Montserrat,sans-serif;letter-spacing:.02em;">
      Premium-Newsletter ansehen →
    </a>
  </div>
</div>
<!-- /Premium Newsletter CTA -->
"""


def patch_file(rel_path: str, ctx_key: str, page_topic: str) -> str:
    p = Path(rel_path)
    if not p.exists():
        return f"SKIP (not found): {rel_path}"
    text = p.read_text(encoding="utf-8")
    if MARKER in text:
        return f"SKIP (already injected): {rel_path}"

    cta = build_cta(ctx_key, page_topic.replace(" ", "_").replace("&", "and").lower())

    # Try to inject BEFORE the existing free-newsletter section (the MB Capital Insider)
    free_nl_anchor = "<!-- ======================== MB CAPITAL INSIDER NEWSLETTER ========================"
    if free_nl_anchor in text:
        text2 = text.replace(free_nl_anchor, cta + "\n" + free_nl_anchor, 1)
    else:
        # Fall back: inject before </main> if present, else before footer
        if "</main>" in text:
            text2 = text.replace("</main>", cta + "\n</main>", 1)
        elif '<footer class="site-footer"' in text:
            text2 = text.replace('<footer class="site-footer"', cta + '\n<footer class="site-footer"', 1)
        else:
            return f"SKIP (no anchor found): {rel_path}"

    p.write_text(text2, encoding="utf-8")
    return f"PATCHED: {rel_path}  ({ctx_key})"


if __name__ == "__main__":
    import sys
    for rel, (ctx, topic) in PAGES.items():
        result = patch_file(rel, ctx, topic)
        print(result)
