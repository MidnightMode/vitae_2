const Database = require('better-sqlite3');
const db = new Database('reactions-items.db');

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reaction TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    item_description TEXT
  );
`);

console.log('Database and tables created.');
