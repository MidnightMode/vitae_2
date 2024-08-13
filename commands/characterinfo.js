const fs = require('fs');
const path = require('path');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

// Path to the characters.json file and assets directory
const charactersPath = path.join(__dirname, '../data/characters.json');
const assetsDir = path.join(__dirname, '../assets');

module.exports = {
    name: 'characterinfo',
    description: 'Displays information about a character.',
    category: 'Character',
    async execute(message, args) {
        const characterName = args.join(' ').trim();

        try {
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
            const character = charactersData.characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());

            if (!character) {
                return message.reply(`Character "${characterName}" not found.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(character.name)
                .setColor('#FF0000')
                .setDescription(`__Location:__ ${character.location}\n__Tupperbrackets:__ ${character.tupperBrackets}`);
                

            // Check if imageUrl is local or URL
            if (character.imageUrl && character.imageUrl.startsWith('assets/')) {
                const filePath = path.join(__dirname, '../', character.imageUrl);
                
                if (fs.existsSync(filePath)) {
                    // Create attachment and use in embed
                    const attachment = new AttachmentBuilder(filePath, { name: path.basename(filePath) });
                    embed.setImage('attachment://' + attachment.name); // Use the filename in the embed
                    await message.channel.send({ embeds: [embed], files: [attachment] });
                } else {
                    message.channel.send('Image file not found.');
                }
            } else {
                // If imageUrl is a URL, use it directly in the embed
                embed.setImage(character.imageUrl);
                message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error displaying character info:', error);
            message.reply('An error occurred while retrieving character information.');
        }
    },
};
