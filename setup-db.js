const Database = require('better-sqlite3');
const db = new Database('database.db');

// Create the bats table
db.exec(`
    CREATE TABLE IF NOT EXISTS bats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        health INTEGER NOT NULL,
        xp INTEGER NOT NULL,
        evolution_stage INTEGER NOT NULL,
        last_interaction INTEGER NOT NULL,
        image_url TEXT
    );
`);

console.log('Database and table created successfully.');
