const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'characterowners',
    description: 'Lists all users who have at least one character.',
    category: 'Character',
    execute(message, args) {
        // Path to the characters.json file
        const charactersPath = path.join(__dirname, '../data/characters.json');

        try {
            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

            // Get a list of unique player names from the characters
            const uniquePlayerNames = [...new Set(charactersData.characters.map(character => character.playerName))];

            // Create an embed message to display the list of player names
            const embed = new EmbedBuilder()
                .setTitle('Users with Characters')
                .setColor('#00FF00')
                .setTimestamp()
                .setDescription(uniquePlayerNames.join('\n') || 'No characters found.');

            // Send the embed message to the channel
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error reading or parsing characters file:', error);
            message.reply('An error occurred while fetching the list of users with characters.');
        }
    },
};

