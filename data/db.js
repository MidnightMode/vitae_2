const Database = require('better-sqlite3');
const db = new Database('database.db');

// Update: Create the bats table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS bats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    health INTEGER NOT NULL,
    xp INTEGER NOT NULL,
    level INTEGER NOT NULL,
    last_interaction INTEGER NOT NULL,
    image_url TEXT,
    friendship_level INTEGER DEFAULT 0
  );
`);

// Fetch a bat by user_id
function getBatByUserId(userId) {
  return db.prepare('SELECT * FROM bats WHERE user_id = ?').get(userId);
}

// Insert a new bat
function insertBat(userId, name, health, xp, level, last_interaction, image_url, friendship_level) {
  return db.prepare(`
    INSERT INTO bats (user_id, name, health, xp, level, last_interaction, image_url, friendship_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, name, health, xp, level, last_interaction, image_url, friendship_level);
}

// Update bat health
function updateBatHealth(userId, health) {
  return db.prepare('UPDATE bats SET health = ? WHERE user_id = ?').run(health, userId);
}

// Update bat xp
function updateBatXp(userId, xp) {
  return db.prepare('UPDATE bats SET xp = ? WHERE user_id = ?').run(xp, userId);
}

// Update bat level
function updateBatLevel(userId, level) {
  return db.prepare('UPDATE bats SET level = ? WHERE user_id = ?').run(level, userId);
}

// Update bat friendship level
function updateBatFriendship(userId, friendship_level) {
  return db.prepare('UPDATE bats SET friendship_level = ? WHERE user_id = ?').run(friendship_level, userId);
}

// Update last interaction time
function updateLastInteraction(userId, lastInteraction) {
  return db.prepare('UPDATE bats SET last_interaction = ? WHERE user_id = ?').run(lastInteraction, userId);
}

// Update bat name
function updateBatName(userId, name) {
  return db.prepare('UPDATE bats SET name = ? WHERE user_id = ?').run(name, userId);
}

// Update bat image URL
function updateBatImage(userId, image_url) {
  return db.prepare('UPDATE bats SET image_url = ? WHERE user_id = ?').run(image_url, userId);
}

// fetch all bats from the database
function getAllBats() {
    return db.prepare('SELECT * FROM bats').all();
}

// Export functions
module.exports = {
  getBatByUserId,
  insertBat,
  updateBatHealth,
  updateBatXp,
  updateBatLevel,
  updateBatFriendship,
  updateLastInteraction,
  updateBatName,
  updateBatImage,
  getAllBats,
};
