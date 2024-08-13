const Database = require('better-sqlite3');
const db = new Database('reactions-items.db');

// Sample items
const items = [
  { item_name: 'Shiny Pebble', item_description: 'A small, shiny pebble that glimmers in the light.' },
  { item_name: 'Berry', item_description: 'A sweet berry that your bat picked from a nearby bush.' },
  { item_name: 'Mysterious Leaf', item_description: 'A leaf with a mysterious, faint glow.' },
  { item_name: 'Tiny Bell', item_description: 'A tiny bell that jingles softly when shaken.' }
];

// Insert items into the database
const insert = db.prepare('INSERT INTO items (item_name, item_description) VALUES (?, ?)');
items.forEach(item => {
  insert.run(item.item_name, item.item_description);
});

console.log('Items populated.');
