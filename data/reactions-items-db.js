const Database = require('better-sqlite3');
const db = new Database('reactions-items.db');

// Function to get all reactions
function getReactions() {
  return db.prepare('SELECT reaction FROM reactions').all().map(row => row.reaction);
}

// Function to get all items
function getItems() {
  return db.prepare('SELECT item_name, item_description FROM items').all();
}

module.exports = {
  getReactions,
  getItems,
};
