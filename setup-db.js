const Database = require("better-sqlite3");
const db = new Database("practice.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS concepts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS repertoire (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    composer TEXT,
    genre TEXT NOT NULL,
    user_id TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concept_id INTEGER,
    repertoire_id INTEGER,
    duration INTEGER NOT NULL,
    notes TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    FOREIGN KEY(concept_id) REFERENCES concepts(id),
    FOREIGN KEY(repertoire_id) REFERENCES repertoire(id),
    FOREIGN KEY(user_id) references users(id)
  )
`);

console.log("Database created!");
