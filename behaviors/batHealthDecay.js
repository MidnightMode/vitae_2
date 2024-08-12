module.exports = {
    name: 'batHealthDecay',
    start(client) {
        console.log('Bat health decay behavior started.');

        // Example behavior: Decrease bat health over time
        setInterval(async () => {
            const db = require('../data/db');  // Adjust the path if necessary
            try {
                // Fetch all bat data
                const bats = db.getAllBats();

                // Loop through each bat and decrease its health
                for (const bat of bats) {
                    let newHealth = bat.health - 1;
                    if (newHealth < 0) newHealth = 0;

                    // Update bat's health in the database
                    db.updateBatHealth(bat.user_id, newHealth);
                }

                console.log('Bat health decay processed.');
            } catch (error) {
                console.error('Error processing bat health decay:', error);
            }
        }, 3600000);  // Run this every hour (3600000 milliseconds)
    }
};
