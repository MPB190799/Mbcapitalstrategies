"""Zieht einen kompakten Premium-Hinweis in die ERGEBNIS-BOX der Rechner-Seiten.

Warum (gemessen 07.08.2026, GSC 10.07.-06.08.):
  Der Rechner-Cluster traegt 1.789 der 3.825 DE-Impressionen (47 %) und 24 der
  66 Klicks (36 %) — er ist der Trafficmotor der Seite. Der Premium-CTA
  (MB-PREMIUM-CTA-V1) sass dort aber bei ~84 % Seitentiefe, hinter rund 20
  SEO-Text-H2s. Die Ergebnis-Box steht bei ~25 %. Ein Rechner-Nutzer tippt seine
  Zahlen ein, liest sein Ergebnis und geht — er scrollt nie 1.000 Zeilen weiter.
  Der Moment der Kaufabsicht ist der Augenblick, in dem die Zahl erscheint.
  Genau dort stand nichts.

Was der Hinweis NICHT behauptet: den Promo-Code INSIDER1. Der ist zwar ein echter
Stripe-Coupon (1 EUR einmalig, 200 Einloesungen), aber zuletzt am 03.06.2026
gegen Stripe verifiziert — ob das Kontingent noch offen ist, ist von hier nicht
messbar. Genannt wird nur, was die Verkaufsseite /newsletter/ selbst traegt:
"ab 5 EUR/Monat" und "30 Tage gratis".

Idempotent: Seiten mit dem Marker werden uebersprungen.
Ausfuehren aus dem Repo-Wurzelverzeichnis der DE-Seite.
"""

from pathlib import Path

MARKER = "<!-- MB-PREMIUM-RESULT-CTA-V1 -->"

# Rechner-Seiten mit einer Ergebnis-Box (id="results"), nach GSC-Impressionen/28d
# Die Rechner benennen ihre Ergebnis-Box unterschiedlich — deshalb je Seite die
# echte ID mitgeben statt "results" zu unterstellen (sonst faellt die Haelfte still raus).
PAGES = {
    "tools/dividendenrechner.html":            "results",     # 766 Imp/28d
    "tools/dividenden-wachstumsrechner.html":  "results",     # 298 Imp
    "tools/yield-on-cost-rechner.html":        "result",      # 181 Imp
    "tools/dividenden-snowball-rechner.html":  "resultArea",  # 106 Imp
    "tools/dividenden-reinvest-rechner.html":  "resultArea",
}

SNIPPET_TMPL = """
""" + MARKER + """
<script>
/* Premium-Hinweis im Moment des Ergebnisses (siehe add_result_cta.py).
   Haengt sich an die Ergebnis-Box statt an calculate() — funktioniert damit
   unabhaengig davon, wie die jeweilige Rechner-Seite ihr Ergebnis rendert. */
(function () {
  var box = document.getElementById("__BOX_ID__");
  if (!box) return;
  var CTA_ID = "mb-premium-result-cta";

  function inject() {
    if (document.getElementById(CTA_ID)) return;      // schon drin -> keine Schleife
    if (!box.textContent.trim()) return;              // noch kein Ergebnis gerechnet
    var d = document.createElement("div");
    d.id = CTA_ID;
    d.style.cssText = "margin-top:14px;padding:14px 16px;border-top:1px solid rgba(212,175,55,0.30);" +
      "background:rgba(212,175,55,0.06);border-radius:0 0 6px 6px;text-align:left;font-family:Outfit,sans-serif;";
    d.innerHTML =
      '<p style="margin:0 0 8px;font-size:0.88rem;color:#cbd5dd;line-height:1.5;">' +
      'Die Zahl steht — die Frage ist, ob die Dividende sie auch trägt. ' +
      'Im <strong style="color:#d4af37;">MB Earnings Insider</strong> prüfe ich jeden Quartalsbericht ' +
      'deiner Sektoren auf Ausschüttungsdeckung, Cashflow und Verschuldung.</p>' +
      '<a href="/newsletter/?utm_source=internal&utm_medium=result-cta&utm_campaign=rechner" ' +
      'style="display:inline-block;padding:9px 18px;background:#d4af37;color:#0f1115;font-weight:700;' +
      'text-decoration:none;border-radius:5px;font-size:0.86rem;letter-spacing:.02em;">' +
      'Ab 5 &euro;/Monat ansehen &mdash; 30 Tage gratis &rarr;</a>';
    box.appendChild(d);
  }

  new MutationObserver(inject).observe(box, { childList: true, subtree: true });
  inject();
})();
</script>
"""


def patch(rel_path: str, box_id: str) -> str:
    p = Path(rel_path)
    if not p.exists():
        return f"SKIP (nicht gefunden): {rel_path}"
    text = p.read_text(encoding="utf-8")
    if MARKER in text:
        return f"SKIP (schon drin): {rel_path}"
    if f'id="{box_id}"' not in text:
        return f"SKIP (Ergebnis-Box '{box_id}' nicht gefunden): {rel_path}"
    if "</body>" not in text:
        return f"SKIP (kein </body>-Anker): {rel_path}"
    snippet = SNIPPET_TMPL.replace("__BOX_ID__", box_id)
    p.write_text(text.replace("</body>", snippet + "\n</body>", 1), encoding="utf-8")
    return f"PATCHED: {rel_path}  (Box #{box_id})"


if __name__ == "__main__":
    for rel, box_id in PAGES.items():
        print(patch(rel, box_id))
