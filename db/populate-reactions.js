const Database = require('better-sqlite3');
const db = new Database('reactions-items.db');

// Sample reactions
const reactions = [
  'Your bat chirps happily!',
  'Your bat brings you a shiny pebble!',
  'Your bat flaps its wings excitedly!',
  'Your bat gives a joyful squeak!',
  'Your bat nudges you affectionately!'
];

// Insert reactions into the database
const insert = db.prepare('INSERT INTO reactions (reaction) VALUES (?)');
reactions.forEach(reaction => {
  insert.run(reaction);
});

console.log('Reactions populated.');
