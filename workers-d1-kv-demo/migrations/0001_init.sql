-- D1 schema for workers-d1-kv-demo
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visited_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT
);
