const fs = require('fs');
const path = require('path');

// Path to the characters.json file
const charactersPath = path.join(__dirname, '../data/characters.json');

module.exports = {
    name: 'addcharacter',
    description: 'Adds a new character to the list.',
    async execute(message, args) {
        const defaultXP = 20;

        // Function to collect a response from the user
        const collectResponse = async (prompt) => {
            await message.channel.send(prompt);
            const filter = response => response.author.id === message.author.id;
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
            return collected.first().content;
        };

        try {
            const name = await collectResponse('Please provide the character\'s name.');
            const location = await collectResponse('Please provide the character\'s location.');
            const tupperBrackets = await collectResponse('Please provide the character\'s Tupper Brackets.');
            const imageUrl = await collectResponse('Please provide the character\'s image URL.');

            // Validate the image URL
            try {
                new URL(imageUrl); // This will throw an error if the URL is invalid
            } catch (error) {
                return message.channel.send('The provided image URL is invalid.');
            }

            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
            charactersData.characters.push({
                name,
                location,
                tupperBrackets,
                xp: defaultXP,
                imageUrl,
                playerId: message.author.id, // Save the player's ID
                playerName: message.author.username // Save the player's username
            });

            // Save the updated data back to the file
            fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 2), 'utf8');
            message.channel.send(`Character "${name}" added successfully.`);
        } catch (error) {
            if (error instanceof Map && error.has('time')) {
                message.channel.send('You did not provide the required information in time.');
            } else {
                console.error('Error reading or updating characters file:', error);
                message.channel.send('An error occurred while adding the character.');
            }
        }
    },
};
