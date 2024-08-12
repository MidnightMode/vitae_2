const Database = require('better-sqlite3');
const db = new Database('database.db');

const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='bats'").get();

console.log("Schema for 'bats' table:", schema.sql);
