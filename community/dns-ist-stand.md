# DNS-Sicherung mbcapitalstrategies.com

Aufgenommen am 01.09.2026, **vor** dem Umzug zu Cloudflare.
Diese Liste ist die Referenz: Nach dem Umzug muss jede Zeile in Cloudflare wieder stehen.
Fehlt eine, merkst du es je nach Zeile sofort (Website) oder erst in Wochen (E-Mail-Zustellung).

Aktuelle Nameserver: `dns1.registrar-servers.com`, `dns2.registrar-servers.com` (Namecheap)

---

## Website — GitHub Pages

| Typ | Name | Wert | In Cloudflare |
|---|---|---|---|
| A | @ | 185.199.108.153 | **Proxied** (orange) |
| A | @ | 185.199.109.153 | **Proxied** |
| A | @ | 185.199.110.153 | **Proxied** |
| A | @ | 185.199.111.153 | **Proxied** |
| CNAME | www | mbp190799.github.io | **Proxied** |

Keine AAAA-, keine CAA-Records vorhanden.

## E-Mail-Weiterleitung — Namecheap

| Typ | Name | Priorität | Wert | In Cloudflare |
|---|---|---|---|---|
| MX | @ | 10 | eforward1.registrar-servers.com | **DNS only** (grau) |
| MX | @ | 10 | eforward2.registrar-servers.com | **DNS only** |
| MX | @ | 10 | eforward3.registrar-servers.com | **DNS only** |
| MX | @ | 15 | eforward4.registrar-servers.com | **DNS only** |
| MX | @ | 20 | eforward5.registrar-servers.com | **DNS only** |

> MX-Einträge dürfen **niemals** proxied sein. Cloudflare lässt das zwar zu, aber die
> Zustellung bricht. Das ist der wahrscheinlichste Fehler beim Umzug.

## E-Mail-Authentifizierung — Brevo (kritisch, wird gern übersehen)

| Typ | Name | Wert |
|---|---|---|
| TXT | @ | `v=spf1 include:spf.efwd.registrar-servers.com ~all` |
| CNAME | brevo1._domainkey | b1.mbcapitalstrategies-com.dkim.brevo.com |
| CNAME | brevo2._domainkey | b2.mbcapitalstrategies-com.dkim.brevo.com |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

Die beiden DKIM-CNAMEs sind der Grund, warum Brevo die Domain als „authenticated"
führt (per DNS bestätigt am 04.03.2026). Gehen sie verloren, signiert Brevo weiter,
aber die Signatur passt nicht mehr zur Domain — Newsletter und Login-Links landen
schleichend im Spam, ohne dass eine Fehlermeldung auftaucht.

## Verifizierungen

| Typ | Name | Wert |
|---|---|---|
| TXT | @ | `brevo-code:e0bc0728a753aef3885c11650520d400` |
| TXT | @ | `google-site-verification=2zR4Jz8vCKzuF-MwcEYNZwUUEiNEofR8A` |

Fällt die Google-Zeile weg, verlierst du den Zugriff auf die Search Console für die Domain.

---

## Verbesserung, die beim Umzug mitgenommen werden sollte

Der SPF-Eintrag erlaubt derzeit nur Namecheap, **nicht Brevo**:

```
v=spf1 include:spf.efwd.registrar-servers.com ~all
```

Besser:

```
v=spf1 include:spf.efwd.registrar-servers.com include:spf.brevo.com ~all
```

Aktuell trägt die Zustellbarkeit allein die DKIM-Signatur. Das reicht für DMARC
(`p=none`, und DKIM allein genügt für ein Pass), ist aber unnötig auf einem Bein.

---

## Reihenfolge, die nichts kaputt macht

1. Zone in Cloudflare anlegen — **noch nicht** die Nameserver umstellen.
2. Alle 15 Records oben in Cloudflare eintragen und gegen diese Liste abhaken.
3. SSL/TLS auf **Full** stellen (nicht Flexible: Redirect-Schleife mit GitHub Pages;
   nicht Full Strict: scheitert, sobald GitHubs Zertifikat abläuft).
4. Erst jetzt bei Namecheap die Nameserver auf Cloudflare umstellen.
5. Warten, bis die Zone „Active" meldet.
6. Prüfen: Website erreichbar, Testmail an eine `@mbcapitalstrategies.com`-Adresse
   kommt an, `dig TXT _dmarc mbcapitalstrategies.com` liefert weiterhin den Brevo-Wert.
7. Worker-Route aktivieren, Nav-Link setzen, Datenschutz ergänzen.

Zwischen Schritt 4 und 5 antworten alte und neue Nameserver parallel. Solange die
Records identisch sind, merkt kein Besucher etwas — genau deshalb kommt Schritt 2 vor 4.

---

# Stand NACH dem Umzug — 01.09.2026

Zone bei Cloudflare **aktiv** seit 01.09.2026, 11:19 UTC. Nameserver: `aida.ns.cloudflare.com`, `tosana.ns.cloudflare.com`.

## Was sich geaendert hat

| Was | Vorher | Jetzt |
|---|---|---|
| MX | 5x `eforward*.registrar-servers.com` (Namecheap) | 3x `route1/2/3.mx.cloudflare.net` (Cloudflare Email Routing) |
| SPF | `v=spf1 include:spf.efwd.registrar-servers.com ~all` | `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all` |
| DKIM | brevo1/brevo2 | brevo1/brevo2 **plus** `cf2024-1._domainkey` (von Email Routing) |
| Always Use HTTPS | aus (http lieferte 200) | an (http -> 301 auf https) |
| SSL-Modus | — | Full |
| Worker-Routen | keine | `mbcapitalstrategies.com/community*`, `/api/community/*` -> `mbc-community` |

Grund fuer den MX-Wechsel: Namecheaps kostenlose Weiterleitung funktioniert laut deren
Dokumentation nur mit Namecheap-Nameservern. Nach dem Umzug war sie tot — die alten
MX-Einträge nahmen Mails an und verwarfen sie still.

Die geloeschten eforward-MX liegen als JSON-Sicherung in `backup/dns-vor-mx-loeschung.json`
(Cloud-Arbeitsverzeichnis der Sitzung, nicht im Repo).

## Wichtig fuer die Zukunft

- **Nur ein SPF-Eintrag pro Domain.** Zwei machen die Pruefung ungueltig, nicht doppelt sicher.
  Neue Versender gehoeren als weiteres `include:` in die bestehende Zeile.
- **MX niemals proxied.** Cloudflare laesst es zu, die Zustellung bricht aber.
- SSL-Modus bleibt **Full**. Nicht Flexible (Redirect-Schleife mit GitHub Pages),
  nicht Full Strict (bricht, sobald GitHubs Zertifikat rolliert).
