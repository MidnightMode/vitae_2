const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'allcharacters',
    description: 'Displays all characters for a specific user.',
    category: 'Character',
    execute(message, args) {
        // Path to the characters.json file
        const charactersPath = path.join(__dirname, '../data/characters.json');

        try {
            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

            // Check if a username was provided
            const username = args.join(' ').trim();
            if (!username) {
                return message.reply('Please provide a username to see all their characters.');
            }

            // Find the user by username (case insensitive)
            const user = message.guild.members.cache.find(member => member.user.username.toLowerCase() === username.toLowerCase());
            if (!user) {
                return message.reply(`User "${username}" not found.`);
            }

            // Find all characters belonging to the user
            const userCharacters = charactersData.characters.filter(c => c.playerId === user.id);

            if (userCharacters.length === 0) {
                return message.reply(`No characters found for user "${username}".`);
            }

            // Send an embed for each character
            userCharacters.forEach(character => {
                const embed = new EmbedBuilder()
                    .setTitle(`${character.name}`)
                    .setColor('#00FF00')
                    .setTimestamp()
                    .setImage(character.imageUrl || 'https://via.placeholder.com/150')
                    .addFields(
                        { name: 'Location', value: character.location || 'Unknown', inline: true },
                        { name: 'Tupper Brackets', value: character.tupperBrackets || 'None', inline: true },
                        { name: 'XP', value: character.xp.toString(), inline: true },
                        { name: 'Player', value: user.user.username, inline: true }
                    );

                message.channel.send({ embeds: [embed] });
            });

        } catch (error) {
            console.error('Error reading or parsing characters file:', error);
            message.reply('An error occurred while fetching character information.');
        }
    },
};
