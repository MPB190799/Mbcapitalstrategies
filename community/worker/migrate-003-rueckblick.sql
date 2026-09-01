-- Migration 003: Monatsrückblick
-- Beiträge, die Marco beim Moderieren als lesenswert markiert, landen im
-- Rückblick des jeweiligen Monats. Auswahl bleibt menschlich — genau das
-- ist der Teil, der sich nicht automatisieren lässt, ohne aus gehosteten
-- Fremdinhalten eigene zu machen.
ALTER TABLE posts ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured, created_at DESC);

-- Marcos Einordnung zum jeweiligen Zitat. Das ist der Teil, der aus einer
-- Zitatsammlung einen Beitrag mit eigenem Wert macht: die Aussage bleibt
-- dem Verfasser zugeordnet, die Einordnung ist sichtbar Marcos.
ALTER TABLE posts ADD COLUMN featured_note TEXT;
