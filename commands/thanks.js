const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'thanks',
    description: 'Displays a list of credits and contributions.',
    category: 'Credits',
    execute(message, args) {
        // Path to the credits JSON file
        const creditsFilePath = path.join(__dirname, '../data/credits.json');

        let creditsData;

        try {
            creditsData = JSON.parse(fs.readFileSync(creditsFilePath, 'utf8'));
        } catch (error) {
            console.error('Error reading credits file:', error);
            return message.reply('An error occurred while reading the credits file.');
        }

        // Create an embed message
        const embed = new EmbedBuilder()
            .setTitle('Credits and Thanks')
            .setColor('#00FF00')
            .setTimestamp()
            .setFooter({ text: 'Thank you to everyone who contributed!' });

        // Add fields to the embed
        creditsData.forEach(entry => {
            embed.addFields({ name: entry.name, value: entry.contribution });
        });

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    }
};
