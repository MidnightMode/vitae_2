const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Displays information about the Vitae bot and available commands.',
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Vitae Bot Information')
            .setDescription('Welcome to the Vitae Bot! Here’s what you need to know:')
            .setColor('#FF0000')
            .addFields(
                { 
                    name: 'In-Character Commands', 
                    value: '**!truth** - Replies with a random truth question.\n' +
                           '**!dare** - Replies with a random dare.'
                },
                { 
                    name: 'Out-of-Character Commands', 
                    value: '**!artprompt** - Generates a random art prompt for inspiration.'
                },
                { 
                    name: 'Either', 
                    value: '**!bat** - Can be used for both in-character and out-of-character interactions. (Specify context if needed.)'
                }
            )
            .setFooter({ text: 'Use these commands wisely and have fun!' });

        message.channel.send({ embeds: [embed] });
    },
};
