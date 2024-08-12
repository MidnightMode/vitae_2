module.exports = {
    name: 'dmHandler',
    start(client) {
        console.log('DM handler started.');

        client.on('messageCreate', async (message) => {
            if (message.channel.type === 'DM' && !message.author.bot) {
                console.log(`Received DM from ${message.author.tag}: ${message.content}`);
                try {
                    await message.channel.send('Hi! You are DMing me now!');
                    console.log(`Replied with 'Hi! You are DMing me now!' to ${message.author.tag}`);
                } catch (error) {
                    console.error('Error sending DM response:', error);
                }
            }
        });
    }
};
