const Database = require('better-sqlite3');
const db = new Database('database.db');

// Create the bats table if it does not exist
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

// Fetch a bat by user_id
function getBatByUserId(userId) {
  return db.prepare('SELECT * FROM bats WHERE user_id = ?').get(userId);
}

// Insert a new bat
function insertBat(userId, name, health, xp, evolution_stage, last_interaction, image_url) {
  return db.prepare(`
    INSERT INTO bats (user_id, name, health, xp, evolution_stage, last_interaction, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, name, health, xp, evolution_stage, last_interaction, image_url);
}

// Update bat health
function updateBatHealth(userId, health) {
  return db.prepare('UPDATE bats SET health = ? WHERE user_id = ?').run(health, userId);
}

// Update bat xp
function updateBatXp(userId, xp) {
  return db.prepare('UPDATE bats SET xp = ? WHERE user_id = ?').run(xp, userId);
}

// Update bat evolution stage
function updateBatEvolutionStage(userId, evolution_stage) {
  return db.prepare('UPDATE bats SET evolution_stage = ? WHERE user_id = ?').run(evolution_stage, userId);
}

// Update bat name
function updateBatName(userId, name) {
  return db.prepare('UPDATE bats SET name = ? WHERE user_id = ?').run(name, userId);
}

// Update bat image URL
function updateBatImage(userId, image_url) {
  return db.prepare('UPDATE bats SET image_url = ? WHERE user_id = ?').run(image_url, userId);
}

// Export functions
module.exports = {
  getBatByUserId,
  insertBat,
  updateBatHealth,
  updateBatXp,
  updateBatEvolutionStage,
  updateBatName,
  updateBatImage,
};
