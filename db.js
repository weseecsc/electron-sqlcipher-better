const Database = require("better-sqlite3-multiple-ciphers");
const fs = require("fs");
const path = require("path");
const { getOrCreateDbKey } = require("./keyManager");

async function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  // Fetch key from OS keyring
  const key = await getOrCreateDbKey();

  // Open DB (creates encrypted file on first launch)
  const db = new Database(dbPath);

  // MUST be first SQL statements
  db.pragma("cipher='sqlcipher'");
  db.pragma(`key = "x'${key}'"`);

  // Optional hardening
  db.pragma("kdf_iter=64000");
  db.pragma("cipher_page_size=4096");
  db.pragma("journal_mode=WAL");

  // Schema setup (safe on first launch)
  db.transaction(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        created_at INTEGER
      );
    `);
  })();

  return db;
}

module.exports = { openDatabase };
