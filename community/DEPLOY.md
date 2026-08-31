# MB Capital Community — Inbetriebnahme

Stand: 31.08.2026 · Alles Nötige liegt in `community/`.

---

## 0 · Was vorher zu klären ist (wichtig)

Die Annahme „Seite läuft über Cloudflare Pages" stimmt nicht. Geprüft am 31.08.2026:

| Was | Befund |
|---|---|
| Hosting | **GitHub Pages** — `185.199.108–111.153`, Header `server: GitHub.com`, Deploy über `.github/workflows/pages.yml` bei Push auf `main` |
| DNS | **Namecheap** — `dns1.registrar-servers.com`, kein `cf-ray`-Header, Cloudflare ist nicht im Pfad |
| EN-Domains | `mbcapitalstrategiesglobal.com` + Tippfehler-Domain liegen **schon** auf Cloudflare (`aida/tosana.ns.cloudflare.com`) |

Ein Worker kann deshalb heute **nicht** unter `mbcapitalstrategies.com/community/` antworten.
Zwei Wege — Weg A ist die Empfehlung:

### Weg A — DNS der Hauptdomain zu Cloudflare umziehen (empfohlen, ~20 Min.)

Die Seite bleibt auf GitHub Pages, Cloudflare kommt nur davor. Danach läuft die Community
unter `mbcapitalstrategies.com/community/` — gleiche Domain, gleicher Pfad, maximaler SEO-Effekt.

1. Cloudflare-Dashboard → **Add a site** → `mbcapitalstrategies.com` (Free Plan). Der Scan importiert die
   bestehenden Records automatisch.
2. **Records prüfen, bevor du umstellst.** Diese müssen erhalten bleiben:
   - 4 × A auf `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` → **Proxied (orange)**
   - `www` CNAME → `mbp190799.github.io` → Proxied
   - 5 × MX auf `eforward1–5.registrar-servers.com` → **DNS only (grau)** — sonst ist deine
     Weiterleitung an Gmail tot
   - TXT `v=spf1 include:spf.efwd.registrar-servers.com ~all`
   - TXT `google-site-verification=2zR4Jz8vCKzuF-MwcEYNZwUUEiNEofR8A`
   - TXT `brevo-code:e0bc0728a753aef3885c11650520d400`
3. Bei Namecheap die Nameserver auf die beiden von Cloudflare genannten umstellen.
4. In Cloudflare **SSL/TLS → Full** setzen (nicht „Flexible" — sonst Redirect-Schleife mit GitHub Pages).
5. Warten bis die Zone „Active" ist (meist < 1 h), dann Schritt 1 unten.

> Nebeneffekt: Caching, Turnstile, Analytics und die Worker-Route gibt es damit gratis dazu.
> Risiko: eine falsch übernommene MX-Zeile kappt die E-Mail-Weiterleitung — deshalb Punkt 2 vor dem Umstellen abhaken.

### Weg B — Erst testen, ohne DNS anzufassen

Der Worker läuft sofort unter `https://mbc-community.<dein-subdomain>.workers.dev`.
Voll funktionsfähig zum Anschauen und Testen. Nachteile: eigene Domain in der URL,
Cookies sind dort Third-Party (Safari/Firefox blocken sie teils), **kein SEO-Nutzen**.
Nur als Vorschau gedacht — für den Echtbetrieb ist Weg A nötig.

---

## 1 · Datenbank anlegen

> **Hinweis:** `npx` ist auf deinem Rechner defekt (`ERR_INVALID_ARG_TYPE`, npm 11.6.0).
> Deshalb wrangler überall direkt über node aufrufen — das funktioniert:
> `node node_modules\wrangler\bin\wrangler.js <befehl>`

```powershell
cd C:\Users\marco\mb_sites\Mbcapitalstrategies\community\worker
npm install
node node_modules\wrangler\bin\wrangler.js login    # öffnet den Browser -> "Allow"
```

Danach erledigt **ein Skript** den ganzen Rest (D1 anlegen, database_id eintragen,
Tabellen erzeugen, AUTH_SECRET + ADMIN_TOKEN würfeln und setzen, deployen):

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

Die erzeugten Zugangsdaten landen in `%USERPROFILE%\mb-community-secrets.txt` —
außerhalb des Repos, damit sie nicht versehentlich in einen Commit rutschen.

Wer es lieber von Hand macht: `wrangler d1 create mbc-community`, die ausgegebene
`database_id` in `wrangler.toml` eintragen, dann `npm run db:init`.

## 2 · Turnstile-Keys holen

Cloudflare-Dashboard → **Turnstile** → *Add site*
- Domain: `mbcapitalstrategies.com` (bei Weg B zusätzlich `<subdomain>.workers.dev`)
- Widget-Modus: **Managed** (unsichtbar, wenn möglich)

Den **Sitekey** in `wrangler.toml` unter `TURNSTILE_SITEKEY` eintragen (der ist öffentlich).
Den **Secret Key** als Secret setzen (Schritt 3).

## 3 · Secrets setzen

`AUTH_SECRET` und `ADMIN_TOKEN` setzt `setup.ps1` bereits. Es fehlen noch zwei:

```powershell
node node_modules\wrangler\bin\wrangler.js secret put TURNSTILE_SECRET
node node_modules\wrangler\bin\wrangler.js secret put BREVO_API_KEY   # Brevo → SMTP & API → API Keys
```

`AUTH_SECRET` niemals ändern, solange Nutzer angemeldet sind — sonst sind alle Cookies ungültig
und jeder muss seinen Namen neu setzen.

## 4 · Brevo

- In Brevo die **Listen-ID** des Wochen-Insider ablesen und in `wrangler.toml` bei `BREVO_LIST_ID` eintragen.
- Absenderadresse `noreply@mbcapitalstrategies.com` in Brevo als Sender verifizieren
  (DKIM-Records setzt Brevo vor; die Domain liegt nach Weg A ohnehin bei Cloudflare).
- Ohne verifizierten Absender landen die Magic-Links im Spam.

## 5 · Deployen

```powershell
node node_modules\wrangler\bin\wrangler.js deploy
```

Danach unter `https://mbc-community.<subdomain>.workers.dev/community/` testen.

**Nach dem DNS-Umzug (Weg A):** in `wrangler.toml` den Block `routes = [...]` einkommentieren
und erneut deployen. Ab dann antwortet der Worker unter
`mbcapitalstrategies.com/community*` und `/api/community/*`; alles andere geht weiter an GitHub Pages.

## 6 · Statische Seite anpassen

```bash
git pull                       # WICHTIG: lokaler Klon war am 31.08. auf dem Stand vom 28.05.
python community/patch-site.py # setzt Nav-Link, robots.txt, Sitemap-Index — idempotent
git add -A && git commit -m "feat: Community — Nav, robots, Sitemap – batch 61"
git push
```

Was das Skript macht:
- fügt in jeder HTML-Datei einen `Community`-Link in die Hauptnavigation ein (nach „Analysen")
- trägt `Sitemap: https://mbcapitalstrategies.com/community/sitemap.xml` in `robots.txt` ein
- trägt `Disallow: /community/admin` in `robots.txt` ein
- legt `sitemap-community.xml` als Verweis an und referenziert sie in `sitemap.xml`

## 7 · Datenschutzerklärung ergänzen

`community/datenschutz-baustein.html` in `datenschutz.html` einfügen (Text ist fertig formuliert).
Pflicht, weil personenbezogene Daten (Name, IP-Hash, ggf. E-Mail) verarbeitet werden.

## 8 · Moderation

`https://mbcapitalstrategies.com/community/admin` — einmal `ADMIN_TOKEN` eingeben, bleibt im Browser.
Kann: Meldungen abarbeiten, Beiträge ausblenden, Nutzer sperren, alle Beiträge eines Nutzers auf
einmal ausblenden (Spam-Welle), Themen als Betreiber eröffnen und anpinnen.

Die Seite ist `noindex` und ohne Token nutzlos — die API prüft jeden Aufruf gegen `ADMIN_TOKEN`.

---

## Kosten

Alles im Gratis-Kontingent, geprüft am 31.08.2026:

| Dienst | Gratis-Limit | Bedarf bei 200 Sessions/Tag |
|---|---|---|
| Workers | 100.000 Requests/Tag, 10 ms CPU/Aufruf | ~3.000 |
| D1 | 5 Mio. gelesene Zeilen/Tag, 100.000 Schreibvorgänge/Tag, 5 GB | ~20.000 gelesen, ~100 geschrieben |
| Turnstile | unbegrenzt | — |
| Brevo | im bestehenden Tarif | wenige Mails/Tag |

Der Live-Feed pollt alle 15 s und **nur bei sichtbarem Tab** — das ist der Hebel, der die
Requests klein hält. Wenn die Community stark wächst: Poll-Intervall in `render.js`
(`setInterval(poll,15000)`) auf 30 s heben, dann halbiert sich die Last.

## Grenzen, die du kennen solltest

- **Free-Plan-CPU:** 10 ms pro Aufruf. Die SSR-Seiten liegen deutlich darunter, aber ein Thread mit
  200 Beiträgen ist der teuerste Fall. Deshalb ist die Post-Abfrage auf 200 begrenzt.
- **Kein WebSocket:** echte Live-Push-Nachrichten bräuchten Durable Objects (kostenpflichtig).
  Polling alle 15 s fühlt sich in der Praxis wie live an und kostet nichts.
- **Kein Bild-Upload:** bewusst weggelassen. Bilder heißen Speicher, Moderation und Urheberrecht.
  Nachrüstbar über R2, wenn es wirklich gebraucht wird.
