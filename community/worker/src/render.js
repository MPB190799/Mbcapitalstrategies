/**
 * MB Capital Strategies · Community Worker
 * render.js — Server-Side-Rendering (SEO) + Design-System der Hauptseite
 */

import { esc, ago, renderBody } from './lib.js';

export const CATEGORIES = [
  { key: 'shipping',    label: 'Shipping',          hint: 'Tanker, LPG, Dry Bulk, Charterraten' },
  { key: 'mining',      label: 'Mining & Rohstoffe', hint: 'Kohle, Kupfer, Eisenerz, Gold' },
  { key: 'energie',     label: 'Energie & Upstream', hint: 'Öl, Gas, Pipelines, Midstream' },
  { key: 'dividenden',  label: 'Dividenden & YOC',   hint: 'Yield on Cost, Payout, Steuern' },
  { key: 'depot',       label: 'Depot & Strategie',  hint: 'Gewichtung, Cluster-Risiko, Cash' },
  { key: 'allgemein',   label: 'Lounge',             hint: 'Alles andere' }
];

const catLabel = k => (CATEGORIES.find(c => c.key === k) || CATEGORIES[5]).label;

/**
 * JSON-LD sicher in ein <script>-Tag schreiben.
 * JSON.stringify escaped "<" NICHT — ein Thread-Titel mit "</script>" könnte
 * sonst aus dem Script-Block ausbrechen (XSS). Darum die drei Zeichen escapen.
 */
const jsonSafe = o => JSON.stringify(o)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026').replace(/\u2028|\u2029/g, m => m === '\u2028' ? '\\u2028' : '\\u2029');

/* ------------------------------------------------------------------ *
 * Design-System — 1:1 die Tokens von mbcapitalstrategies.com
 * ------------------------------------------------------------------ */
const CSS = `
:root{
  --bg:#0c0b09;--surface:#151310;--surface-2:#1d1a15;
  --border:rgba(212,175,55,.14);--border-strong:rgba(212,175,55,.32);
  --fg:#f1ecdf;--fg-muted:#a39885;--fg-dim:#746b5d;
  --accent:#d4af37;--accent-bright:#e0bd55;--accent-deep:#b8941e;
  --ok:#22c55e;--danger:#b85b4a;
  --maxw:1320px;--pad:clamp(20px,4vw,56px);
  --serif:"Cormorant Garamond","Iowan Old Style",Georgia,serif;
  --sans:"Outfit","Inter Tight",-apple-system,system-ui,sans-serif;
  --mono:"IBM Plex Mono","JetBrains Mono","SF Mono",Menlo,Consolas,monospace;
  --t-fast:220ms cubic-bezier(.2,.6,.2,1);--t-med:480ms cubic-bezier(.2,.6,.2,1);
}
[data-theme="light"]{
  --bg:#eae6dd;--surface:#f1ede3;--surface-2:#e1dccf;
  --border:rgba(184,148,30,.18);--border-strong:rgba(184,148,30,.34);
  --fg:#1a1916;--fg-muted:#5a5449;--fg-dim:#8a8276;
  --accent:#b8941e;--accent-bright:#d4af37;--accent-deep:#8a6a14;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
html,body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden;transition:background var(--t-med),color var(--t-med)}
img,svg{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button,input,textarea,select{font:inherit;color:inherit}
::selection{background:var(--accent);color:var(--bg)}
[hidden]{display:none!important}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--pad)}
.display{font-family:var(--serif);font-weight:400;line-height:1.02;letter-spacing:-.02em}
.display em{font-style:italic;color:var(--accent)}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:22px;height:1px;background:var(--accent)}
.mono{font-family:var(--mono)}

/* Header ---------------------------------------------------------- */
.header{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:14px var(--pad);background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border)}
.logo{display:flex;align-items:center;gap:12px}
.logo img{width:36px;height:36px}
.logo-name{font-family:var(--serif);font-size:18px;letter-spacing:.01em}
.logo-name em{font-style:italic;color:var(--accent)}
.hnav{display:flex;align-items:center;gap:22px}
.hnav a{font-size:13px;color:var(--fg-muted);transition:color var(--t-fast)}
.hnav a:hover,.hnav a[aria-current]{color:var(--accent)}
.theme-btn{width:34px;height:34px;display:grid;place-items:center;border:1px solid var(--border-strong);border-radius:999px;background:none;cursor:pointer;color:var(--fg-muted)}
@media(max-width:860px){.hnav a.hide-s{display:none}}

/* Hero ------------------------------------------------------------ */
.hero{padding:clamp(48px,7vw,96px) 0 clamp(28px,4vw,48px);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;inset:auto -10% -60% 40%;height:420px;
  background:radial-gradient(closest-side,rgba(212,175,55,.10),transparent 70%);pointer-events:none}
.hero h1{font-family:var(--serif);font-size:clamp(38px,6.2vw,76px);line-height:1.02;letter-spacing:-.025em;margin:20px 0 18px;max-width:16ch}
.hero p{color:var(--fg-muted);font-size:clamp(15px,1.5vw,18px);max-width:62ch}
.hero-stats{display:flex;flex-wrap:wrap;gap:34px;margin-top:34px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg-dim)}
.hero-stats b{display:block;font-family:var(--serif);font-size:34px;letter-spacing:-.01em;color:var(--fg);font-weight:400;text-transform:none}
.livedot{width:7px;height:7px;border-radius:50%;background:var(--ok);display:inline-block;margin-right:8px;box-shadow:0 0 0 0 rgba(34,197,94,.6);animation:pulse 2.4s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}

/* Layout ---------------------------------------------------------- */
.cols{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(28px,4vw,60px);padding:clamp(36px,5vw,64px) 0 100px;align-items:start}
@media(max-width:980px){.cols{grid-template-columns:1fr;padding-top:26px}.side{order:2;margin-top:34px}}
.sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.sec-head h2{font-family:var(--serif);font-size:clamp(24px,3vw,34px);font-weight:400;letter-spacing:-.015em}

/* Karten / Threads ------------------------------------------------ */
.card{background:var(--surface);border:1px solid var(--border);padding:22px 24px;transition:border-color var(--t-fast),transform var(--t-fast)}
.card:hover{border-color:var(--border-strong)}
.thread{display:block;margin-bottom:12px;position:relative}
.thread:hover{transform:translateY(-1px)}
.thread .t-top{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.thread h3{font-family:var(--serif);font-size:23px;font-weight:400;line-height:1.2;letter-spacing:-.01em;margin-bottom:8px}
.thread p{color:var(--fg-muted);font-size:14px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.thread .t-meta{margin-top:14px;display:flex;flex-wrap:wrap;gap:16px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--fg-dim);text-transform:uppercase}
.pin{color:var(--accent);border:1px solid var(--border-strong);padding:2px 7px;border-radius:2px;font-size:9px}
.badge-mb{background:var(--accent);color:var(--bg);padding:2px 7px;border-radius:2px;font-size:9px;font-weight:600}

/* Beiträge -------------------------------------------------------- */
.post{display:grid;grid-template-columns:38px minmax(0,1fr);gap:14px;padding:18px 0;border-bottom:1px solid var(--border)}
.post:last-child{border-bottom:0}
.ava{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-family:var(--mono);font-size:13px;font-weight:600;
  background:var(--surface-2);border:1px solid var(--border-strong);color:var(--accent);text-transform:uppercase}
.ava.mb{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.p-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;margin-bottom:5px}
.p-name{font-weight:600;font-size:14.5px}
.p-time{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--fg-dim);text-transform:uppercase}
.p-body{font-size:15px;line-height:1.65;color:var(--fg);word-wrap:break-word;overflow-wrap:anywhere}
.p-body p{margin-bottom:10px}
.p-body a{color:var(--accent);border-bottom:1px solid var(--border-strong)}
.tick{font-family:var(--mono);font-size:.9em;color:var(--accent);letter-spacing:.02em}
.p-act{margin-top:8px;display:flex;gap:14px;font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-dim);opacity:0;transition:opacity var(--t-fast)}
.post:hover .p-act,.post:focus-within .p-act{opacity:1}
.p-act button{background:none;border:0;cursor:pointer;color:inherit}
.p-act button:hover{color:var(--accent)}

/* Compose --------------------------------------------------------- */
.compose{background:var(--surface);border:1px solid var(--border-strong);padding:18px 20px;margin-bottom:26px;position:relative}
.compose textarea{width:100%;background:transparent;border:0;resize:vertical;min-height:74px;font-size:15px;line-height:1.6;color:var(--fg);font-family:var(--sans)}
.compose textarea::placeholder{color:var(--fg-dim)}
.compose-bar{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
.counter{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--fg-dim)}
.counter.warn{color:var(--danger)}
.btn{display:inline-flex;align-items:center;gap:9px;padding:12px 20px;border:1px solid var(--accent);background:transparent;color:var(--accent);
  font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;cursor:pointer;transition:all var(--t-fast)}
.btn:hover{background:var(--accent);color:var(--bg)}
.btn[disabled]{opacity:.4;cursor:not-allowed}
.btn-solid{background:var(--accent);color:var(--bg)}
.btn-solid:hover{background:var(--accent-bright)}
.btn-ghost{border-color:var(--border-strong);color:var(--fg-muted)}
.btn-ghost:hover{background:transparent;border-color:var(--accent);color:var(--accent)}
.btn-sm{padding:9px 15px;font-size:10.5px}

/* Onboarding / Gast ---------------------------------------------- */
.gate{background:var(--surface);border:1px solid var(--border-strong);padding:26px 26px 24px;margin-bottom:26px}
.gate h3{font-family:var(--serif);font-size:26px;font-weight:400;margin:12px 0 8px;letter-spacing:-.01em}
.gate p{color:var(--fg-muted);font-size:14.5px;max-width:56ch}
.field{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
.field input{flex:1;min-width:200px;background:var(--bg);border:1px solid var(--border-strong);padding:13px 15px;font-size:15px;color:var(--fg)}
.field input::placeholder{color:var(--fg-dim)}
.hint{margin-top:12px;font-size:12.5px;color:var(--fg-dim);line-height:1.6}
.hint a{color:var(--accent)}
.tabs{display:flex;gap:8px;margin-bottom:4px}
.tab{padding:7px 14px;border:1px solid var(--border);font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-dim);cursor:pointer;background:none}
.tab[aria-selected="true"]{border-color:var(--accent);color:var(--accent)}
.chk{display:flex;gap:10px;align-items:flex-start;margin-top:14px;font-size:13px;color:var(--fg-muted);line-height:1.5}
.chk input{margin-top:3px;accent-color:var(--accent);width:16px;height:16px}

/* Sidebar --------------------------------------------------------- */
.side{position:sticky;top:86px;display:flex;flex-direction:column;gap:18px}
@media(max-width:980px){.side{position:static}}
.panel{background:var(--surface);border:1px solid var(--border);padding:20px 22px}
.panel h4{font-family:var(--mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
.cat{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px}
.cat:last-child{border-bottom:0}
.cat span{font-family:var(--mono);font-size:10.5px;color:var(--fg-dim)}
.cat:hover{color:var(--accent)}
.rules{list-style:none;font-size:13.5px;color:var(--fg-muted);line-height:1.6}
.rules li{padding-left:20px;position:relative;margin-bottom:9px}
.rules li::before{content:"—";position:absolute;left:0;color:var(--accent)}
.who{display:flex;flex-wrap:wrap;gap:7px}
.who span{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;padding:5px 10px;border:1px solid var(--border);color:var(--fg-muted)}

/* Feedback -------------------------------------------------------- */
.msg{padding:12px 15px;font-size:13.5px;border-left:2px solid var(--accent);background:var(--surface-2);margin-bottom:16px;display:none}
.msg.show{display:block}
.msg.err{border-color:var(--danger);color:var(--fg)}
.msg.ok{border-color:var(--ok)}
.empty{text-align:center;padding:56px 20px;color:var(--fg-dim)}
.empty .display{font-size:28px;color:var(--fg-muted);margin-bottom:10px}
.skel{height:64px;background:linear-gradient(90deg,var(--surface),var(--surface-2),var(--surface));background-size:200% 100%;animation:sh 1.4s infinite;margin-bottom:10px}
@keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Thread-Seite ---------------------------------------------------- */
.crumb{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg-dim);padding:22px 0 0}
.crumb a{color:var(--accent)}
.t-hero{padding:16px 0 30px;border-bottom:1px solid var(--border)}
.t-hero h1{font-family:var(--serif);font-size:clamp(30px,4.6vw,52px);font-weight:400;line-height:1.08;letter-spacing:-.022em;margin:14px 0 12px}
.t-hero .lede{color:var(--fg-muted);font-size:17px;max-width:66ch}
.t-hero .t-meta{margin-top:18px;display:flex;flex-wrap:wrap;gap:18px;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-dim)}

/* Footer ---------------------------------------------------------- */
.foot{border-top:1px solid var(--border);padding:40px 0;margin-top:40px;font-size:12.5px;color:var(--fg-dim)}
.foot .wrap{display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:flex-start}
.foot .wrap>*{max-width:100%}
.foot a{color:var(--fg-muted)}.foot a:hover{color:var(--accent)}
.disc{flex:1 0 100%;width:100%;max-width:78ch;line-height:1.6;margin-top:8px;font-size:11.5px;padding-top:16px;border-top:1px solid var(--border)}
`;

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */
export function layout({ title, desc, canonical, jsonld = [], body, bodyClass = '', ogImage, noindex = false, env }) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const og = ogImage || `${site}/assets/og-default.jpg`;
  return `<!doctype html>
<html lang="de" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MB Capital Strategies">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${site}/favicon-32x32.png" sizes="32x32">
<link rel="apple-touch-icon" href="${site}/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
${jsonld.map(o => `<script type="application/ld+json">${jsonSafe(o)}</script>`).join('\n')}
</head>
<body class="${bodyClass}">
<script>try{var t=localStorage.getItem('mbc-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<header class="header">
  <a class="logo" href="${site}/" aria-label="MB Capital Strategies Startseite">
    <picture><source srcset="${site}/Logo.webp" type="image/webp"><img src="${site}/Logo.png" alt="MB Capital Strategies" width="36" height="36"></picture>
    <span class="logo-name">MB <em>Capital Strategies</em></span>
  </a>
  <nav class="hnav" aria-label="Hauptnavigation">
    <a class="hide-s" href="${site}/depot-strategie/">Depot</a>
    <a class="hide-s" href="${site}/blog/">Analysen</a>
    <a class="hide-s" href="${site}/rechner/">Rechner</a>
    <a href="/community/" aria-current="page">Community</a>
    <a class="hide-s" href="${site}/insider/">Newsletter</a>
    <button class="theme-btn" id="themeBtn" aria-label="Theme wechseln">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </nav>
</header>
${body}
<footer class="foot"><div class="wrap">
  <div>© ${new Date().getFullYear()} MB Capital Strategies · Marco Bozem</div>
  <div>
    <a href="/community/regeln">Community-Regeln</a> ·
    <a href="${site}/impressum.html">Impressum</a> ·
    <a href="${site}/datenschutz.html">Datenschutz</a> ·
    <a href="${site}/disclaimer.html">Disclaimer</a>
  </div>
  <div class="disc">
    <strong>Keine Anlageberatung.</strong> Beiträge in dieser Community sind die private Meinung der jeweiligen Verfasser
    und stellen weder eine Anlageberatung noch eine Kauf- oder Verkaufsempfehlung dar. Jede Anlageentscheidung triffst du
    eigenverantwortlich. Für die Inhalte fremder Beiträge übernimmt der Betreiber keine Haftung; Verstöße lassen sich
    über die Melden-Funktion oder per Mail an den Betreiber anzeigen.
  </div>
</div></footer>
<script>
(function(){var b=document.getElementById('themeBtn');if(!b)return;b.addEventListener('click',function(){
var d=document.documentElement,n=d.dataset.theme==='light'?'dark':'light';d.dataset.theme=n;
try{localStorage.setItem('mbc-theme',n)}catch(e){}});})();
</script>
</body></html>`;
}

/* ------------------------------------------------------------------ *
 * Community-Startseite (Hub)
 * ------------------------------------------------------------------ */
export function renderHub({ threads, stats, env, turnstileKey }) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const canonical = `${site}/community/`;

  const threadHtml = threads.length ? threads.map(t => `
  <a class="card thread" href="/community/t/${esc(t.slug)}">
    <div class="t-top">
      ${t.pinned ? '<span class="pin">Angepinnt</span>' : ''}
      ${t.official ? '<span class="badge-mb">Marco</span>' : ''}
      <span>${esc(catLabel(t.category))}</span>
    </div>
    <h3>${esc(t.title)}</h3>
    ${t.intro ? `<p>${esc(t.intro)}</p>` : ''}
    <div class="t-meta">
      <span>${t.post_count} ${t.post_count === 1 ? 'Beitrag' : 'Beiträge'}</span>
      <span>Letzter: ${esc(ago(t.last_post_at))}</span>
      <span>von ${esc(t.author_name || 'Gast')}</span>
    </div>
  </a>`).join('') : `<div class="card empty"><div class="display">Noch keine Themen.</div>
     <p>Eröffne das erste — z.&nbsp;B. „Wo stehen wir im Tanker-Zyklus?“</p></div>`;

  const body = `
<section class="hero"><div class="wrap">
  <span class="eyebrow"><span class="livedot"></span>Community · Live</span>
  <h1 class="display">Wo Hard-Asset-Investoren <em>Klartext</em> reden.</h1>
  <p>Kein Telegram, kein Discord — direkt hier. Schreib ohne Registrierung mit: Name eintragen, loslegen.
     Für Dauergäste gibt es den Magic-Link, damit der Name auf jedem Gerät bleibt.</p>
  <div class="hero-stats">
    <div><b>${stats.posts}</b>Beiträge</div>
    <div><b>${stats.users}</b>Köpfe</div>
    <div><b>${stats.threads}</b>Themen</div>
    <div><b>${stats.today}</b>Heute</div>
  </div>
</div></section>

<div class="wrap cols">
  <main>
    <div id="gate"></div>
    <div class="msg" id="msg"></div>

    <div class="sec-head">
      <h2>Live-Feed</h2>
      <a class="btn btn-ghost btn-sm" href="#themen">Zu den Themen ↓</a>
    </div>
    <div id="feed"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
    <div style="text-align:center;margin-top:22px">
      <button class="btn btn-ghost btn-sm" id="more" hidden>Ältere laden</button>
    </div>

    <div class="sec-head" id="themen" style="margin-top:64px">
      <h2>Themen</h2>
      <button class="btn btn-ghost btn-sm" id="newThread">+ Thema eröffnen</button>
    </div>
    <div id="threadForm" hidden class="gate">
      <span class="eyebrow">Neues Thema</span>
      <h3>Worum geht’s?</h3>
      <p>Themen bekommen eine eigene Seite und werden von Google gefunden. Wähle einen Titel, den man auch in zwei Jahren noch versteht.</p>
      <div class="field"><input id="tTitle" maxlength="90" placeholder="Titel — z. B. „TORM: Wie tief kann die Dividende fallen?“"></div>
      <div class="field"><input id="tIntro" maxlength="180" placeholder="Ein Satz Kontext (optional, erscheint in Google)"></div>
      <div class="field">
        <select id="tCat" style="flex:1;min-width:200px;background:var(--bg);border:1px solid var(--border-strong);padding:13px 15px">
          ${CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
        </select>
      </div>
      <div class="field"><textarea id="tBody" rows="4" maxlength="2000" placeholder="Dein Eröffnungsbeitrag …" style="flex:1;min-width:100%;background:var(--bg);border:1px solid var(--border-strong);padding:13px 15px;color:var(--fg);font-family:var(--sans)"></textarea></div>
      <div class="field"><button class="btn btn-solid" id="tSubmit">Thema eröffnen</button>
      <button class="btn btn-ghost" id="tCancel">Abbrechen</button></div>
    </div>
    <div id="threads">${threadHtml}</div>
  </main>

  <aside class="side">
    <div class="panel">
      <h4>Bereiche</h4>
      ${CATEGORIES.map(c => `<a class="cat" href="/community/kategorie/${c.key}"><span style="font-family:var(--sans);font-size:14px;color:inherit">${c.label}</span><span>${esc(c.hint.split(',')[0])}</span></a>`).join('')}
    </div>
    <div class="panel">
      <h4>Hausordnung</h4>
      <ul class="rules">
        <li>Substanz statt Hype. Zahlen schlagen Meinung.</li>
        <li>Keine Kursziel-Rufe ohne Begründung.</li>
        <li>Kein Spam, keine Empfehlungs-Links, keine Signal-Gruppen.</li>
        <li>Wer beleidigt, fliegt. Ohne Diskussion.</li>
        <li>Keine Anlageberatung — hier reden Privatanleger.</li>
      </ul>
      <a class="btn btn-ghost btn-sm" style="margin-top:16px" href="/community/regeln">Vollständige Regeln</a>
    </div>
    <div class="panel" id="whoPanel" hidden>
      <h4>Zuletzt aktiv</h4>
      <div class="who" id="who"></div>
    </div>
    <div class="panel">
      <h4>Newsletter</h4>
      <p style="font-size:13.5px;color:var(--fg-muted);line-height:1.6">
        Jeden Sonntag der Wochenrückblick: Frachtraten, Rohstoffpreise, Dividenden-Ticker.</p>
      <a class="btn btn-ghost btn-sm" style="margin-top:14px" href="${site}/insider/">Kostenlos abonnieren</a>
    </div>
  </aside>
</div>

${turnstileKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>' : ''}
<script>window.MBC={turnstile:${turnstileKey ? JSON.stringify(turnstileKey) : 'null'},thread:null};</script>
<script>${CLIENT_JS}</script>`;

  const jsonld = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'MB Capital Community', url: canonical,
      description: 'Community für Hard-Asset- und Dividenden-Investoren: Shipping, Mining, Energie, Pipelines.',
      isPartOf: { '@type': 'WebSite', name: 'MB Capital Strategies', url: site },
      inLanguage: 'de-DE'
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: site + '/' },
        { '@type': 'ListItem', position: 2, name: 'Community', item: canonical }
      ]
    }
  ];

  return layout({
    title: 'Community — Hard Assets & Dividenden im Klartext | MB Capital Strategies',
    desc: 'Die Community für Shipping-, Mining- und Energie-Investoren. Ohne Registrierung mitreden, Themen eröffnen, Zahlen diskutieren. Direkt auf mbcapitalstrategies.com.',
    canonical, jsonld, body, env
  });
}

/* ------------------------------------------------------------------ *
 * Thread-Seite (die eigentliche SEO-Maschine)
 * ------------------------------------------------------------------ */
export function renderThread({ thread, posts, env, turnstileKey }) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const canonical = `${site}/community/t/${thread.slug}`;
  const iso = ts => new Date(ts * 1000).toISOString();

  const postsHtml = posts.map(p => `
  <article class="post" id="p${p.id}">
    <div class="ava ${p.role === 'admin' ? 'mb' : ''}">${esc((p.name || '?').slice(0, 2))}</div>
    <div>
      <div class="p-head">
        <span class="p-name">${esc(p.name)}</span>
        ${p.role === 'admin' ? '<span class="badge-mb">Betreiber</span>' : ''}
        <time class="p-time" datetime="${iso(p.created_at)}">${esc(ago(p.created_at))}</time>
      </div>
      <div class="p-body"><p>${renderBody(p.body)}</p></div>
      <div class="p-act">
        <button data-report="${p.id}">Melden</button>
        <a href="#p${p.id}">Permalink</a>
      </div>
    </div>
  </article>`).join('');

  const body = `
<div class="wrap">
  <nav class="crumb" aria-label="Brotkrumen">
    <a href="${site}/">Start</a> / <a href="/community/">Community</a> / ${esc(catLabel(thread.category))}
  </nav>
</div>
<section class="t-hero"><div class="wrap">
  <span class="eyebrow">${esc(catLabel(thread.category))}${thread.official ? ' · Marco' : ''}</span>
  <h1>${esc(thread.title)}</h1>
  ${thread.intro ? `<p class="lede">${esc(thread.intro)}</p>` : ''}
  <div class="t-meta">
    <span>${thread.post_count} ${thread.post_count === 1 ? 'Beitrag' : 'Beiträge'}</span>
    <span>Eröffnet ${esc(ago(thread.created_at))}</span>
    <span>Letzter Beitrag ${esc(ago(thread.last_post_at))}</span>
    ${thread.locked ? '<span style="color:var(--danger)">Geschlossen</span>' : ''}
  </div>
</div></section>

<div class="wrap cols">
  <main>
    <div id="gate"></div>
    <div class="msg" id="msg"></div>
    <div id="feed">${postsHtml}</div>
    <div style="text-align:center;margin-top:22px">
      <button class="btn btn-ghost btn-sm" id="more" hidden>Ältere laden</button>
    </div>
  </main>
  <aside class="side">
    <div class="panel">
      <h4>Zum Thema</h4>
      <ul class="rules">
        <li>Argumente mit Zahlen belegen.</li>
        <li>Quelle nennen, wenn du Daten zitierst.</li>
        <li>Keine Anlageberatung, keine Garantien.</li>
      </ul>
      <a class="btn btn-ghost btn-sm" style="margin-top:16px" href="/community/">Alle Themen</a>
    </div>
    <div class="panel">
      <h4>Passend dazu</h4>
      <p style="font-size:13.5px;color:var(--fg-muted);line-height:1.6">Tiefer einsteigen? Die Analysen zum Sektor liegen im Blog.</p>
      <a class="btn btn-ghost btn-sm" style="margin-top:14px" href="${site}/blog/">Analysen lesen</a>
    </div>
  </aside>
</div>

${turnstileKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>' : ''}
<script>window.MBC={turnstile:${turnstileKey ? JSON.stringify(turnstileKey) : 'null'},thread:${JSON.stringify(thread.id)},locked:${thread.locked ? 'true' : 'false'}};</script>
<script>${CLIENT_JS}</script>`;

  const first = posts[0];
  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    '@id': canonical,
    headline: thread.title,
    url: canonical,
    datePublished: iso(thread.created_at),
    dateModified: iso(thread.last_post_at),
    author: { '@type': 'Person', name: first?.name || 'Gast' },
    articleSection: catLabel(thread.category),
    inLanguage: 'de-DE',
    text: (first?.body || thread.intro || '').slice(0, 500),
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: thread.post_count
    },
    isPartOf: { '@type': 'WebSite', name: 'MB Capital Strategies', url: site },
    comment: posts.slice(1, 21).map(p => ({
      '@type': 'Comment',
      author: { '@type': 'Person', name: p.name },
      datePublished: iso(p.created_at),
      text: p.body.slice(0, 500)
    }))
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Community', item: site + '/community/' },
      { '@type': 'ListItem', position: 3, name: thread.title, item: canonical }
    ]
  }];

  const desc = (thread.intro || first?.body || thread.title).replace(/\s+/g, ' ').slice(0, 152);

  return layout({
    title: `${thread.title} — MB Capital Community`,
    desc, canonical, jsonld, body, env,
    // Threads mit nur einem Beitrag sind noch dünn -> erst ab dem 2. Beitrag indexieren
    noindex: thread.post_count < 2
  });
}

/* ------------------------------------------------------------------ *
 * Regelseite
 * ------------------------------------------------------------------ */
export function renderRules(env) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const body = `
<div class="wrap"><nav class="crumb"><a href="${site}/">Start</a> / <a href="/community/">Community</a> / Regeln</nav></div>
<section class="t-hero"><div class="wrap">
  <span class="eyebrow">Hausordnung</span>
  <h1>Community-Regeln</h1>
  <p class="lede">Kurz, damit sie jeder liest. Verbindlich, damit der Ton stimmt.</p>
</div></section>
<div class="wrap" style="padding:44px 0 90px;max-width:820px">
  ${[
    ['1 · Substanz vor Lautstärke', 'Behauptungen brauchen Zahlen oder eine Quelle. „TORM geht auf 40“ ohne Begründung ist kein Beitrag, sondern Rauschen.'],
    ['2 · Keine Anlageberatung', 'Niemand hier ist dein Berater. Beiträge sind private Meinungen. Jede Entscheidung triffst du selbst und auf eigenes Risiko.'],
    ['3 · Kein Spam, keine Werbung', 'Keine Empfehlungs-Links, keine Signal-Gruppen, keine „garantierten Renditen“. Links sind ab dem dritten Beitrag möglich — das hält Bots draußen.'],
    ['4 · Respekt', 'Harte Sachdiskussion: gern. Beleidigungen, Hetze, Diskriminierung: sofortiger Ausschluss, ohne Diskussion.'],
    ['5 · Keine Kursmanipulation', 'Kein koordiniertes Pushen, keine Pump-and-Dump-Aufrufe, keine Falschinformationen zu Unternehmen. Das ist nicht nur unerwünscht, sondern strafbar.'],
    ['6 · Ein Name, ein Mensch', 'Keine Doppel-Identitäten, keine Imitation von Marco, Moderatoren oder realen Personen.'],
    ['7 · Meldungen', 'Jeder Beitrag lässt sich melden. Gemeldete Inhalte werden zeitnah geprüft; rechtswidrige Inhalte werden entfernt. Beschwerden über eine Entscheidung gehen per Mail an den Betreiber (siehe Impressum).'],
    ['8 · Daten', 'Gespeichert werden Name, Beitrag, Zeitstempel und ein gesalzener Hash deiner IP-Adresse (kein Klartext). Bei Registrierung zusätzlich deine E-Mail. Löschung jederzeit per Mail. Details in der Datenschutzerklärung.']
  ].map(([h, p]) => `<div class="card" style="margin-bottom:14px"><h3 style="font-family:var(--serif);font-size:24px;font-weight:400;margin-bottom:8px">${h}</h3><p style="color:var(--fg-muted);font-size:15px;line-height:1.65">${p}</p></div>`).join('')}
  <a class="btn btn-ghost" style="margin-top:22px" href="/community/">← Zurück zur Community</a>
</div>`;
  return layout({
    title: 'Community-Regeln — MB Capital Strategies',
    desc: 'Die Hausordnung der MB Capital Community: Substanz statt Hype, keine Anlageberatung, kein Spam, klare Moderation.',
    canonical: `${site}/community/regeln`, body, env
  });
}

/* ------------------------------------------------------------------ *
 * Kategorie-Seite
 * ------------------------------------------------------------------ */
export function renderCategory({ cat, threads, env }) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  const canonical = `${site}/community/kategorie/${cat.key}`;
  const list = threads.length ? threads.map(t => `
  <a class="card thread" href="/community/t/${esc(t.slug)}">
    <div class="t-top">${t.official ? '<span class="badge-mb">Marco</span>' : ''}<span>${esc(catLabel(t.category))}</span></div>
    <h3>${esc(t.title)}</h3>${t.intro ? `<p>${esc(t.intro)}</p>` : ''}
    <div class="t-meta"><span>${t.post_count} Beiträge</span><span>Letzter: ${esc(ago(t.last_post_at))}</span></div>
  </a>`).join('') : '<div class="card empty"><div class="display">Noch nichts hier.</div><p>Eröffne das erste Thema in diesem Bereich.</p></div>';

  const body = `
<div class="wrap"><nav class="crumb"><a href="${site}/">Start</a> / <a href="/community/">Community</a> / ${esc(cat.label)}</nav></div>
<section class="t-hero"><div class="wrap">
  <span class="eyebrow">Bereich</span><h1>${esc(cat.label)}</h1>
  <p class="lede">${esc(cat.hint)}</p>
</div></section>
<div class="wrap" style="padding:40px 0 90px">${list}
<a class="btn btn-ghost" style="margin-top:22px" href="/community/">← Alle Bereiche</a></div>`;

  return layout({
    title: `${cat.label} — Community | MB Capital Strategies`,
    desc: `Diskussionen zu ${cat.label}: ${cat.hint}. Community von MB Capital Strategies.`,
    canonical, body, env, noindex: threads.length === 0
  });
}

/* ------------------------------------------------------------------ *
 * Client-JS (Feed, Onboarding, Posten, Turnstile)
 * ------------------------------------------------------------------ */
const CLIENT_JS = String.raw`
(function(){
var API='/api/community', me=null, oldest=null, newest=0, tsWidget=null, busy=false;
var $=function(s){return document.querySelector(s)}, feed=$('#feed'), msgEl=$('#msg');

function msg(t,kind){if(!msgEl)return;msgEl.textContent=t;msgEl.className='msg show '+(kind||'');
  if(kind==='ok')setTimeout(function(){msgEl.className='msg'},4000);}
function api(path,opts){return fetch(API+path,Object.assign({credentials:'same-origin',
  headers:{'content-type':'application/json'}},opts||{})).then(function(r){return r.json().then(function(j){
  if(!r.ok)throw new Error(j.error||('Fehler '+r.status));return j;})});}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ago(ts){var d=Math.floor(Date.now()/1000)-ts;if(d<60)return'gerade eben';
  if(d<3600)return'vor '+Math.floor(d/60)+' Min.';if(d<86400)return'vor '+Math.floor(d/3600)+' Std.';
  return'vor '+Math.floor(d/86400)+' Tg.';}
function body2html(t){var s=esc(t);
  s=s.replace(/\b(https?:\/\/[^\s<]+)/g,function(u){var c=u.replace(/[.,;:)]+$/,'');
    return'<a href="'+c+'" rel="nofollow ugc noopener" target="_blank">'+c.replace(/^https?:\/\//,'').slice(0,48)+'</a>'});
  s=s.replace(/(^|\s)\$([A-Z]{1,6})\b/g,'$1<span class="tick">$$$2</span>');
  return s.replace(/\n/g,'<br>');}

/* --- Turnstile ------------------------------------------------ */
function mountTurnstile(el,cb){
  if(!window.MBC.turnstile){cb('');return;}
  var tick=setInterval(function(){
    if(!window.turnstile)return; clearInterval(tick);
    tsWidget=window.turnstile.render(el,{sitekey:window.MBC.turnstile,theme:'dark',size:'flexible',callback:cb});
  },160);
  setTimeout(function(){clearInterval(tick)},12000);
}

/* --- Onboarding / Compose ------------------------------------- */
function renderGate(){
  var g=$('#gate'); if(!g)return;
  if(me){
    if(window.MBC.locked){g.innerHTML='<div class="gate"><p>Dieses Thema ist geschlossen. Du kannst weiterlesen, aber nicht mehr antworten.</p></div>';return;}
    g.innerHTML=
     '<div class="compose">'+
       '<textarea id="txt" maxlength="2000" placeholder="'+(window.MBC.thread?'Deine Antwort …':'Was beschäftigt dich am Markt?')+'"></textarea>'+
       '<div class="compose-bar">'+
         '<span class="counter" id="cnt">0 / 2000</span>'+
         '<div style="display:flex;gap:10px;align-items:center">'+
           '<span class="counter">'+esc(me.name)+(me.role==='admin'?' · Betreiber':'')+(me.email?'':' · Gast')+'</span>'+
           '<button class="btn btn-solid btn-sm" id="send">Senden</button>'+
         '</div>'+
       '</div>'+
     '</div>'+
     (me.email?'':'<div class="hint" style="margin:-14px 0 24px">Dein Name lebt in einem Cookie auf diesem Gerät. '+
       '<a href="#" id="upgrade">Mit E-Mail sichern</a>, dann bleibt er dir auf jedem Gerät erhalten.</div>');
    var txt=$('#txt'),cnt=$('#cnt');
    txt.addEventListener('input',function(){cnt.textContent=txt.value.length+' / 2000';
      cnt.className='counter'+(txt.value.length>1900?' warn':'')});
    txt.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key==='Enter')send()});
    $('#send').addEventListener('click',send);
    var up=$('#upgrade'); if(up)up.addEventListener('click',function(e){e.preventDefault();showMail()});
  } else {
    g.innerHTML=
     '<div class="gate">'+
       '<span class="eyebrow">Mitreden</span>'+
       '<div class="tabs" style="margin-top:16px">'+
         '<button class="tab" id="tabGuest" aria-selected="true">Als Gast</button>'+
         '<button class="tab" id="tabMail" aria-selected="false">Mit E-Mail</button>'+
       '</div>'+
       '<div id="paneGuest">'+
         '<h3>Name eintragen, loslegen.</h3>'+
         '<p>Kein Passwort, keine E-Mail. Dein Name bleibt auf diesem Gerät gespeichert.</p>'+
         '<div class="field"><input id="nm" maxlength="24" placeholder="Dein Anzeigename" autocomplete="nickname">'+
           '<button class="btn btn-solid" id="go">Loslegen</button></div>'+
         '<div id="ts1" style="margin-top:14px"></div>'+
       '</div>'+
       '<div id="paneMail" hidden>'+
         '<h3>Namen dauerhaft sichern.</h3>'+
         '<p>Du bekommst einen Login-Link per Mail — kein Passwort. Damit bist du auf jedem Gerät derselbe.</p>'+
         '<div class="field"><input id="nm2" maxlength="24" placeholder="Anzeigename" autocomplete="nickname"></div>'+
         '<div class="field"><input id="em" type="email" placeholder="deine@mail.de" autocomplete="email">'+
           '<button class="btn btn-solid" id="go2">Link schicken</button></div>'+
         '<label class="chk"><input type="checkbox" id="nl">'+
           '<span>Schick mir zusätzlich den kostenlosen Wochen-Insider (Frachtraten, Rohstoffe, Dividenden). Abmeldung jederzeit.</span></label>'+
         '<div id="ts2" style="margin-top:14px"></div>'+
       '</div>'+
       '<div class="hint">Mit dem Absenden akzeptierst du die <a href="/community/regeln">Community-Regeln</a>. '+
         'Wir setzen dafür ein technisch notwendiges Cookie — kein Tracking.</div>'+
     '</div>';
    var tg=$('#tabGuest'),tm=$('#tabMail');
    tg.onclick=function(){tg.setAttribute('aria-selected','true');tm.setAttribute('aria-selected','false');
      $('#paneGuest').hidden=false;$('#paneMail').hidden=true;};
    tm.onclick=function(){tm.setAttribute('aria-selected','true');tg.setAttribute('aria-selected','false');
      $('#paneMail').hidden=false;$('#paneGuest').hidden=true;
      if(!tsWidget)mountTurnstile($('#ts2'),function(t){gate.token=t});};
    mountTurnstile($('#ts1'),function(t){gate.token=t});
    $('#go').onclick=join; $('#go2').onclick=joinMail;
    $('#nm').addEventListener('keydown',function(e){if(e.key==='Enter')join()});
  }
}
var gate={token:''};

function showMail(){var tm=$('#tabMail');me=null;renderGate();if($('#tabMail'))$('#tabMail').click();}

function join(){
  var name=($('#nm')||{}).value||'';
  if(name.trim().length<2){msg('Bitte einen Namen mit mindestens 2 Zeichen.','err');return;}
  if(window.MBC.turnstile&&!gate.token){msg('Kurz warten — der Bot-Check läuft noch.','err');return;}
  api('/session',{method:'POST',body:JSON.stringify({name:name,turnstile:gate.token})})
    .then(function(j){me=j.user;renderGate();msg('Willkommen, '+j.user.name+'.','ok');load(true);})
    .catch(function(e){msg(e.message,'err');if(window.turnstile&&tsWidget)window.turnstile.reset(tsWidget);});
}

function joinMail(){
  var name=($('#nm2')||{}).value||'', email=($('#em')||{}).value||'', nl=($('#nl')||{}).checked;
  if(name.trim().length<2){msg('Bitte einen Namen mit mindestens 2 Zeichen.','err');return;}
  if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)){msg('Bitte eine gültige E-Mail-Adresse.','err');return;}
  api('/magic',{method:'POST',body:JSON.stringify({name:name,email:email,newsletter:nl,turnstile:gate.token})})
    .then(function(){msg('Link ist unterwegs. Schau in dein Postfach (auch im Spam-Ordner).','ok');})
    .catch(function(e){msg(e.message,'err')});
}

function send(){
  if(busy)return; var txt=$('#txt'); var v=(txt.value||'').trim();
  if(!v){txt.focus();return;}
  busy=true; $('#send').disabled=true;
  api('/post',{method:'POST',body:JSON.stringify({body:v,thread:window.MBC.thread})})
    .then(function(j){txt.value='';$('#cnt').textContent='0 / 2000';prepend([j.post]);msg('','');msgEl.className='msg';})
    .catch(function(e){msg(e.message,'err')})
    .then(function(){busy=false;$('#send').disabled=false;});
}

/* --- Feed ------------------------------------------------------ */
function postHtml(p){
  return '<article class="post" id="p'+p.id+'">'+
    '<div class="ava'+(p.role==='admin'?' mb':'')+'">'+esc((p.name||'?').slice(0,2))+'</div><div>'+
    '<div class="p-head"><span class="p-name">'+esc(p.name)+'</span>'+
      (p.role==='admin'?'<span class="badge-mb">Betreiber</span>':'')+
      '<time class="p-time" datetime="'+new Date(p.created_at*1000).toISOString()+'">'+ago(p.created_at)+'</time></div>'+
    '<div class="p-body"><p>'+body2html(p.body)+'</p></div>'+
    '<div class="p-act"><button data-report="'+p.id+'">Melden</button>'+
      (p.thread_slug&&!window.MBC.thread?'<a href="/community/t/'+p.thread_slug+'">im Thema '+esc(p.thread_title||'')+'</a>':'')+
    '</div></div></article>';
}
function prepend(list){
  if(!list.length)return;
  var first=feed.querySelector('.post');
  var html=list.map(postHtml).join('');
  if(feed.querySelector('.skel')||feed.querySelector('.empty'))feed.innerHTML='';
  feed.insertAdjacentHTML('afterbegin',html);
  list.forEach(function(p){if(p.id>newest)newest=p.id;});
  var el=feed.querySelector('.post');
  if(el){el.style.background='rgba(212,175,55,.06)';setTimeout(function(){el.style.transition='background 1.2s';el.style.background='transparent'},60);}
}
function load(reset){
  var q='?limit=25'+(window.MBC.thread?'&thread='+encodeURIComponent(window.MBC.thread):'');
  return api('/feed'+q).then(function(j){
    me=j.me||me;
    if(reset||feed.querySelector('.skel')){
      feed.innerHTML=j.posts.length?j.posts.map(postHtml).join(''):
        '<div class="card empty"><div class="display">Noch still hier.</div><p>Mach den Anfang — die erste Nachricht ist immer die schwerste.</p></div>';
    }
    if(j.posts.length){newest=Math.max.apply(null,j.posts.map(function(p){return p.id}));
      oldest=Math.min.apply(null,j.posts.map(function(p){return p.id}));}
    if(j.hasMore)$('#more').hidden=false;
    if(j.active&&j.active.length&&$('#who')){$('#whoPanel').hidden=false;
      $('#who').innerHTML=j.active.map(function(n){return'<span>'+esc(n)+'</span>'}).join('');}
    renderGate();
  }).catch(function(e){msg(e.message,'err')});
}
function poll(){
  if(document.hidden)return;
  var q='?since='+newest+(window.MBC.thread?'&thread='+encodeURIComponent(window.MBC.thread):'');
  api('/feed'+q).then(function(j){
    var fresh=j.posts.filter(function(p){return p.id>newest}).sort(function(a,b){return b.id-a.id});
    if(fresh.length)prepend(fresh);
  }).catch(function(){});
}

/* --- Melden / Ältere laden ------------------------------------ */
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-report]'); if(!b)return;
  var reason=prompt('Warum meldest du diesen Beitrag? (Spam, Beleidigung, Falschinfo …)');
  if(!reason)return;
  api('/report',{method:'POST',body:JSON.stringify({post:Number(b.dataset.report),reason:reason})})
    .then(function(){msg('Danke — der Beitrag ist zur Prüfung gemeldet.','ok')})
    .catch(function(err){msg(err.message,'err')});
});
var moreBtn=$('#more');
if(moreBtn)moreBtn.addEventListener('click',function(){
  var q='?before='+oldest+'&limit=25'+(window.MBC.thread?'&thread='+encodeURIComponent(window.MBC.thread):'');
  api('/feed'+q).then(function(j){
    if(!j.posts.length){moreBtn.hidden=true;return;}
    feed.insertAdjacentHTML('beforeend',j.posts.map(postHtml).join(''));
    oldest=Math.min.apply(null,j.posts.map(function(p){return p.id}));
    if(!j.hasMore)moreBtn.hidden=true;
  });
});

/* --- Thema eröffnen ------------------------------------------- */
var nt=$('#newThread');
if(nt)nt.addEventListener('click',function(){
  if(!me){msg('Trag oben kurz deinen Namen ein — dann kannst du ein Thema eröffnen.','err');
    window.scrollTo({top:0,behavior:'smooth'});return;}
  $('#threadForm').hidden=!$('#threadForm').hidden;});
var tc=$('#tCancel'); if(tc)tc.onclick=function(){$('#threadForm').hidden=true};
var tsb=$('#tSubmit');
if(tsb)tsb.addEventListener('click',function(){
  var t=$('#tTitle').value.trim(), b=$('#tBody').value.trim();
  if(t.length<8){msg('Der Titel braucht mindestens 8 Zeichen.','err');return;}
  if(b.length<20){msg('Schreib zum Start mindestens zwei Sätze.','err');return;}
  tsb.disabled=true;
  api('/thread',{method:'POST',body:JSON.stringify({title:t,intro:$('#tIntro').value.trim(),
    category:$('#tCat').value,body:b})})
    .then(function(j){location.href='/community/t/'+j.thread.slug})
    .catch(function(e){msg(e.message,'err');tsb.disabled=false});
});

/* --- Start ----------------------------------------------------- */
load(true);
setInterval(poll,15000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)poll()});
})();
`;
