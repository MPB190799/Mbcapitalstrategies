"""fix_ascii_umlaute — ersetzt ASCII-Umschrift durch echte Umlaute, aber NUR im
sichtbaren Text und in JSON-LD-Werten.

ANLASS (07.08.2026): 22 Seiten trugen "schuettet", "betraegt", "Fuer", "waehrend"
mitten im Fliesstext — u. a. im Dividendenrechner, der staerksten Seite der Domain
(766 GSC-Impressionen/28d). Das liest sich wie ein kaputter Zeichensatz und kostet
Vertrauen genau dort, wo der Newsletter-CTA sitzt.

WAS BEWUSST NICHT ANGEFASST WIRD — sonst zerlegt der Fix die Seite:
  * Alles INNERHALB von HTML-Tags (Attribute). Gefunden: id="fuer-wen" — ein Anker.
    Ersetzt man den, bricht jedes href="#fuer-wen".
  * <script> (ausser JSON-LD) und <style> — Bezeichner und CSS-Kommentare.
  * Zeichenketten, die mit http beginnen (URLs/Slugs).

JSON-LD WIRD mitgenommen: das sind FAQ-/Article-Texte, die Google direkt ausliest
und in Rich Results anzeigt — dort ist die Umschrift genauso sichtbar wie im Body.

Default = DRY-RUN. Erst mit --apply wird geschrieben.
"""

import re
import sys
from pathlib import Path

# Nur eindeutige Faelle. Bewusst KEIN generisches ae/oe/ue -> Umlaut:
# das zerstoert echte Woerter (Aeon, Koeffizient, Duett, Statue, aktuell).
MAP = {
    "schuettet": "schüttet", "Schuettet": "Schüttet",
    "betraegt": "beträgt", "Betraegt": "Beträgt",
    "fuer": "für", "Fuer": "Für",
    "waehrend": "während", "Waehrend": "Während",
    "hoehere": "höhere", "Hoehere": "Höhere", "hoeher": "höher", "Hoeher": "Höher",
    "pruefe": "prüfe", "pruefen": "prüfen", "Pruefen": "Prüfen",
    "traegt": "trägt", "Traegt": "Trägt",
    "Ausschuettung": "Ausschüttung", "Ausschuettungen": "Ausschüttungen",
    "ausschuettung": "ausschüttung", "ausschuettungen": "ausschüttungen",
    "erhoeht": "erhöht", "Erhoeht": "Erhöht",
    "Erhoehung": "Erhöhung", "erhoehung": "erhöhung",
    "zurueck": "zurück", "Zurueck": "Zurück",
    "natuerlich": "natürlich", "Natuerlich": "Natürlich",
    "koennen": "können", "Koennen": "Können",
    "koennte": "könnte", "Koennte": "Könnte",
    "muessen": "müssen", "Muessen": "Müssen",
    "haelt": "hält", "Haelt": "Hält",
    "Verhaeltnis": "Verhältnis", "verhaeltnis": "verhältnis",
    "ungefaehr": "ungefähr", "Ungefaehr": "Ungefähr",
    "zusaetzlich": "zusätzlich", "Zusaetzlich": "Zusätzlich",
    "zusaetzlicher": "zusätzlicher", "Zusaetzlicher": "Zusätzlicher",
    "Qualitaet": "Qualität", "qualitaet": "qualität",
    "Realitaet": "Realität", "realitaet": "realität",
    "Moeglichkeit": "Möglichkeit", "moeglichkeit": "möglichkeit",
    "laengere": "längere", "Laengere": "Längere",
    "aendert": "ändert", "Aendert": "Ändert",
    "Schluesselrohstoff": "Schlüsselrohstoff",
    "grosse": "große", "Grosse": "Große",
    # Nachtrag nach dem ersten Trockenlauf — 2. Messrunde im sichtbaren Text.
    # "ueber" ist sicher: der Slug /ueber-marco-bozem/ steht in href-Attributen,
    # und Attribute liegen innerhalb von Tags, die process() nie anfasst.
    "erklaert": "erklärt", "Erklaert": "Erklärt",
    "ueber": "über", "Ueber": "Über",
    "Ueberblick": "Überblick", "ueberblick": "überblick",
    "Portfolioueberblick": "Portfolioüberblick",
    "uebernommen": "übernommen", "Uebernommen": "Übernommen",
    "ausschliesslich": "ausschließlich", "Ausschliesslich": "Ausschließlich",
    "schliesst": "schließt", "Schliesst": "Schließt",
    "moeglich": "möglich", "Moeglich": "Möglich",
    "taeglich": "täglich", "Taeglich": "Täglich",
    "groesste": "größte", "Groesste": "Größte",
    "groesster": "größter", "Groesster": "Größter",
    "groesstes": "größtes", "Groesstes": "Größtes",
    "Groessenvorteile": "Größenvorteile",
    "Beruecksichtigung": "Berücksichtigung",
    "Ruecknahme": "Rücknahme", "Rueckblick": "Rückblick",
    "erhoehte": "erhöhte", "Erhoehte": "Erhöhte",
    "hoeherer": "höherer", "Hoeherer": "Höherer",
    "Datenschutzerklaerung": "Datenschutzerklärung",
    "Ertraege": "Erträge", "ertraege": "erträge",
    "heisser": "heißer", "Heisser": "Heißer",
    "weisst": "weißt",
    "Nachfragebloecke": "Nachfrageblöcke",
    "Elektromobilitae": "Elektromobilitä",  # Torso im Fliesstext, s. shipping/rohstoffe
}
WORD_RE = re.compile(r"\b(" + "|".join(sorted(MAP, key=len, reverse=True)) + r")\b")

# Segmentiert in Tags / script / style / Text
SEGMENT_RE = re.compile(
    r"(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<!--.*?-->|<[^>]+>)",
    re.DOTALL | re.IGNORECASE,
)
JSONLD_RE = re.compile(r'^<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>', re.IGNORECASE)


def sub_text(s: str) -> str:
    return WORD_RE.sub(lambda m: MAP[m.group(1)], s)


def sub_jsonld(block: str) -> str:
    """Nur in doppelt gequoteten Werten ersetzen, und nie in URLs."""
    def repl(m):
        val = m.group(1)
        if val.startswith("http") or val.startswith("/") or val.startswith("@"):
            return m.group(0)
        return '"' + sub_text(val) + '"'
    return re.sub(r'"([^"\\]*(?:\\.[^"\\]*)*)"', repl, block)


def process(text: str):
    out, changed = [], 0
    for seg in SEGMENT_RE.split(text):
        if not seg:
            continue
        if seg.startswith("<"):
            if JSONLD_RE.match(seg):          # JSON-LD: Werte ja, Keys/URLs nein
                new = sub_jsonld(seg)
            else:                              # Tags, script, style, Kommentare: unberuehrt
                new = seg
        else:                                  # echter sichtbarer Text
            new = sub_text(seg)
        if new != seg:
            changed += len(WORD_RE.findall(seg))
        out.append(new)
    return "".join(out), changed


def main():
    apply = "--apply" in sys.argv
    total_files = total_hits = 0
    for p in sorted(Path(".").rglob("*.html")):
        if "node_modules" in str(p):
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except Exception:  # noqa
            continue
        new, n = process(text)
        if n == 0 or new == text:
            continue
        total_files += 1
        total_hits += n
        print(f"  {'FIX ' if apply else 'wuerde'} {n:3d}x  {p}")
        if apply:
            p.write_text(new, encoding="utf-8")
    print(f"\n{total_files} Dateien, {total_hits} Ersetzungen"
          + ("" if apply else "  — DRY-RUN, nichts geschrieben. Mit --apply ausfuehren."))


if __name__ == "__main__":
    main()
