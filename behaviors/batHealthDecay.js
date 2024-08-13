const db = require('../data/db');  // Move the import to the top for clarity

module.exports = {
    name: 'batHealthDecay',
    start(client) {
        console.log('Bat health decay behavior started.');

        // Function to handle the health decay logic
        async function decayBatHealth() {
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
        }

        // Set the interval to run decayBatHealth every hour (3600000 ms)
        setInterval(decayBatHealth, 3600000);

        // Optionally run the decay function immediately on startup
        decayBatHealth();
    }
};
