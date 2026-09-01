-- Migration 002: Bild-Anhaenge (ein Bild pro Beitrag)
-- Ausfuehren:  wrangler d1 execute mbc-community --remote --file=./migrate-002-images.sql

ALTER TABLE posts ADD COLUMN image_key TEXT;

-- Hochgeladene, noch nicht an einen Beitrag gehaengte Bilder.
-- Der Cron-Job raeumt verwaiste Uploads nach 24 h weg.
CREATE TABLE IF NOT EXISTS uploads (
  key         TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  mime        TEXT NOT NULL,
  bytes       INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  post_id     INTEGER REFERENCES posts(id),
  hidden      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_uploads_user ON uploads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_orphan ON uploads(post_id, created_at);
