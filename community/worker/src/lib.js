/**
 * MB Capital Strategies · Community Worker
 * lib.js — Helfer: Krypto, Cookies, Auth, Rate-Limit, Spam-Filter, Brevo-Mail
 */

export const COOKIE_NAME = 'mbc_uid';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 Jahr
export const POST_MAX_LEN = 2000;
export const NAME_MIN = 2;
export const NAME_MAX = 24;

/* ------------------------------------------------------------------ *
 * Zeit / IDs
 * ------------------------------------------------------------------ */
export const now = () => Math.floor(Date.now() / 1000);
export const uuid = () => crypto.randomUUID();

/* ------------------------------------------------------------------ *
 * Krypto: HMAC-Signatur (Cookie) + SHA-256 (Token/IP)
 * ------------------------------------------------------------------ */
const enc = new TextEncoder();

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function hmac(secret, data) {
  const key = await hmacKey(secret);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export async function sha256(text) {
  return b64url(await crypto.subtle.digest('SHA-256', enc.encode(text)));
}

/** Konstantzeit-Vergleich, damit die Signaturprüfung nicht per Timing angreifbar ist. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** IP niemals im Klartext speichern — nur als gesalzener Hash (DSGVO: Datenminimierung). */
export async function ipHash(env, request) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '0.0.0.0';
  return (await hmac(env.AUTH_SECRET, 'ip:' + ip)).slice(0, 22);
}

/* ------------------------------------------------------------------ *
 * Cookie: <uid>.<exp>.<sig>   HttpOnly, Secure, SameSite=Lax
 * Rechtlich: technisch erforderlich für die Anmeldefunktion
 * (§ 25 Abs. 2 Nr. 2 TDDDG) — daher ohne Consent-Banner zulässig.
 * ------------------------------------------------------------------ */
export async function signCookie(env, uid) {
  const exp = now() + COOKIE_MAX_AGE;
  const payload = `${uid}.${exp}`;
  return `${payload}.${await hmac(env.AUTH_SECRET, payload)}`;
}

export async function readCookie(env, request) {
  const raw = request.headers.get('Cookie') || '';
  const m = raw.match(new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([^;]+)'));
  if (!m) return null;
  const parts = decodeURIComponent(m[1]).split('.');
  if (parts.length !== 3) return null;
  const [uid, exp, sig] = parts;
  if (!/^[0-9a-f-]{36}$|^mb-[a-z0-9-]+$/.test(uid)) return null;
  if (Number(exp) < now()) return null;
  const expect = await hmac(env.AUTH_SECRET, `${uid}.${exp}`);
  return safeEqual(sig, expect) ? uid : null;
}

export function cookieHeader(env, value, maxAge = COOKIE_MAX_AGE, request = null) {
  // Domain nur setzen, wenn der aufrufende Host auch wirklich darunter liegt.
  // Sonst verwirft der Browser das Cookie kommentarlos — genau das passiert
  // auf der workers.dev-Vorschau, wenn COOKIE_DOMAIN auf die Hauptdomain zeigt.
  let domain = '';
  if (env.COOKIE_DOMAIN) {
    const base = env.COOKIE_DOMAIN.replace(/^\./, '');
    const host = request ? new URL(request.url).hostname : '';
    if (host === base || host.endsWith('.' + base)) domain = `; Domain=${env.COOKIE_DOMAIN}`;
  }
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax${domain}`;
}

/* ------------------------------------------------------------------ *
 * Turnstile (unsichtbares Captcha, kostenlos)
 * ------------------------------------------------------------------ */
export async function verifyTurnstile(env, token, request) {
  // Kein Key und kein Secret = Turnstile ist bewusst nicht eingerichtet (Vorschau,
  // lokale Entwicklung) -> durchlassen.
  if (!env.TURNSTILE_SECRET && !env.TURNSTILE_SITEKEY) return true;
  // Sitekey gesetzt, Secret vergessen: NICHT stillschweigend durchwinken.
  // Sonst sieht die Seite geschuetzt aus, ist es aber nicht.
  if (!env.TURNSTILE_SECRET) {
    console.error('turnstile-misconfig: SITEKEY gesetzt, SECRET fehlt');
    return false;
  }
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = await r.json();
    return j.success === true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * Eingabe-Hygiene
 * ------------------------------------------------------------------ */
export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function slugify(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

export function cleanName(raw) {
  const name = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
  if (name.length < NAME_MIN) return null;
  // Keine Steuerzeichen, keine Zero-Width-Tricks, keine Impersonation von Marco/Admin
  if (/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202f\ufeff]/.test(name)) return null;
  if (/^(marco|admin|mod|moderator|mb.?capital|support|system)$/i.test(name.replace(/[\s_.-]/g, ''))) return null;
  return name;
}

// Wortfilter: bewusst knapp gehalten (Beleidigung/Spam-Klassiker). Erweiterbar per env.WORDFILTER.
const BASE_BADWORDS = [
  'arschloch', 'wichser', 'hurensohn', 'fotze', 'missgeburt', 'schwuchtel', 'neger',
  'nutte', 'spast', 'behindert', 'verrecke', 'nazi-schwein',
  'viagra', 'casino-bonus', 'porn', 'sexcam', 'crypto-doubler', 'binary options',
  'pump and dump', 'garantierte rendite', 'garantierter gewinn', '100% gewinn', 'kein risiko garantie'
];

export function spamCheck(body, user, env) {
  const text = String(body || '').trim();
  if (!text) return { ok: false, error: 'Nachricht ist leer.' };
  if (text.length > POST_MAX_LEN) return { ok: false, error: `Maximal ${POST_MAX_LEN} Zeichen.` };

  const lower = text.toLowerCase();
  const extra = (env.WORDFILTER || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
  for (const w of [...BASE_BADWORDS, ...extra]) {
    if (lower.includes(w)) return { ok: false, error: 'Deine Nachricht enthält unerwünschte Inhalte.' };
  }
  // CAPS-Schreien
  const letters = text.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
  if (letters.length > 25 && letters === letters.toUpperCase()) {
    return { ok: false, error: 'Bitte nicht komplett in Großbuchstaben schreiben.' };
  }
  // Links erst ab 3 Beiträgen — der wirksamste Spam-Schutz überhaupt
  const links = (lower.match(/https?:\/\/|www\.|t\.me\/|wa\.me\//g) || []).length;
  if (links > 0 && (user?.post_count || 0) < 3) {
    return { ok: false, error: 'Links sind erst ab dem 3. Beitrag möglich (Spamschutz).' };
  }
  if (links > 2) return { ok: false, error: 'Maximal 2 Links pro Beitrag.' };
  // Wiederholte Zeichen (aaaaaaa / !!!!!!!)
  if (/(.)\1{9,}/.test(text)) return { ok: false, error: 'Bitte keine Zeichenwiederholungen.' };
  return { ok: true, text };
}

/* ------------------------------------------------------------------ *
 * Rate-Limit: 5 Beiträge / Stunde + 15 s Mindestabstand
 * ------------------------------------------------------------------ */
export async function rateLimit(env, userId) {
  const perHour = Number(env.RATE_PER_HOUR || 5);
  const cooldown = Number(env.RATE_COOLDOWN || 15);
  const t = now();
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS c, COALESCE(MAX(created_at),0) AS last
       FROM posts WHERE user_id = ?1 AND created_at > ?2`
  ).bind(userId, t - 3600).first();

  if (row && t - row.last < cooldown) {
    return { ok: false, error: `Bitte kurz warten (${cooldown - (t - row.last)} s).`, retryAfter: cooldown - (t - row.last) };
  }
  if (row && row.c >= perHour) {
    return { ok: false, error: `Limit erreicht: ${perHour} Beiträge pro Stunde.`, retryAfter: 600 };
  }
  return { ok: true };
}

/* ------------------------------------------------------------------ *
 * Brevo: Magic-Link-Mail + optionaler Newsletter-Kontakt
 * ------------------------------------------------------------------ */
export async function sendMagicLink(env, email, link, name) {
  if (!env.BREVO_API_KEY) throw new Error('BREVO_API_KEY fehlt');
  const html = magicMailHtml(link, name, env);
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'MB Capital Strategies', email: env.MAIL_FROM || 'noreply@mbcapitalstrategies.com' },
      to: [{ email, name: name || undefined }],
      subject: 'Dein Login-Link für die MB Capital Community',
      htmlContent: html,
      textContent: `Hallo ${name || ''},\n\ndein Login-Link für die MB Capital Community:\n${link}\n\nDer Link ist 30 Minuten gültig und funktioniert genau einmal.\nWenn du das nicht angefordert hast, ignoriere diese Mail einfach.\n\nMB Capital Strategies`
    })
  });
  if (!r.ok) throw new Error('Brevo ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

/** Double-Opt-in-Kontakt in Brevo anlegen (nur wenn der Nutzer die Checkbox gesetzt hat). */
export async function brevoSubscribe(env, email, name) {
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) return;
  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        email,
        attributes: { VORNAME: name || '', QUELLE: 'Community' },
        listIds: [Number(env.BREVO_LIST_ID)],
        updateEnabled: true
      })
    });
  } catch { /* Newsletter-Eintrag darf den Login nie blockieren */ }
}

function magicMailHtml(link, name, env) {
  const site = env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
  return `<!doctype html><html lang="de"><body style="margin:0;padding:0;background:#0c0b09;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c0b09;padding:40px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#151310;border:1px solid rgba(212,175,55,.22);border-radius:2px">
<tr><td style="padding:36px 36px 8px">
<div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#d4af37">MB Capital Strategies</div>
<h1 style="margin:18px 0 0;font-size:26px;line-height:1.2;color:#f1ecdf;font-weight:400">Dein Login-Link</h1>
</td></tr>
<tr><td style="padding:14px 36px 0;color:#a39885;font-size:15px;line-height:1.6">
Hallo ${esc(name || '')}, klick auf den Button, um dich in der Community anzumelden. Der Link ist <strong style="color:#f1ecdf">30 Minuten</strong> gültig und funktioniert genau einmal.
</td></tr>
<tr><td style="padding:28px 36px">
<a href="${esc(link)}" style="display:inline-block;padding:15px 28px;background:#d4af37;color:#0c0b09;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;text-decoration:none">Jetzt anmelden</a>
</td></tr>
<tr><td style="padding:0 36px 32px;color:#746b5d;font-size:12px;line-height:1.6">
Funktioniert der Button nicht? Dann kopier diese Adresse in deinen Browser:<br>
<span style="color:#a39885;word-break:break-all">${esc(link)}</span><br><br>
Du hast das nicht angefordert? Dann ignorier diese Mail — ohne Klick passiert nichts.
</td></tr>
<tr><td style="padding:18px 36px;border-top:1px solid rgba(212,175,55,.14);color:#746b5d;font-size:11px">
<a href="${site}" style="color:#d4af37;text-decoration:none">mbcapitalstrategies.com</a> ·
<a href="${site}/impressum.html" style="color:#746b5d;text-decoration:none">Impressum</a> ·
<a href="${site}/datenschutz.html" style="color:#746b5d;text-decoration:none">Datenschutz</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

/* ------------------------------------------------------------------ *
 * Antworten
 * ------------------------------------------------------------------ */
export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...(init.headers || {})
    }
  });
}

export const bad = (msg, status = 400, extra = {}) => json({ ok: false, error: msg, ...extra }, { status });

export function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      ...(init.headers || {})
    }
  });
}

/** Zeitangabe wie "vor 3 Min." */
export function ago(ts) {
  const d = now() - ts;
  if (d < 60) return 'gerade eben';
  if (d < 3600) return `vor ${Math.floor(d / 60)} Min.`;
  if (d < 86400) return `vor ${Math.floor(d / 3600)} Std.`;
  if (d < 2592000) return `vor ${Math.floor(d / 86400)} Tg.`;
  return new Date(ts * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Beitragstext -> sicheres HTML (Escapen zuerst, dann Links/Ticker/Absätze). */
export function renderBody(text) {
  let s = esc(text);
  s = s.replace(/\b(https?:\/\/[^\s<]+)/g, u => {
    const clean = u.replace(/[.,;:)]+$/, '');
    const label = clean.replace(/^https?:\/\//, '').slice(0, 48);
    return `<a href="${clean}" rel="nofollow ugc noopener" target="_blank">${label}</a>`;
  });
  s = s.replace(/(^|\s)\$([A-Z]{1,6})\b/g, '$1<span class="tick">$$$2</span>');
  return s.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
}

/* ------------------------------------------------------------------ *
 * Bild-Anhänge
 * ------------------------------------------------------------------ */
export const IMG_MAX_BYTES = 3 * 1024 * 1024;   // 3 MB
export const IMG_MAX_PER_DAY = 5;

/**
 * Dateityp am Inhalt erkennen, nicht am gemeldeten MIME-Typ.
 * Ein Angreifer kann "image/png" behaupten und HTML schicken — der Browser
 * würde es beim Ausliefern als HTML interpretieren (XSS über die eigene Domain).
 * Deshalb: nur was die Magic Bytes bestätigen, wird gespeichert.
 */
export function sniffImage(buf) {
  const b = new Uint8Array(buf);
  if (b.length < 12) return null;
  const is = (off, ...sig) => sig.every((v, i) => b[off + i] === v);

  if (is(0, 0xff, 0xd8, 0xff)) return { mime: 'image/jpeg', ext: 'jpg' };
  if (is(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { mime: 'image/png', ext: 'png' };
  if (is(0, 0x47, 0x49, 0x46, 0x38) && (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61)
    return { mime: 'image/gif', ext: 'gif' };
  if (is(0, 0x52, 0x49, 0x46, 0x46) && is(8, 0x57, 0x45, 0x42, 0x50))
    return { mime: 'image/webp', ext: 'webp' };
  return null;
}

/**
 * EXIF aus JPEG entfernen. Handy-Fotos tragen dort GPS-Koordinaten,
 * Aufnahmezeit und Gerätenamen — das gehört nicht in eine öffentliche
 * Community, und niemand rechnet damit.
 * Entfernt APP1–APP15 (EXIF, XMP, IPTC) und Kommentare; JFIF (APP0) bleibt.
 */
export function stripJpegMetadata(buf) {
  const b = new Uint8Array(buf);
  if (!(b[0] === 0xff && b[1] === 0xd8)) return buf;
  const out = [0xff, 0xd8];
  let i = 2;
  while (i < b.length - 1) {
    if (b[i] !== 0xff) break;                       // kaputte Struktur -> Original behalten
    const marker = b[i + 1];
    if (marker === 0xd9) { out.push(0xff, 0xd9); i += 2; break; }
    if (marker === 0xda) {                          // Bilddaten: Rest 1:1 übernehmen
      for (let k = i; k < b.length; k++) out.push(b[k]);
      i = b.length; break;
    }
    const len = (b[i + 2] << 8) | b[i + 3];
    if (len < 2 || i + 2 + len > b.length) break;
    const drop = (marker >= 0xe1 && marker <= 0xef) || marker === 0xfe; // APPn>0 + COM
    if (!drop) for (let k = i; k < i + 2 + len; k++) out.push(b[k]);
    i += 2 + len;
  }
  return i >= b.length || out.length > 4 ? new Uint8Array(out).buffer : buf;
}

/** Zufälliger, nicht erratbarer Schlüssel. */
export function imageKey(ext) {
  const r = new Uint8Array(16);
  crypto.getRandomValues(r);
  return [...r].map(x => x.toString(16).padStart(2, '0')).join('') + '.' + ext;
}
