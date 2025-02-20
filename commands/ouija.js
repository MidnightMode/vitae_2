module.exports = {
    name: 'ouija',
    description: 'Ask the Ouija board a question and receive an answer.',
    execute(message, args) {
        const question = args.join(' ');

        if (!question) {
            return message.reply('You need to ask a question! Example: `!ouija Will I get pizza tonight?`');
        }

        const responses = [
            'YES', 'NO', 'MAYBE', 'SOON', 'NEVER',
            'ASK AGAIN', 'I DON\'T KNOW', 'IT\'S UNCLEAR',
            'YOU KNOW THE ANSWER', 'WAIT', 'GOOD LUCK',
            'BE CAREFUL', 'TRY AGAIN LATER', 'DOUBT IT'
        ];

        const spookyText = [
            '...the planchette begins to move...',
            '...a ghostly presence stirs...',
            '...the board hums softly...',
            '...you feel a chill in the air...',
            '...a mysterious force moves your hands...',
        ];

        const randomSpookyText = spookyText[Math.floor(Math.random() * spookyText.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Simulate the planchette moving slowly over the board
        async function ouijaResponse() {
            await message.reply(randomSpookyText);
            await delay(2000); // Wait 2 seconds
            let responseMessage = '';

            for (const char of randomResponse) {
                responseMessage += `**${char}** `;
                await message.channel.send(responseMessage.trim());
                await delay(800); // Pause for effect
            }

            await message.channel.send('The Ouija board stops moving...');
        }

        ouijaResponse();
    },
};
