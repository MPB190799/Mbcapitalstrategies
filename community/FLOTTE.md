# Community — was die Flotte wissen muss

Neuer Baustein im Ökosystem seit 31.08.2026. Kurz für Agenten-Specs und `brain.py`.

---

## Was es ist

Eigene Community auf `mbcapitalstrategies.com/community/` — Ersatz für Telegram/Discord.
Cloudflare Worker + D1, kein externer Dienst, keine laufenden Kosten.

Zwei Ebenen:
- **Live-Feed** (`thread_id IS NULL`) — chronologischer Stream, per JavaScript geladen, **nicht indexiert**. Zweck: Verweildauer.
- **Themen-Threads** (`/community/t/<slug>`) — server-seitig gerendert, `DiscussionForumPosting`-Schema, eigene Sitemap. Zweck: SEO, frischer User-Content.

Zugang: Gast (Name + signierter Cookie) oder Magic-Link per Brevo. Kein Passwort, kein Fingerprinting.

## Warum das für die Pipeline relevant ist

Jeder neue Blog-Artikel und jedes Video kann automatisch ein passendes Thema eröffnen.
Das erzeugt eine interne Verlinkung, frischen Content auf der Domain und einen Anlass zurückzukommen —
ohne dass Marco etwas tippt. Empfohlener Anschluss: nach `blog-generator` und nach `yt-upload`.

## Admin-API (für Agenten)

Basis: `https://mbcapitalstrategies.com/api/community/admin/`
Header: `Authorization: Bearer $MBC_COMMUNITY_ADMIN_TOKEN` · Body: JSON

| Endpunkt | Zweck | Felder |
|---|---|---|
| `open-thread` | Thema als Betreiber eröffnen | `title`, `intro`, `category`, `body`, `pinned` |
| `post-as` | Beitrag als Betreiber schreiben | `body`, `thread` (id, optional) |
| `overview` | Meldungen, letzte Beiträge, Nutzer (GET) | — |
| `hide-post` / `show-post` | Beitrag aus-/einblenden | `id` |
| `ban` / `unban` / `purge-user` | Nutzer sperren, Beiträge räumen | `id`, `days`, `reason` |
| `pin` / `lock` / `hide-thread` | Thema steuern | `id`, `on` |
| `resolve-report` | Meldung abschließen | `id`, `action` |

Kategorien: `shipping`, `mining`, `energie`, `dividenden`, `depot`, `allgemein`.

Beispiel — Thema zum frisch veröffentlichten Artikel:

```bash
curl -sS -X POST https://mbcapitalstrategies.com/api/community/admin/open-thread \
  -H "Authorization: Bearer $MBC_COMMUNITY_ADMIN_TOKEN" \
  -H 'content-type: application/json' \
  -d '{"title":"Petrotal: Was haltet ihr vom Break-even bei 45 USD?",
       "intro":"Zur neuen Analyse — eure Gegenrechnung interessiert mich.",
       "category":"energie",
       "body":"Die Analyse steht im Blog. Kurzfassung: ...\n\nWo widersprecht ihr?"}'
```

## Regeln für Agenten

1. **Höchstens ein automatisch eröffnetes Thema pro Tag.** Eine Community, die nach Bot aussieht, stirbt.
2. **Nie automatisch auf Nutzerbeiträge antworten.** Antworten von „Marco" schreibt Marco.
   Ein Agent darf höchstens einen Entwurf vorschlagen.
3. **Der `factcheck`-Skill gilt auch hier** — jede Zahl in einem Community-Beitrag geht raus wie eine
   Blog-Zahl. Fakt / Marktinterpretation / These trennen.
4. **Kein Affiliate-Link in Community-Beiträgen.** Weder von Marco noch automatisch.
5. **Moderation ist nicht automatisierbar.** Ein Agent darf Meldungen zusammenfassen und melden,
   aber Sperren und Löschungen entscheidet Marco. Rechtlich hängt daran der DSA-Meldeweg.
6. **Kennzahlen für den Morning Report:** `GET /api/community/admin/overview` liefert offene Meldungen,
   letzte Beiträge und neue Nutzer. Offene Meldungen gehören in den Morning Report — nicht in ein
   separates Timer-Skript. Kein neuer systemd-Timer; über den Dispatcher/Paperclip anhängen.

## Wo was liegt

```
Repo Mbcapitalstrategies/
  community/
    worker/src/index.js     Router, API, Moderation, Sitemap
    worker/src/render.js    SSR + Design-System + Client-JS
    worker/src/lib.js       Krypto, Cookie, Spam-Filter, Rate-Limit, Brevo
    worker/schema.sql       D1-Schema
    worker/wrangler.toml    Bindings, Variablen, Route
    DEPLOY.md               Inbetriebnahme Schritt für Schritt
    patch-site.py           Nav-Link, robots.txt, Sitemap (idempotent)
    datenschutz-baustein.html
    FLOTTE.md               diese Datei
```

## Offener Punkt (Stand 31.08.2026)

`mbcapitalstrategies.com` liegt auf **GitHub Pages** mit **Namecheap-DNS** — nicht auf Cloudflare.
Solange das so ist, kann der Worker nicht unter dem Pfad `/community/` antworten.
Siehe `DEPLOY.md`, Abschnitt 0. Ohne diesen Schritt gibt es keinen SEO-Effekt.
