const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to the characters.json file and assets directory
const charactersPath = path.join(__dirname, '../data/characters.json');
const assetsDir = path.join(__dirname, '../assets');

module.exports = {
    name: 'uploadasset',
    description: 'Uploads an asset and associates it with a character.',
    category: 'Character',
    async execute(message, args) {
        try {
            const characterName = args.join(' ').trim();

            // Read and parse characters.json
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
            const character = charactersData.characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());

            if (!character) {
                return message.reply(`Character "${characterName}" not found.`);
            }

            // Ensure the requester is the owner of the character
            if (character.playerId !== message.author.id) {
                return message.reply('You do not have permission to upload an asset for this character.');
            }

            // Ensure the player's directory exists
            const playerDir = path.join(assetsDir, message.author.username);
            if (!fs.existsSync(playerDir)) {
                fs.mkdirSync(playerDir, { recursive: true });
                console.log(`Created directory: ${playerDir}`);
            }

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                const fileName = `${characterName}-${Date.now()}-${attachment.name}`;
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

                    // Update the character's imageUrl
                    character.imageUrl = `assets/${message.author.username}/${fileName}`;

                    // Save the updated data back to the file
                    fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 2), 'utf8');
                    message.channel.send(`Asset uploaded and associated with character "${characterName}" successfully.`);
                } catch (error) {
                    console.error('Error downloading or saving the attachment:', error);
                    return message.channel.send('Failed to save the attached image. Please try again.');
                }
            } else {
                message.reply('No attachment found. Please attach an image file.');
            }
        } catch (error) {
            console.error('Error handling asset upload:', error);
            message.channel.send('An error occurred while uploading the asset.');
        }
    },
};
