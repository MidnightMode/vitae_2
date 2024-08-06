const fs = require('fs');
const path = require('path');

// Load the configuration file
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

const recentTruths = [];
const maxRecentTruths = 10; // Maximum number of recent truths to keep in memory

module.exports = {
    name: 'truth',
    description: 'Replies with a random truth question',
    execute(message) {
        // Set a 6-second delay before executing the command
        setTimeout(() => {
            // Check if the message is from the allowed channels
            if (!config.allowedChannels.truth.includes(message.channel.id)) {
                return;
            }

            try {
                const truths = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/truths.json'), 'utf-8'));
                
                // Filter truths to exclude recently used ones
                let availableTruths = truths.filter(truth => !recentTruths.includes(truth));

                // If all truths have been used recently, reset the recent list
                if (availableTruths.length === 0) {
                    availableTruths = truths;
                    recentTruths.length = 0; // Clear the recent truths list
                }

                // Select a random truth
                const truth = availableTruths[Math.floor(Math.random() * availableTruths.length)];

                // Add the selected truth to the recent truths list
                recentTruths.push(truth);
                if (recentTruths.length > maxRecentTruths) {
                    recentTruths.shift(); // Remove the oldest truth to keep the list within the max size
                }

                message.channel.send(truth);
            } catch (error) {
                console.error('Error fetching truth: ', error);
                message.channel.send('Failed to fetch a truth. Please try again later.');
            }
        }, 2000); // 6000 milliseconds = 6 seconds
    },
};
