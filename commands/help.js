const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all available commands.',
    async execute(message, args) {
        // Get all available commands
        const commands = message.client.commands.map(cmd => ({
            name: `!${cmd.name}`,
            description: cmd.description
        }));

        // Create an embed for the help command
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription('Here are all the available commands:')
            .setColor('#0099ff')
            .setTimestamp();

        // Add each command to the embed
        commands.forEach(cmd => {
            embed.addFields(
                { name: cmd.name, value: cmd.description, inline: true }
            );
        });

        // Optionally add information about bat commands in a separate field
        embed.addFields(
            { name: 'Bat Commands', value: '`!bat start [name]`: Adopt a new bat.\n`!bat status`: Check bat status.\n`!bat feed`: Feed your bat.\n`!bat evolve`: Evolve your bat.\n`!bat rename [new name]`: Rename your bat.', inline: false }
        );

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    },
};
