const fs = require('fs');
const path = require('path');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

// Path to the characters.json file and assets directory
const charactersPath = path.join(__dirname, '../data/characters.json');
const assetsDir = path.join(__dirname, '../assets');

module.exports = {
    name: 'allcharacters',
    description: 'Displays information about all characters owned by a specific player.',
    category: 'Character',
    async execute(message, args) {
        // Check if a player name was provided
        if (args.length === 0) {
            return message.channel.send('Please provide the player\'s name.');
        }

        const playerName = args.join(' ').trim();

        try {
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
            
            // Ensure charactersData and characters array are defined
            if (!charactersData || !Array.isArray(charactersData.characters)) {
                return message.channel.send('No characters data found.');
            }

            // Filter characters based on the provided player name
            const playerCharacters = charactersData.characters.filter(character => 
                character.playerName && character.playerName.toLowerCase() === playerName.toLowerCase()
            );

            if (playerCharacters.length === 0) {
                return message.channel.send(`No characters found for player "${playerName}".`);
            }

            const embeds = playerCharacters.map(character => {
                const embed = new EmbedBuilder()
                    .setTitle(character.name)
                    .setColor('#FF0000')
                    .setDescription(` **Location:** ${character.location}\n**Tupperbrackets:** ${character.tupperBrackets}`);
                    

                // Check if imageUrl is local or URL
                if (character.imageUrl && character.imageUrl.startsWith('assets/')) {
                    const filePath = path.join(__dirname, '../', character.imageUrl);

                    if (fs.existsSync(filePath)) {
                        // Create attachment and use in embed
                        const attachment = new AttachmentBuilder(filePath, { name: path.basename(filePath) });
                        embed.setImage('attachment://' + attachment.name); // Use the filename in the embed
                        return { embeds: [embed], files: [attachment] };
                    } else {
                        embed.setImage(''); // Remove image if file not found
                    }
                } else if (character.imageUrl) {
                    // If imageUrl is a URL, use it directly in the embed
                    embed.setImage(character.imageUrl);
                }

                return { embeds: [embed] };
            });

            // Send all embeds
            for (const embed of embeds) {
                await message.channel.send(embed);
            }
        } catch (error) {
            console.error('Error displaying characters for player:', error);
            message.reply('An error occurred while retrieving character information.');
        }
    },
};
