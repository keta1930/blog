CREATE TABLE likes (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE voters (
  slug TEXT NOT NULL,
  voter TEXT NOT NULL,
  PRIMARY KEY (slug, voter)
);
