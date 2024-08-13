const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'characterinfo',
    description: 'Displays information about a character.',
    category: 'Character',
    execute(message, args) {
        // Path to the characters.json file
        const charactersPath = path.join(__dirname, '../data/characters.json');

        try {
            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

            // Combine args back into a single string to handle quotes
            const characterName = args.join(' ').trim();

            // Find the character by name (case insensitive)
            const character = charactersData.characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());

            if (!character) {
                return message.reply(`Character "${characterName}" not found.`);
            }

            // Create an embed message to display character info
            const embed = new EmbedBuilder()
                .setTitle(`${character.name}`)
                .setColor('#00FF00')
                .setTimestamp()
                .setImage(character.imageUrl || 'https://via.placeholder.com/150') // Add image URL to the embed
                .addFields(
                    { name: 'Location', value: character.location || 'Unknown', inline: true },
                    { name: 'Tupper Brackets', value: character.tupperBrackets || 'None', inline: true },
                    { name: 'XP', value: character.xp.toString(), inline: true },
                    { name: 'Player', value: message.guild.members.cache.get(character.playerId)?.user.username || 'Unknown', inline: true }
                );

            // Send the embed message to the channel
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error reading or parsing characters file:', error);
            message.reply('An error occurred while fetching character information.');
        }
    },
};

