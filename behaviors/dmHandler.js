// /behaviors/dmHandler.js

module.exports = {
    name: 'dmHandler',
    async execute(message) {
        // Check if the message is a DM and not from a bot
        if (message.channel.type === 'DM' && !message.author.bot) {
            console.log(`Received DM from ${message.author.tag}: ${message.content}`);
            
            // Respond with "hi"
            try {
                await message.channel.send('hi');
                console.log(`Replied with 'hi' to ${message.author.tag}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }
};
