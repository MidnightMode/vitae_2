const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'adminhelp',
    description: 'Lists all admin commands.',
    async execute(message, args) {
        // Define the path to your commands directory
        const commandsPath = path.join(__dirname, '../commands');

        // Get all command files
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        // Load all commands
        const commands = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return command;
        });

        // Filter commands to get only Admin category
        const adminCommands = commands.filter(cmd => cmd.category === 'Admin');

        if (adminCommands.length === 0) {
            return message.reply('No admin commands available.');
        }

        // Create an embed for the admin help command
        const embed = new EmbedBuilder()
            .setTitle('Admin Commands')
            .setDescription('Here are all the admin commands:')
            .setColor('#FF0000') 
            .setTimestamp();

        // Add each admin command to the embed
        adminCommands.forEach(cmd => {
            embed.addFields(
                { name: `!${cmd.name}`, value: cmd.description, inline: true }
            );
        });

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    },
};
