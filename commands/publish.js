const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js'); // Correct import for discord.js v14

// Load channel and role IDs from configuration file in the data folder
const channelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'channels.json'), 'utf-8'));

module.exports = {
    name: 'publish',
    description: 'Publish messages from the hidden channel to a specified channel by name',
    async execute(message, args) {
        // Ensure the command is used in the correct channel
        if (message.channel.id !== channelConfig.hiddenChannelId) {
            return message.reply('This command can only be used in the hidden channel.');
        }

        // Check if the user has the Moderator role
        const moderatorRoleId = channelConfig.moderatorRoleId;
        if (!message.member.roles.cache.has(moderatorRoleId)) {
            return message.reply('You do not have permission to use this command.');
        }

        // Extract channel name and message content
        const channelName = args.shift();
        const content = args.join(' ');

        // Find the target channel by name
        const targetChannel = message.guild.channels.cache.find(channel => channel.name === channelName);

        if (!targetChannel) {
            return message.reply(`Channel "${channelName}" not found.`);
        }

        // Create the embed message
        const embed = new EmbedBuilder()
            .setTitle('Vitae')
            .setDescription(content)
            .setColor('#FF0000')
            .setFooter({ text: 'This is an official message' }) // Standard footer message
            .setTimestamp();

        targetChannel.send({ embeds: [embed] })
            .then(() => message.reply('Message published successfully!'))
            .catch(error => {
                console.error('Error publishing message: ', error);
                message.reply('Failed to publish message. Please try again later.');
            });
    },
};
