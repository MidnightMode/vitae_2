const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to the characters.json file and assets directory
const charactersPath = path.join(__dirname, '../data/characters.json');
const assetsDir = path.join(__dirname, '../assets');

module.exports = {
    name: 'addcharacter',
    description: 'Adds a new character to the list.',
    category: 'Character',
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

            let imageUrl = '';
            const playerDir = path.join(assetsDir, message.author.username);

            // Ensure the player's directory exists
            if (!fs.existsSync(playerDir)) {
                fs.mkdirSync(playerDir, { recursive: true });
                console.log(`Created directory: ${playerDir}`);
            }

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                const fileName = `${name}-${Date.now()}-${attachment.name}`;
                const filePath = path.join(playerDir, fileName);

                console.log(`Attempting to download attachment: ${attachment.url}`);

                // Download and save the image
                try {
                    const response = await axios({
                        url: attachment.url,
                        method: 'GET',
                        responseType: 'stream',
                    });

                    const writer = fs.createWriteStream(filePath);
                    response.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    console.log(`Saved file to: ${filePath}`);

                    // Use the local file path for the image URL
                    imageUrl = `assets/${message.author.username}/${fileName}`;
                } catch (error) {
                    console.error('Error downloading or saving the attachment:', error);
                    return message.channel.send('Failed to save the attached image. Please try again.');
                }
            } else {
                imageUrl = await collectResponse('Please provide the character\'s image URL.');
                // Validate the image URL
                try {
                    new URL(imageUrl); // This will throw an error if the URL is invalid
                } catch (error) {
                    return message.channel.send('The provided image URL is invalid.');
                }
            }

            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

            // Add new character to the list
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
