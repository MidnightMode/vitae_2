const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'checkpermissions',
  description: 'Checks and displays the bot\'s permissions in a specified channel.',
  async execute(message, args) {
    // Check if the user provided a channel ID or if the command is invoked in a channel
    const channelId = args[0] ? args[0] : message.channel.id;

    // Fetch the channel from the client
    const channel = message.client.channels.cache.get(channelId);

    if (!channel) {
      return message.reply('Channel not found.');
    }

    // Get bot's permissions for the channel
    const permissions = channel.permissionsFor(message.guild.members.me);

    // Convert permissions to a readable format
    const permissionsList = Object.entries(PermissionsBitField.Flags)
      .filter(([key, value]) => permissions.has(value))
      .map(([key]) => key)
      .join(', ');

    // Log permissions to the console
    console.log(`Bot permissions in channel ${channelId}: ${permissionsList}`);

    // Create an embed to display the permissions
    const embed = new EmbedBuilder()
      .setTitle('Bot Permissions')
      .setDescription(`Permissions in channel <#${channelId}>:`)
      .addFields(
        { name: 'Permissions', value: permissionsList || 'None', inline: true }
      )
      .setColor('#00FF00');

    // Send the embed to the channel
    message.channel.send({ embeds: [embed] });
  },
};
