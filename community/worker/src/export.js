/**
 * MB Capital Strategies · Community Worker
 * export.js — Entwurf für einen Blogartikel aus einer Community-Diskussion
 *
 * Liefert bewusst einen ENTWURF, keinen fertigen Text: Behauptungen sind
 * markiert, Lücken stehen als TODO drin. Der Entwurf soll nicht versehentlich
 * veröffentlichbar sein — die Prüfung ist der Teil, der ihn erst tragfähig macht.
 */

/** Sätze, die nach überprüfbarer Behauptung aussehen. */
const CLAIM_PATTERNS = [
  { re: /\d+([.,]\d+)?\s*%/, why: 'Prozentangabe' },
  { re: /\b(USD|EUR|€|\$)\s?\d|\d+\s?(USD|EUR|€|\$)/i, why: 'Geldbetrag' },
  { re: /\b\d{2,}\s?(k|tsd|mio|mrd|mio\.|mrd\.)\b/i, why: 'Größenangabe' },
  { re: /\b(günstig|teuer|unterbewertet|überbewertet|sicher|garantiert|sicherste|beste|schlechteste)\b/i, why: 'Wertung ohne Beleg' },
  { re: /\b(dividende|payout|yoc|rendite|kgv|ebitda|fcf|cashflow|break-?even|tce|charterrate)\b/i, why: 'Kennzahl' },
  { re: /\b(steigt|fällt|verdoppelt|halbiert|explodiert|bricht ein)\b/i, why: 'Kursaussage' },
  { re: /\b(Q[1-4]|20\d\d)\b/, why: 'Zeitbezug' }
];

function findClaims(text) {
  const out = [];
  const sentences = String(text).split(/(?<=[.!?])\s+|\n+/).map(x => x.trim()).filter(x => x.length > 12);
  for (const sen of sentences) {
    const hits = CLAIM_PATTERNS.filter(p => p.re.test(sen)).map(p => p.why);
    if (hits.length) out.push({ satz: sen.slice(0, 220), gruende: [...new Set(hits)] });
  }
  return out;
}

const iso = ts => new Date(ts * 1000).toISOString().slice(0, 10);
const yaml = s => String(s).replace(/"/g, "'").replace(/\n/g, ' ').trim();

/**
 * @param {object} o
 * @param {object|null} o.thread   Thread-Datensatz (bei Themen-Export)
 * @param {string|null} o.ym       Monat (bei Monats-Export)
 * @param {Array}  o.posts         Beiträge mit name, body, created_at, featured_note, image_key
 * @param {object} o.env
 */
export function buildDraft({ thread, ym, posts, env }) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const titel = thread ? thread.title : `Was die Community im Monat ${ym} beschäftigt hat`;
  const quelle = thread ? `${site}/community/t/${thread.slug}` : `${site}/community/rueckblick/${ym}`;
  const woerter = posts.reduce((n, p) => n + p.body.split(/\s+/).length, 0);
  const koepfe = [...new Set(posts.map(p => p.name))];

  // Alle prüfenswerten Aussagen einsammeln
  const claims = [];
  for (const p of posts) for (const c of findClaims(p.body)) claims.push({ ...c, von: p.name, id: p.id });

  const L = [];
  L.push('---');
  L.push('status: ENTWURF — nicht veröffentlichen, bevor die Prüfliste unten abgehakt ist');
  L.push(`title: "${yaml(titel)}"`);
  L.push('description: "TODO — max. 155 Zeichen, mit dem Kern deiner These"');
  L.push(`date: ${new Date().toISOString().slice(0, 10)}`);
  L.push(`kategorie: ${thread ? thread.category : 'community'}`);
  L.push(`quelle: ${quelle}`);
  L.push(`beitraege: ${posts.length}`);
  L.push(`koepfe: ${koepfe.length}`);
  L.push(`rohwoerter: ${woerter}`);
  L.push('---');
  L.push('');

  L.push(`# ${titel}`);
  L.push('');
  L.push('> **TODO Intro (ca. 100 Wörter):** Warum dieser Artikel? Was war der Auslöser in der');
  L.push('> Community, und was nimmt der Leser mit, der nicht dabei war? Hier gehört deine These hin,');
  L.push('> nicht die Zusammenfassung — die kommt weiter unten von selbst.');
  L.push('');

  L.push('## Worum es ging');
  L.push('');
  L.push(`In der Community ${koepfe.length === 1 ? 'schrieb 1 Person' : `diskutierten ${koepfe.length} Personen`} `
       + `in ${posts.length} ${posts.length === 1 ? 'Beitrag' : 'Beiträgen'} über ${thread ? `„${titel}"` : 'die Marktlage'}. `
       + 'TODO: In zwei, drei Sätzen den Kontext setzen — Sektor, Zeitpunkt, warum das gerade jetzt relevant ist.');
  L.push('');

  L.push('## Die Beiträge');
  L.push('');
  L.push('<!-- Jedes Zitat bleibt dem Verfasser zugeordnet. Deine Einordnung steht darunter und');
  L.push('     ist als deine gekennzeichnet. Zitate, die nichts beitragen, ersatzlos löschen. -->');
  L.push('');
  for (const p of posts) {
    L.push(`### ${p.name} — ${iso(p.created_at)}`);
    L.push('');
    for (const zeile of p.body.split('\n')) L.push(zeile.trim() ? `> ${zeile.trim()}` : '>');
    L.push('');
    if (p.image_key) {
      L.push(`![Von ${p.name} geteiltes Bild](${site}/community/img/${p.image_key})`);
      L.push('');
    }
    if (p.featured_note) {
      L.push(`**Meine Einordnung:** ${p.featured_note}`);
    } else {
      L.push('**Meine Einordnung:** TODO — Zahl dagegenhalten, widersprechen oder weglassen.');
    }
    L.push('');
  }

  L.push('## Was ich daraus mitnehme');
  L.push('');
  L.push('> **TODO (300–400 Wörter):** Der Abschnitt, der den Artikel trägt. Nicht zusammenfassen,');
  L.push('> sondern bewerten: Welches Argument hält, welches nicht, und was heißt das für eine');
  L.push('> Entscheidung? Hier entsteht der Information Gain — alles darüber ist fremdes Material.');
  L.push('');

  L.push('## Fakten, die vor der Veröffentlichung zu prüfen sind');
  L.push('');
  if (claims.length) {
    L.push('Automatisch markiert, weil sie nach überprüfbarer Behauptung aussehen. Jede Zeile:');
    L.push('belegen, korrigieren oder als fremde Meinung kennzeichnen.');
    L.push('');
    for (const c of claims) {
      L.push(`- [ ] **${c.von}** (${c.gruende.join(', ')}): „${c.satz}"`);
      L.push('      → Beleg: ');
    }
  } else {
    L.push('- [ ] Keine Zahlen oder Wertungen automatisch erkannt — trotzdem einmal selbst durchlesen.');
  }
  L.push('');

  L.push('## Vor dem Veröffentlichen');
  L.push('');
  L.push('- [ ] Meta-Title gesetzt (max. 60 Zeichen)');
  L.push('- [ ] Meta-Description gesetzt (max. 155 Zeichen)');
  L.push('- [ ] Intro und „Was ich daraus mitnehme" geschrieben — ohne die beiden ist es fremder Inhalt');
  L.push('- [ ] Jede markierte Behauptung belegt oder als Meinung gekennzeichnet');
  L.push('- [ ] Fakt / Marktinterpretation / These sind unterscheidbar');
  L.push('- [ ] Mindestens 2 interne Links (Hub-Seite + passende Analyse)');
  L.push(`- [ ] Rückverlinkung auf die Diskussion: ${quelle}`);
  L.push('- [ ] 5 FAQs als JSON-LD ergänzt');
  L.push('- [ ] OG-Image gesetzt (1200×630, dunkel, Gold-Akzent)');
  L.push('- [ ] Anlageberatungs-Disclaimer steht drunter');
  L.push('- [ ] Zitierte Personen sind mit Anzeigenamen genannt, nicht mit Klarnamen');
  L.push('- [ ] Artikellänge nach dem Ausbau: 1000–1400 Wörter');
  L.push('');
  L.push(`*Rohmaterial: ${woerter} Wörter aus ${posts.length} Community-Beiträgen. `
       + 'Das allein reicht nicht — der Wert entsteht in den TODO-Abschnitten.*');
  L.push('');

  return L.join('\n');
}
