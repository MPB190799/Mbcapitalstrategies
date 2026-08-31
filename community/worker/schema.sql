-- MB Capital Strategies · Community · D1 Schema
-- Anlegen:  wrangler d1 execute mbc-community --remote --file=./schema.sql

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------
-- USERS  (Gast per signiertem Cookie ODER registriert per Magic-Link)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,             -- uuid
  name          TEXT NOT NULL,                -- Anzeigename (Spitzname)
  name_key      TEXT NOT NULL,                -- lower(name) für Unique-Check
  email         TEXT,                         -- NULL = Gast
  email_key     TEXT,                         -- lower(email), unique wenn gesetzt
  role          TEXT NOT NULL DEFAULT 'guest',-- guest | member | mod | admin
  newsletter    INTEGER NOT NULL DEFAULT 0,   -- 1 = Double-Opt-in an Brevo übergeben
  created_at    INTEGER NOT NULL,
  last_seen_at  INTEGER NOT NULL,
  post_count    INTEGER NOT NULL DEFAULT 0,
  banned_until  INTEGER NOT NULL DEFAULT 0,   -- unix-ts; 0 = nicht gesperrt
  ban_reason    TEXT,
  ip_hash       TEXT                          -- HMAC(IP) – kein Klartext, DSGVO
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name  ON users(name_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email_key) WHERE email_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_iphash       ON users(ip_hash);

-- ---------------------------------------------------------------
-- THREADS  (indexierbare Themen-Seiten -> /community/t/<slug>)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS threads (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL,
  title         TEXT NOT NULL,
  intro         TEXT,                          -- Meta-Description / Teaser
  category      TEXT NOT NULL DEFAULT 'allgemein',
  author_id     TEXT NOT NULL REFERENCES users(id),
  created_at    INTEGER NOT NULL,
  last_post_at  INTEGER NOT NULL,
  post_count    INTEGER NOT NULL DEFAULT 0,
  pinned        INTEGER NOT NULL DEFAULT 0,
  locked        INTEGER NOT NULL DEFAULT 0,
  hidden        INTEGER NOT NULL DEFAULT 0,
  official      INTEGER NOT NULL DEFAULT 0     -- 1 = von Marco eröffnet
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_threads_slug ON threads(slug);
CREATE INDEX IF NOT EXISTS idx_threads_last  ON threads(hidden, pinned DESC, last_post_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_cat   ON threads(category, last_post_at DESC);

-- ---------------------------------------------------------------
-- POSTS  (thread_id NULL = Live-Feed / Lounge)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id     TEXT REFERENCES threads(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL REFERENCES users(id),
  body          TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  hidden        INTEGER NOT NULL DEFAULT 0,
  edited_at     INTEGER,
  reply_to      INTEGER REFERENCES posts(id),
  ip_hash       TEXT
);
CREATE INDEX IF NOT EXISTS idx_posts_feed   ON posts(thread_id, hidden, id DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user   ON posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_recent ON posts(created_at DESC);

-- ---------------------------------------------------------------
-- MAGIC LINKS  (E-Mail-Login ohne Passwort)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS magic_links (
  token_hash    TEXT PRIMARY KEY,             -- SHA-256 des Tokens
  email_key     TEXT NOT NULL,
  user_id       TEXT,                          -- gesetzt, wenn Gast->Member Upgrade
  name          TEXT,
  newsletter    INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL,
  expires_at    INTEGER NOT NULL,
  used_at       INTEGER
);
CREATE INDEX IF NOT EXISTS idx_magic_exp ON magic_links(expires_at);

-- ---------------------------------------------------------------
-- REPORTS  (Melde-Funktion / DSA Notice-and-Action)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id   TEXT,
  reason        TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  resolved_at   INTEGER,
  action        TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_open ON reports(resolved_at, created_at DESC);

-- ---------------------------------------------------------------
-- MODLOG  (Nachweispflicht: wer hat was moderiert)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS modlog (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  actor         TEXT NOT NULL,
  action        TEXT NOT NULL,
  target        TEXT NOT NULL,
  note          TEXT,
  created_at    INTEGER NOT NULL
);

-- ---------------------------------------------------------------
-- Start-Threads (Marco als Systemnutzer)
-- ---------------------------------------------------------------
INSERT OR IGNORE INTO users (id,name,name_key,email,email_key,role,created_at,last_seen_at)
VALUES ('mb-marco','Marco','marco',NULL,NULL,'admin',strftime('%s','now'),strftime('%s','now'));
