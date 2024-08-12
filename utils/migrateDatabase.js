const Database = require('better-sqlite3');
const db = new Database('database.db');

// Alter the bats table to rename and add new columns
db.exec(`
  ALTER TABLE bats RENAME COLUMN evolution_stage TO level;
  ALTER TABLE bats ADD COLUMN friendship_level INTEGER DEFAULT 0;
`);

console.log("Database migration completed successfully.");
