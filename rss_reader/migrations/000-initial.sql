CREATE TABLE blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  xml_url TEXT NOT NULL UNIQUE
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_id INTEGER NOT NULL,
  external_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TEXT NOT NULL,
  favorite BOOL,
  read_at TEXT,
  FOREIGN KEY (blog_id) REFERENCES blogs.id
);

CREATE TABLE feeds (
  blog_id INTEGER PRIMARY KEY,
  hash TEXT NOT NULL,
  etag TEXT,
  last_modified TEXT NOT NULL,
  FOREIGN KEY (blog_id) REFERENCES blogs.id
) WITHOUT ROWID;
