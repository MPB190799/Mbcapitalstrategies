/**
 * MB Capital Strategies · Community Worker
 * index.js — Router, API, Moderation, Sitemap
 *
 * Routen
 *   GET  /community/                      Hub (SSR)
 *   GET  /community/t/<slug>              Thread (SSR + DiscussionForumPosting)
 *   GET  /community/kategorie/<key>       Kategorie (SSR)
 *   GET  /community/regeln                Hausordnung
 *   GET  /community/login?token=          Magic-Link einlösen
 *   GET  /community/sitemap.xml           Sitemap der Threads
 *   POST /api/community/session           Gast anmelden
 *   POST /api/community/magic             Magic-Link anfordern
 *   GET  /api/community/feed              Beiträge laden
 *   POST /api/community/post              Beitrag senden
 *   POST /api/community/thread            Thema eröffnen
 *   POST /api/community/report            Beitrag melden
 *   GET  /api/community/me                Aktueller Nutzer
 *   *    /api/community/admin/*           Moderation (Bearer ADMIN_TOKEN)
 */

import {
  now, uuid, json, bad, html, cleanName, slugify, spamCheck, rateLimit,
  signCookie, readCookie, cookieHeader, verifyTurnstile, ipHash, sha256,
  sendMagicLink, brevoSubscribe, esc, COOKIE_NAME,
  sniffImage, stripJpegMetadata, imageKey, IMG_MAX_BYTES, IMG_MAX_PER_DAY
} from './lib.js';
import { renderHub, renderThread, renderRules, renderCategory, CATEGORIES } from './render.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname.replace(/\/{2,}/g, '/');

    try {
      // ---------- API ----------
      if (p.startsWith('/api/community/')) {
        const r = await api(p.slice('/api/community/'.length), request, env, url, ctx);
        return withCors(r, request, env);
      }

      // ---------- Seiten ----------
      if (p === '/community' ) return Response.redirect(origin(env) + '/community/', 301);
      if (p === '/community/') return pageHub(request, env);
      if (p === '/community/regeln') return html(renderRules(env), { headers: cacheHdr(600) });
      if (p === '/community/admin') return html(ADMIN_HTML, { headers: { 'x-robots-tag': 'noindex, nofollow' } });
      if (p === '/community/sitemap.xml') return sitemap(env);
      if (p.startsWith('/community/img/')) return serveImage(env, p.slice(15), ctx);
      if (p === '/community/login') return magicLogin(request, env, url);
      if (p.startsWith('/community/t/')) return pageThread(request, env, decodeURIComponent(p.slice(13)));
      if (p.startsWith('/community/kategorie/')) return pageCategory(request, env, p.slice(21));

      return new Response('Not found', { status: 404 });
    } catch (err) {
      console.error('worker-error', err && err.stack || err);
      if (p.startsWith('/api/')) return bad('Serverfehler. Bitte später erneut versuchen.', 500);
      return html(`<!doctype html><meta charset="utf-8"><title>Fehler</title>
        <body style="background:#0c0b09;color:#f1ecdf;font-family:system-ui;padding:60px;text-align:center">
        <h1 style="font-weight:400">Da ist etwas schiefgegangen.</h1>
        <p style="color:#a39885">Versuch es gleich noch einmal — <a style="color:#d4af37" href="/community/">zurück zur Community</a>.</p>`,
        { status: 500 });
    }
  },

  /** Nächtlicher Aufräum-Job (cron in wrangler.toml). */
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      const t = now();
      await env.DB.prepare('DELETE FROM magic_links WHERE expires_at < ?1').bind(t - 86400).run();
      // Gast-Konten ohne einen einzigen Beitrag nach 60 Tagen entfernen (Datenminimierung)
      await env.DB.prepare(
        `DELETE FROM users WHERE post_count = 0 AND email IS NULL AND role='guest' AND created_at < ?1`
      ).bind(t - 86400 * 60).run();
      // Hochgeladene Bilder, die nach 24 h an keinem Beitrag hängen: löschen.
      // Sonst sammelt sich Speicher an, den niemand je sieht.
      if (env.IMG) {
        const orphans = await env.DB.prepare(
          'SELECT key FROM uploads WHERE post_id IS NULL AND created_at < ?1 LIMIT 200'
        ).bind(t - 86400).all();
        for (const o of (orphans.results || [])) {
          await env.IMG.delete(o.key);
          await env.DB.prepare('DELETE FROM uploads WHERE key=?1').bind(o.key).run();
        }
      }
    })());
  }
};

const origin = env => env.SITE_ORIGIN || 'https://mbcapitalstrategies.com';
const cacheHdr = s => ({ 'cache-control': `public, max-age=0, s-maxage=${s}, stale-while-revalidate=120` });

function withCors(res, request, env) {
  // Gleiche Origin im Normalbetrieb; für Tests von workers.dev erlaubt.
  const o = request.headers.get('Origin');
  if (o && (o === origin(env) || /\.workers\.dev$/.test(new URL(o).hostname))) {
    res.headers.set('access-control-allow-origin', o);
    res.headers.set('access-control-allow-credentials', 'true');
    res.headers.set('vary', 'Origin');
  }
  return res;
}

/* ================================================================== *
 * Nutzer laden / anlegen
 * ================================================================== */
async function currentUser(request, env) {
  const uid = await readCookie(env, request);
  if (!uid) return null;
  const u = await env.DB.prepare(
    'SELECT id,name,email,role,post_count,banned_until,ban_reason FROM users WHERE id=?1'
  ).bind(uid).first();
  return u || null;
}

function isBanned(u) {
  return u && u.banned_until > now();
}

/* ================================================================== *
 * Seiten
 * ================================================================== */
async function pageHub(request, env) {
  const [threads, stats] = await Promise.all([
    env.DB.prepare(`
      SELECT t.*, u.name AS author_name FROM threads t
      JOIN users u ON u.id = t.author_id
      WHERE t.hidden = 0
      ORDER BY t.pinned DESC, t.last_post_at DESC LIMIT 30`).all(),
    env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM posts   WHERE hidden=0)                       AS posts,
        (SELECT COUNT(*) FROM users   WHERE post_count > 0)                 AS users,
        (SELECT COUNT(*) FROM threads WHERE hidden=0)                       AS threads,
        (SELECT COUNT(*) FROM posts   WHERE hidden=0 AND created_at > ?1)   AS today`)
      .bind(now() - 86400).first()
  ]);

  return html(renderHub({
    threads: threads.results || [],
    stats: stats || { posts: 0, users: 0, threads: 0, today: 0 },
    env,
    turnstileKey: env.TURNSTILE_SITEKEY || null
  }), { headers: cacheHdr(60) });
}

async function pageThread(request, env, slug) {
  const thread = await env.DB.prepare(
    'SELECT * FROM threads WHERE slug=?1 AND hidden=0'
  ).bind(slug).first();
  if (!thread) return notFound(env);

  const posts = await env.DB.prepare(`
    SELECT p.id,p.body,p.created_at,p.image_key,u.name,u.role FROM posts p
    JOIN users u ON u.id=p.user_id
    WHERE p.thread_id=?1 AND p.hidden=0
    ORDER BY p.id ASC LIMIT 200`).bind(thread.id).all();

  return html(renderThread({
    thread, posts: posts.results || [], env, turnstileKey: env.TURNSTILE_SITEKEY || null
  }), { headers: cacheHdr(120) });
}

async function pageCategory(request, env, key) {
  const cat = CATEGORIES.find(c => c.key === key);
  if (!cat) return notFound(env);
  const threads = await env.DB.prepare(`
    SELECT * FROM threads WHERE category=?1 AND hidden=0
    ORDER BY pinned DESC, last_post_at DESC LIMIT 50`).bind(key).all();
  return html(renderCategory({ cat, threads: threads.results || [], env }), { headers: cacheHdr(300) });
}

function notFound(env) {
  return html(`<!doctype html><meta charset="utf-8"><title>Nicht gefunden</title>
    <body style="background:#0c0b09;color:#f1ecdf;font-family:system-ui;padding:70px;text-align:center">
    <h1 style="font-weight:400;font-size:38px">Dieses Thema gibt es nicht (mehr).</h1>
    <p style="color:#a39885">Vielleicht wurde es entfernt. <a style="color:#d4af37" href="/community/">Zur Community</a></p>`,
    { status: 404 });
}

/* ================================================================== *
 * Sitemap
 * ================================================================== */
async function sitemap(env) {
  const site = origin(env);
  const rows = await env.DB.prepare(`
    SELECT slug,last_post_at FROM threads
    WHERE hidden=0 AND post_count >= 2
    ORDER BY last_post_at DESC LIMIT 2000`).all();
  const iso = ts => new Date(ts * 1000).toISOString();
  const urls = [
    `<url><loc>${site}/community/</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${site}/community/regeln</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
    ...CATEGORIES.map(c => `<url><loc>${site}/community/kategorie/${c.key}</loc><changefreq>daily</changefreq><priority>0.5</priority></url>`),
    ...(rows.results || []).map(t =>
      `<url><loc>${site}/community/t/${esc(t.slug)}</loc><lastmod>${iso(t.last_post_at)}</lastmod><changefreq>daily</changefreq><priority>0.6</priority></url>`)
  ].join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'content-type': 'application/xml; charset=utf-8', ...cacheHdr(900) }
  });
}

/* ================================================================== *
 * Magic-Link einlösen
 * ================================================================== */
async function magicLogin(request, env, url) {
  const token = url.searchParams.get('token') || '';
  const site = origin(env);
  const fail = (t, m) => html(`<!doctype html><meta charset="utf-8"><title>${t}</title>
    <body style="background:#0c0b09;color:#f1ecdf;font-family:system-ui;padding:70px;text-align:center">
    <h1 style="font-weight:400;font-size:34px">${t}</h1><p style="color:#a39885">${m}</p>
    <p><a style="color:#d4af37" href="/community/">Zur Community</a></p>`, { status: 400 });

  if (!token) return fail('Link unvollständig', 'Der Login-Link ist nicht vollständig.');
  const th = await sha256(token);
  const row = await env.DB.prepare('SELECT * FROM magic_links WHERE token_hash=?1').bind(th).first();
  if (!row) return fail('Link ungültig', 'Dieser Link existiert nicht.');
  if (row.used_at) return fail('Link bereits benutzt', 'Jeder Login-Link funktioniert genau einmal. Fordere einen neuen an.');
  if (row.expires_at < now()) return fail('Link abgelaufen', 'Der Link war 30 Minuten gültig. Fordere einen neuen an.');

  // Nutzer finden oder anlegen
  let user = await env.DB.prepare('SELECT * FROM users WHERE email_key=?1').bind(row.email_key).first();
  const t = now();

  if (!user && row.user_id) {
    // Gast-Konto auf E-Mail upgraden
    const guest = await env.DB.prepare('SELECT * FROM users WHERE id=?1').bind(row.user_id).first();
    if (guest && !guest.email) {
      await env.DB.prepare('UPDATE users SET email=?1,email_key=?2,role=?3,newsletter=?4,last_seen_at=?5 WHERE id=?6')
        .bind(row.email_key, row.email_key, 'member', row.newsletter, t, guest.id).run();
      user = { ...guest, email: row.email_key, role: 'member' };
    }
  }
  if (!user) {
    const name = await uniqueName(env, row.name || 'Gast');
    const id = uuid();
    await env.DB.prepare(`INSERT INTO users (id,name,name_key,email,email_key,role,newsletter,created_at,last_seen_at)
      VALUES (?1,?2,?3,?4,?5,'member',?6,?7,?7)`)
      .bind(id, name, name.toLowerCase(), row.email_key, row.email_key, row.newsletter, t).run();
    user = { id, name };
  }

  await env.DB.prepare('UPDATE magic_links SET used_at=?1 WHERE token_hash=?2').bind(t, th).run();
  if (row.newsletter) await brevoSubscribe(env, row.email_key, user.name);

  const cookie = await signCookie(env, user.id);
  return new Response(null, {
    status: 302,
    headers: { location: '/community/?willkommen=1', 'set-cookie': cookieHeader(env, cookie, undefined, request) }
  });
}

async function uniqueName(env, wanted) {
  let base = cleanName(wanted) || 'Gast';
  let name = base, i = 1;
  while (await env.DB.prepare('SELECT 1 FROM users WHERE name_key=?1').bind(name.toLowerCase()).first()) {
    i++; name = `${base} ${i}`;
    if (i > 99) { name = `${base} ${Math.floor(Math.random() * 9999)}`; break; }
  }
  return name;
}

/* ================================================================== *
 * API
 * ================================================================== */
async function api(route, request, env, url, ctx) {
  const method = request.method;
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type,authorization' }
    });
  }
  if (route.startsWith('admin/')) return admin(route.slice(6), request, env, url);

  const user = await currentUser(request, env);

  /* ---------- GET /me ---------- */
  if (route === 'me' && method === 'GET') {
    return json({ ok: true, me: publicUser(user) });
  }

  /* ---------- GET /feed ---------- */
  if (route === 'feed' && method === 'GET') {
    const threadId = url.searchParams.get('thread');
    const since = Number(url.searchParams.get('since') || 0);
    const before = Number(url.searchParams.get('before') || 0);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 25)));

    const where = ['p.hidden = 0'];
    const binds = [];
    if (threadId) { where.push(`p.thread_id = ?${binds.push(threadId)}`); }
    else { where.push('p.thread_id IS NULL'); }
    if (since) where.push(`p.id > ?${binds.push(since)}`);
    if (before) where.push(`p.id < ?${binds.push(before)}`);

    const rows = await env.DB.prepare(`
      SELECT p.id,p.body,p.created_at,p.thread_id,p.image_key,u.name,u.role,
             t.slug AS thread_slug, t.title AS thread_title
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN threads t ON t.id = p.thread_id
       WHERE ${where.join(' AND ')}
       ORDER BY p.id ${threadId ? 'ASC' : 'DESC'} LIMIT ${limit + 1}`)
      .bind(...binds).all();

    const list = rows.results || [];
    const hasMore = list.length > limit;
    if (hasMore) list.length = limit;

    let active = [];
    if (!since && !before) {
      const a = await env.DB.prepare(`
        SELECT DISTINCT u.name FROM posts p JOIN users u ON u.id=p.user_id
         WHERE p.created_at > ?1 AND p.hidden=0 ORDER BY p.id DESC LIMIT 12`)
        .bind(now() - 86400 * 3).all();
      active = (a.results || []).map(r => r.name);
    }
    return json({ ok: true, posts: list, hasMore, me: publicUser(user), active });
  }

  /* ---------- POST /session (Gast) ---------- */
  if (route === 'session' && method === 'POST') {
    const b = await body(request);
    const name = cleanName(b.name);
    if (!name) return bad('Bitte einen Namen zwischen 2 und 24 Zeichen wählen (und nicht "Marco" oder "Admin").');
    if (!(await verifyTurnstile(env, b.turnstile, request))) return bad('Bot-Check fehlgeschlagen. Lade die Seite neu.');

    if (user) { // Nur umbenennen
      if (name.toLowerCase() !== user.name.toLowerCase()) {
        const taken = await env.DB.prepare('SELECT 1 FROM users WHERE name_key=?1 AND id<>?2').bind(name.toLowerCase(), user.id).first();
        if (taken) return bad('Dieser Name ist schon vergeben.');
        await env.DB.prepare('UPDATE users SET name=?1,name_key=?2,last_seen_at=?3 WHERE id=?4')
          .bind(name, name.toLowerCase(), now(), user.id).run();
      }
      return json({ ok: true, user: { ...publicUser(user), name } });
    }

    const taken = await env.DB.prepare('SELECT 1 FROM users WHERE name_key=?1').bind(name.toLowerCase()).first();
    if (taken) return bad('Dieser Name ist schon vergeben — nimm eine Variante.');

    const id = uuid(), t = now(), ih = await ipHash(env, request);
    // Bot-Schwemme aus einer IP begrenzen
    const fromIp = await env.DB.prepare('SELECT COUNT(*) AS c FROM users WHERE ip_hash=?1 AND created_at>?2')
      .bind(ih, t - 86400).first();
    if (fromIp && fromIp.c >= Number(env.MAX_NEW_PER_IP || 8)) return bad('Von diesem Anschluss wurden heute schon mehrere Namen angelegt. Versuch es morgen wieder — oder sichere deinen Namen per E-Mail.');

    await env.DB.prepare(`INSERT INTO users (id,name,name_key,role,created_at,last_seen_at,ip_hash)
      VALUES (?1,?2,?3,'guest',?4,?4,?5)`).bind(id, name, name.toLowerCase(), t, ih).run();

    const cookie = await signCookie(env, id);
    return json({ ok: true, user: { id, name, role: 'guest', email: null } },
      { headers: { 'set-cookie': cookieHeader(env, cookie, undefined, request) } });
  }

  /* ---------- POST /magic ---------- */
  if (route === 'magic' && method === 'POST') {
    const b = await body(request);
    const email = String(b.email || '').trim().toLowerCase();
    const name = cleanName(b.name);
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return bad('Bitte eine gültige E-Mail-Adresse.');
    if (!name) return bad('Bitte einen Namen zwischen 2 und 24 Zeichen wählen.');
    if (!(await verifyTurnstile(env, b.turnstile, request))) return bad('Bot-Check fehlgeschlagen. Lade die Seite neu.');

    // Missbrauchsschutz: max. 3 Links je Adresse pro Stunde
    const recent = await env.DB.prepare('SELECT COUNT(*) AS c FROM magic_links WHERE email_key=?1 AND created_at>?2')
      .bind(email, now() - 3600).first();
    if (recent && recent.c >= 3) return bad('Es wurden bereits mehrere Links verschickt. Schau in dein Postfach.');

    const token = uuid().replace(/-/g, '') + uuid().replace(/-/g, '');
    const th = await sha256(token);
    await env.DB.prepare(`INSERT INTO magic_links (token_hash,email_key,user_id,name,newsletter,created_at,expires_at)
      VALUES (?1,?2,?3,?4,?5,?6,?7)`)
      .bind(th, email, user?.id || null, name, b.newsletter ? 1 : 0, now(), now() + 1800).run();

    const link = `${origin(env)}/community/login?token=${token}`;
    try {
      await sendMagicLink(env, email, link, name);
    } catch (e) {
      console.error('mail-fail', e.message);
      return bad('Die Mail konnte gerade nicht verschickt werden. Versuch es in ein paar Minuten erneut.', 502);
    }
    return json({ ok: true });
  }

  /* ---------- POST /post ---------- */
  if (route === 'post' && method === 'POST') {
    if (!user) return bad('Bitte zuerst einen Namen wählen.', 401);
    if (isBanned(user)) return bad('Du kannst derzeit nicht schreiben.' + (user.ban_reason ? ' Grund: ' + user.ban_reason : ''), 403);

    const b = await body(request);
    const check = spamCheck(b.body, user, env);
    if (!check.ok) return bad(check.error);

    const rl = await rateLimit(env, user.id);
    if (!rl.ok) return bad(rl.error, 429, { retryAfter: rl.retryAfter });

    let threadId = b.thread || null;
    let thread = null;
    if (threadId) {
      thread = await env.DB.prepare('SELECT id,slug,locked,hidden FROM threads WHERE id=?1').bind(threadId).first();
      if (!thread || thread.hidden) return bad('Dieses Thema gibt es nicht.', 404);
      if (thread.locked) return bad('Dieses Thema ist geschlossen.', 403);
    }

    // Bild nur annehmen, wenn es diesem Nutzer gehört und noch frei ist.
    let imgKey = null;
    if (b.image) {
      const up = await env.DB.prepare(
        'SELECT key,user_id,post_id FROM uploads WHERE key=?1'
      ).bind(String(b.image)).first();
      if (!up || up.user_id !== user.id) return bad('Das Bild wurde nicht gefunden.');
      if (up.post_id) return bad('Dieses Bild hängt schon an einem Beitrag.');
      imgKey = up.key;
    }

    const t = now(), ih = await ipHash(env, request);
    const res = await env.DB.prepare(
      'INSERT INTO posts (thread_id,user_id,body,created_at,ip_hash,image_key) VALUES (?1,?2,?3,?4,?5,?6)'
    ).bind(threadId, user.id, check.text, t, ih, imgKey).run();

    const id = res.meta.last_row_id;
    if (imgKey) {
      await env.DB.prepare('UPDATE uploads SET post_id=?1 WHERE key=?2').bind(id, imgKey).run();
    }
    await env.DB.batch([
      env.DB.prepare('UPDATE users SET post_count=post_count+1,last_seen_at=?1 WHERE id=?2').bind(t, user.id),
      ...(threadId ? [env.DB.prepare('UPDATE threads SET post_count=post_count+1,last_post_at=?1 WHERE id=?2').bind(t, threadId)] : [])
    ]);

    return json({
      ok: true,
      post: { id, body: check.text, created_at: t, name: user.name, role: user.role, thread_id: threadId, image_key: imgKey }
    });
  }

  /* ---------- POST /thread ---------- */
  if (route === 'thread' && method === 'POST') {
    if (!user) return bad('Bitte zuerst einen Namen wählen.', 401);
    if (isBanned(user)) return bad('Du kannst derzeit nicht schreiben.', 403);

    const b = await body(request);
    const title = String(b.title || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
    if (title.length < 8 || title.length > 90) return bad('Der Titel braucht 8–90 Zeichen.');
    const check = spamCheck(b.body, user, env);
    if (!check.ok) return bad(check.error);
    if (check.text.length < 20) return bad('Schreib zum Start mindestens zwei Sätze.');

    const cat = CATEGORIES.find(c => c.key === b.category) ? b.category : 'allgemein';

    // Themen-Limit: 3 neue Themen pro Tag und Nutzer
    const mine = await env.DB.prepare('SELECT COUNT(*) AS c FROM threads WHERE author_id=?1 AND created_at>?2')
      .bind(user.id, now() - 86400).first();
    if (mine && mine.c >= 3) return bad('Maximal 3 neue Themen pro Tag.');

    let slug = slugify(title) || 'thema';
    if (await env.DB.prepare('SELECT 1 FROM threads WHERE slug=?1').bind(slug).first()) {
      slug = `${slug}-${Math.floor(Math.random() * 900 + 100)}`;
    }

    const id = uuid(), t = now(), ih = await ipHash(env, request);
    await env.DB.prepare(`INSERT INTO threads (id,slug,title,intro,category,author_id,created_at,last_post_at,post_count,official)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?7,1,?8)`)
      .bind(id, slug, title, String(b.intro || '').slice(0, 180) || null, cat, user.id, t, user.role === 'admin' ? 1 : 0).run();
    await env.DB.prepare('INSERT INTO posts (thread_id,user_id,body,created_at,ip_hash) VALUES (?1,?2,?3,?4,?5)')
      .bind(id, user.id, check.text, t, ih).run();
    await env.DB.prepare('UPDATE users SET post_count=post_count+1,last_seen_at=?1 WHERE id=?2').bind(t, user.id).run();

    return json({ ok: true, thread: { id, slug, title } });
  }

  /* ---------- POST /upload ---------- */
  if (route === 'upload' && method === 'POST') {
    if (!env.IMG) return bad('Bild-Uploads sind nicht eingerichtet.', 501);
    if (!user) return bad('Bitte zuerst einen Namen wählen.', 401);
    if (isBanned(user)) return bad('Du kannst derzeit nichts hochladen.', 403);
    // Bilder nur für Registrierte: wer ein Bild hochlädt, hinterlässt eine
    // bestätigte E-Mail. Das ist der wirksamste Schutz gegen Missbrauch und
    // gibt im Ernstfall einen Ansprechpartner.
    if (env.UPLOAD_REQUIRES_EMAIL !== '0' && !user.email) {
      return bad('Bilder kannst du hochladen, sobald du deinen Namen per E-Mail gesichert hast — einmalig, ohne Passwort.', 403, { needsEmail: true });
    }

    const day = await env.DB.prepare('SELECT COUNT(*) AS c FROM uploads WHERE user_id=?1 AND created_at>?2')
      .bind(user.id, now() - 86400).first();
    if (day && day.c >= Number(env.IMG_MAX_PER_DAY || IMG_MAX_PER_DAY)) {
      return bad(`Maximal ${env.IMG_MAX_PER_DAY || IMG_MAX_PER_DAY} Bilder pro Tag.`, 429);
    }

    const ct = request.headers.get('content-type') || '';
    if (!ct.startsWith('multipart/form-data')) return bad('Ungültiges Format.');
    let file;
    try {
      const form = await request.formData();
      file = form.get('image');
    } catch { return bad('Datei konnte nicht gelesen werden.'); }
    if (!file || typeof file.arrayBuffer !== 'function') return bad('Keine Datei erhalten.');
    if (file.size > IMG_MAX_BYTES) return bad('Das Bild ist zu groß (maximal 3 MB).');

    let buf = await file.arrayBuffer();
    const kind = sniffImage(buf);
    if (!kind) return bad('Nur JPEG, PNG, GIF oder WebP — und die Datei muss wirklich ein Bild sein.');
    if (kind.mime === 'image/jpeg') buf = stripJpegMetadata(buf);

    const key = imageKey(kind.ext);
    await env.IMG.put(key, buf, { metadata: { mime: kind.mime, u: user.id } });
    await env.DB.prepare('INSERT INTO uploads (key,user_id,mime,bytes,created_at) VALUES (?1,?2,?3,?4,?5)')
      .bind(key, user.id, kind.mime, buf.byteLength, now()).run();

    return json({ ok: true, key, url: `/community/img/${key}` });
  }

  /* ---------- POST /report ---------- */
  if (route === 'report' && method === 'POST') {
    const b = await body(request);
    const postId = Number(b.post);
    if (!postId) return bad('Kein Beitrag angegeben.');
    const exists = await env.DB.prepare('SELECT 1 FROM posts WHERE id=?1').bind(postId).first();
    if (!exists) return bad('Beitrag nicht gefunden.', 404);
    await env.DB.prepare('INSERT INTO reports (post_id,reporter_id,reason,created_at) VALUES (?1,?2,?3,?4)')
      .bind(postId, user?.id || null, String(b.reason || '').slice(0, 300), now()).run();
    return json({ ok: true });
  }

  return bad('Unbekannter Endpunkt.', 404);
}


/* ================================================================== *
 * Bilder ausliefern (aus KV, mit Edge-Cache davor)
 * ================================================================== */
async function serveImage(env, key, ctx) {
  if (!/^[0-9a-f]{32}\.(jpg|png|gif|webp)$/.test(key)) return new Response('Not found', { status: 404 });
  if (!env.IMG) return new Response('Not found', { status: 404 });

  const cache = caches.default;
  const cacheKey = new Request(`https://img.local/${key}`);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const obj = await env.IMG.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!obj || !obj.value) return new Response('Not found', { status: 404 });

  const res = new Response(obj.value, {
    headers: {
      'content-type': (obj.metadata && obj.metadata.mime) || 'application/octet-stream',
      // Schluessel ist zufaellig und unveraenderlich -> aggressiv cachen,
      // das haelt die KV-Leseoperationen im Gratis-Kontingent.
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; img-src 'self'; sandbox",
      'content-disposition': 'inline'
    }
  });
  if (ctx) ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

function publicUser(u) {
  return u ? { id: u.id, name: u.name, role: u.role, email: u.email ? true : null } : null;
}

async function body(request) {
  try { return await request.json(); } catch { return {}; }
}

/* ================================================================== *
 * Moderation — Bearer ADMIN_TOKEN
 * ================================================================== */
async function admin(route, request, env, url) {
  const auth = request.headers.get('Authorization') || '';
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return bad('Nicht autorisiert.', 401);
  }
  const b = request.method === 'POST' ? await body(request) : {};
  const t = now();
  const log = (action, target, note) =>
    env.DB.prepare('INSERT INTO modlog (actor,action,target,note,created_at) VALUES (?1,?2,?3,?4,?5)')
      .bind('admin', action, String(target), note || null, t).run();

  switch (route) {
    case 'overview': {
      const [reports, recent, users] = await Promise.all([
        env.DB.prepare(`SELECT r.id,r.post_id,r.reason,r.created_at,p.body,u.name
                          FROM reports r JOIN posts p ON p.id=r.post_id JOIN users u ON u.id=p.user_id
                         WHERE r.resolved_at IS NULL ORDER BY r.id DESC LIMIT 50`).all(),
        env.DB.prepare(`SELECT p.id,p.body,p.created_at,p.hidden,u.name,u.id AS uid
                          FROM posts p JOIN users u ON u.id=p.user_id
                         ORDER BY p.id DESC LIMIT 50`).all(),
        env.DB.prepare(`SELECT id,name,email,role,post_count,banned_until,created_at
                          FROM users ORDER BY created_at DESC LIMIT 50`).all()
      ]);
      return json({ ok: true, reports: reports.results, posts: recent.results, users: users.results });
    }
    case 'hide-post': {
      // Bild sofort aus dem Speicher entfernen — ein ausgeblendeter Beitrag,
      // dessen Bild unter der direkten Adresse weiter abrufbar bleibt, ist
      // keine Moderation.
      const row = await env.DB.prepare('SELECT image_key FROM posts WHERE id=?1').bind(b.id).first();
      if (row && row.image_key && env.IMG) {
        await env.IMG.delete(row.image_key);
        await env.DB.prepare('UPDATE uploads SET hidden=1 WHERE key=?1').bind(row.image_key).run();
      }
      await env.DB.prepare('UPDATE posts SET hidden=1 WHERE id=?1').bind(b.id).run();
      await log('hide-post', b.id, b.note); return json({ ok: true });
    }
    case 'show-post':
      await env.DB.prepare('UPDATE posts SET hidden=0 WHERE id=?1').bind(b.id).run();
      await log('show-post', b.id); return json({ ok: true });
    case 'ban':
      await env.DB.prepare('UPDATE users SET banned_until=?1, ban_reason=?2 WHERE id=?3')
        .bind(t + (Number(b.days || 3650) * 86400), String(b.reason || 'Regelverstoß'), b.id).run();
      await log('ban', b.id, b.reason); return json({ ok: true });
    case 'unban':
      await env.DB.prepare('UPDATE users SET banned_until=0, ban_reason=NULL WHERE id=?1').bind(b.id).run();
      await log('unban', b.id); return json({ ok: true });
    case 'purge-user': // Alle Beiträge eines Nutzers ausblenden (Spam-Welle)
      await env.DB.prepare('UPDATE posts SET hidden=1 WHERE user_id=?1').bind(b.id).run();
      await log('purge-user', b.id); return json({ ok: true });
    case 'pin':
      await env.DB.prepare('UPDATE threads SET pinned=?1 WHERE id=?2').bind(b.on ? 1 : 0, b.id).run();
      await log('pin', b.id); return json({ ok: true });
    case 'lock':
      await env.DB.prepare('UPDATE threads SET locked=?1 WHERE id=?2').bind(b.on ? 1 : 0, b.id).run();
      await log('lock', b.id); return json({ ok: true });
    case 'hide-thread':
      await env.DB.prepare('UPDATE threads SET hidden=?1 WHERE id=?2').bind(b.on === false ? 0 : 1, b.id).run();
      await log('hide-thread', b.id); return json({ ok: true });
    case 'resolve-report':
      await env.DB.prepare('UPDATE reports SET resolved_at=?1, action=?2 WHERE id=?3')
        .bind(t, String(b.action || 'geprüft'), b.id).run();
      return json({ ok: true });
    case 'post-as': { // Marco postet als Betreiber (z. B. aus der Flotte heraus)
      const uid = b.userId || 'mb-marco';
      const threadId = b.thread || null;
      const res = await env.DB.prepare('INSERT INTO posts (thread_id,user_id,body,created_at) VALUES (?1,?2,?3,?4)')
        .bind(threadId, uid, String(b.body || '').slice(0, 2000), t).run();
      await env.DB.batch([
        env.DB.prepare('UPDATE users SET post_count=post_count+1,last_seen_at=?1 WHERE id=?2').bind(t, uid),
        ...(threadId ? [env.DB.prepare('UPDATE threads SET post_count=post_count+1,last_post_at=?1 WHERE id=?2').bind(t, threadId)] : [])
      ]);
      return json({ ok: true, id: res.meta.last_row_id });
    }
    case 'open-thread': { // Thema von Marco eröffnen lassen (Pipeline/Flotte)
      const title = String(b.title || '').trim();
      if (title.length < 8) return bad('Titel zu kurz.');
      let slug = slugify(title);
      if (await env.DB.prepare('SELECT 1 FROM threads WHERE slug=?1').bind(slug).first()) slug += '-' + Math.floor(Math.random() * 900 + 100);
      const id = uuid();
      await env.DB.prepare(`INSERT INTO threads (id,slug,title,intro,category,author_id,created_at,last_post_at,post_count,official,pinned)
        VALUES (?1,?2,?3,?4,?5,'mb-marco',?6,?6,1,1,?7)`)
        .bind(id, slug, title, String(b.intro || '').slice(0, 180) || null, b.category || 'allgemein', t, b.pinned ? 1 : 0).run();
      await env.DB.prepare('INSERT INTO posts (thread_id,user_id,body,created_at) VALUES (?1,?2,?3,?4)')
        .bind(id, 'mb-marco', String(b.body || title), t).run();
      await log('open-thread', slug);
      return json({ ok: true, slug, id });
    }
    case 'cleanup': // Abgelaufene Magic-Links entfernen
      await env.DB.prepare('DELETE FROM magic_links WHERE expires_at < ?1').bind(t - 86400).run();
      return json({ ok: true });
    default:
      return bad('Unbekannter Admin-Endpunkt.', 404);
  }
}

/* ================================================================== *
 * Moderations-Oberfläche (nur mit Token nutzbar, noindex)
 * ================================================================== */
const ADMIN_HTML = String.raw`<!doctype html>
<html lang="de" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Community · Moderation</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Cormorant+Garamond:wght@400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#0c0b09;--surface:#151310;--border:rgba(212,175,55,.16);--fg:#f1ecdf;--muted:#a39885;--dim:#746b5d;--gold:#d4af37;--red:#b85b4a;--green:#22c55e}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font-family:Outfit,system-ui,sans-serif;padding:28px;font-size:15px}
h1{font-family:"Cormorant Garamond",Georgia,serif;font-size:38px;font-weight:400;margin-bottom:4px}
.sub{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:26px}
h2{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin:34px 0 14px}
.row{background:var(--surface);border:1px solid var(--border);padding:14px 16px;margin-bottom:8px;display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
.row .b{flex:1;min-width:260px;line-height:1.55;word-break:break-word}
.meta{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase}
button{font:inherit;background:none;border:1px solid var(--border);color:var(--muted);padding:7px 13px;cursor:pointer;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase}
button:hover{border-color:var(--gold);color:var(--gold)}
button.danger:hover{border-color:var(--red);color:var(--red)}
input,textarea,select{background:#0c0b09;border:1px solid var(--border);color:var(--fg);padding:11px 13px;font:inherit;width:100%;margin-bottom:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}
.hidden{opacity:.45}
.tag{font-family:"IBM Plex Mono",monospace;font-size:9px;padding:2px 7px;border:1px solid var(--border);color:var(--gold)}
#login{max-width:420px}
.ok{color:var(--green)}
</style></head><body>
<h1>Moderation</h1><div class="sub">MB Capital Community</div>

<div id="login">
  <input id="tok" type="password" placeholder="ADMIN_TOKEN" autocomplete="off">
  <button onclick="save()">Anmelden</button>
</div>

<div id="app" hidden>
  <h2>Neues Thema als Betreiber eröffnen</h2>
  <div class="row" style="display:block">
    <input id="ntTitle" placeholder="Titel">
    <input id="ntIntro" placeholder="Teaser (erscheint in Google)">
    <select id="ntCat">
      <option value="shipping">Shipping</option><option value="mining">Mining &amp; Rohstoffe</option>
      <option value="energie">Energie &amp; Upstream</option><option value="dividenden">Dividenden &amp; YOC</option>
      <option value="depot">Depot &amp; Strategie</option><option value="allgemein">Lounge</option>
    </select>
    <textarea id="ntBody" rows="4" placeholder="Eröffnungsbeitrag"></textarea>
    <label class="meta"><input type="checkbox" id="ntPin" style="width:auto;margin-right:6px">Anpinnen</label>
    <button onclick="openThread()">Thema eröffnen</button>
  </div>

  <h2>Offene Meldungen</h2><div id="reports"></div>
  <div class="grid">
    <div><h2>Letzte Beiträge</h2><div id="posts"></div></div>
    <div><h2>Nutzer</h2><div id="users"></div></div>
  </div>
</div>

<script>
var T=localStorage.getItem('mbc-admin')||'';
function save(){T=document.getElementById('tok').value.trim();localStorage.setItem('mbc-admin',T);load()}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function call(p,b){return fetch('/api/community/admin/'+p,{method:b?'POST':'GET',
  headers:{'authorization':'Bearer '+T,'content-type':'application/json'},body:b?JSON.stringify(b):undefined})
  .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
function act(p,b){call(p,b||{}).then(load).catch(function(e){alert(e.message)})}
function dt(ts){return new Date(ts*1000).toLocaleString('de-DE')}

function load(){
  call('overview').then(function(j){
    document.getElementById('login').hidden=true;document.getElementById('app').hidden=false;
    document.getElementById('reports').innerHTML=j.reports.length?j.reports.map(function(r){
      return '<div class="row"><div class="b"><span class="tag">Grund</span> '+esc(r.reason)+
        '<div style="margin-top:8px;color:var(--muted)">'+esc(r.body).slice(0,400)+'</div>'+
        '<div class="meta" style="margin-top:8px">'+esc(r.name)+' · '+dt(r.created_at)+' · Post #'+r.post_id+'</div></div>'+
        '<div><button class="danger" onclick="act(\'hide-post\',{id:'+r.post_id+'});act(\'resolve-report\',{id:'+r.id+',action:\'entfernt\'})">Entfernen</button> '+
        '<button onclick="act(\'resolve-report\',{id:'+r.id+',action:\'ok\'})">Ist ok</button></div></div>';
    }).join(''):'<div class="row"><span class="ok">Keine offenen Meldungen.</span></div>';

    document.getElementById('posts').innerHTML=j.posts.map(function(p){
      return '<div class="row '+(p.hidden?'hidden':'')+'"><div class="b">'+esc(p.body).slice(0,300)+
        '<div class="meta" style="margin-top:6px">'+esc(p.name)+' · '+dt(p.created_at)+' · #'+p.id+(p.hidden?' · AUSGEBLENDET':'')+'</div></div>'+
        '<div>'+(p.hidden?'<button onclick="act(\'show-post\',{id:'+p.id+'})">Zeigen</button>':
        '<button class="danger" onclick="act(\'hide-post\',{id:'+p.id+'})">Ausblenden</button>')+'</div></div>';
    }).join('');

    document.getElementById('users').innerHTML=j.users.map(function(u){
      var banned=u.banned_until>Math.floor(Date.now()/1000);
      return '<div class="row '+(banned?'hidden':'')+'"><div class="b">'+esc(u.name)+
        ' <span class="tag">'+u.role+'</span>'+(u.email?' <span class="tag">Mail</span>':'')+
        '<div class="meta" style="margin-top:6px">'+u.post_count+' Beiträge · seit '+dt(u.created_at)+(banned?' · GESPERRT':'')+'</div></div>'+
        '<div>'+(banned?'<button onclick="act(\'unban\',{id:\''+u.id+'\'})">Entsperren</button>':
        '<button class="danger" onclick="if(confirm(\'Sperren?\'))act(\'ban\',{id:\''+u.id+'\',days:3650,reason:\'Regelverstoss\'})">Sperren</button> '+
        '<button class="danger" onclick="if(confirm(\'Alle Beiträge ausblenden?\'))act(\'purge-user\',{id:\''+u.id+'\'})">Purge</button>')+'</div></div>';
    }).join('');
  }).catch(function(e){alert('Login fehlgeschlagen: '+e.message)});
}
function openThread(){
  act('open-thread',{title:document.getElementById('ntTitle').value,intro:document.getElementById('ntIntro').value,
    category:document.getElementById('ntCat').value,body:document.getElementById('ntBody').value,
    pinned:document.getElementById('ntPin').checked});
  document.getElementById('ntTitle').value='';document.getElementById('ntBody').value='';document.getElementById('ntIntro').value='';
}
if(T){document.getElementById('tok').value=T;load()}
</script></body></html>`;
