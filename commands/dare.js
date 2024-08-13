const fs = require('fs');
const path = require('path');

// Load the configuration file
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

const recentDares = [];
const maxRecentDares = 10; // Maximum number of recent dares to keep in memory

module.exports = {
    name: 'dare',
    description: 'Replies with a random dare',
    category: 'Game',
    execute(message) {
        // Set a 6-second delay before executing the command
        setTimeout(() => {
            // Check if the message is from one of the allowed channels
            if (!config.allowedChannels.dare.includes(message.channel.id)) {
                return;
                // return message.reply('This command can only be used in the designated channels.');
            }

            try {
                const dares = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dares.json'), 'utf-8'));

                // Filter dares to exclude recently used ones
                let availableDares = dares.filter(dare => !recentDares.includes(dare));

                // If all dares have been used recently, reset the recent list
                if (availableDares.length === 0) {
                    availableDares = dares;
                    recentDares.length = 0; // Clear the recent dares list
                }

                // Select a random dare
                const dare = availableDares[Math.floor(Math.random() * availableDares.length)];

                // Add the selected dare to the recent dares list
                recentDares.push(dare);
                if (recentDares.length > maxRecentDares) {
                    recentDares.shift(); // Remove the oldest dare to keep the list within the max size
                }

                message.channel.send(dare);
            } catch (error) {
                console.error('Error fetching dare: ', error);
                message.channel.send('Failed to fetch a dare. Please try again later.');
            }
        }, 2000); // 6000 milliseconds = 6 seconds
    },
};

