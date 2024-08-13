const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all available commands.',
    category: 'Help',
    async execute(message, args) {
        // Filter out admin commands
        const commands = message.client.commands
            .filter(cmd => cmd.category !== 'Admin')
            .map(cmd => ({
                name: `!${cmd.name}`,
                description: cmd.description,
                category: cmd.category || 'General',
                detailedDescription: cmd.detailedDescription || ''
            }));

        // Group commands by category
        const groupedCommands = commands.reduce((groups, cmd) => {
            const category = cmd.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(cmd);
            return groups;
        }, {});

        // Create an embed for the help command
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription('Here are all the available commands:')
            .setColor('#0099ff')
            .setTimestamp();

        // Add each command category to the embed
        for (const [category, cmds] of Object.entries(groupedCommands)) {
            embed.addFields(
                { name: `${category} Commands`, value: cmds.map(cmd => {
                    return cmd.detailedDescription
                        ? `**${cmd.name}**: ${cmd.detailedDescription}`
                        : `${cmd.name}: ${cmd.description}`;
                }).join('\n'), inline: false }
            );
        }

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    },
};
