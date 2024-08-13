const fs = require('fs');
const path = require('path');
const { MessageCollector } = require('discord.js');

module.exports = {
    name: 'editcharacter',
    description: 'Interactively edit a character\'s information.',
    category: 'Character',
    async execute(message, args) {
        const charactersPath = path.join(__dirname, '../data/characters.json');
        const characterName = args.join(' ').trim();

        try {
            const charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
            const character = charactersData.characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());

            if (!character) {
                return message.reply(`Character "${characterName}" not found.`);
            }

            // Check if the requester is the owner of the character
            const requesterId = message.author.id;
            const ownerId = character.playerId;

            if (requesterId !== ownerId) {
                return message.reply('You do not have permission to edit this character.');
            }

            // Step 1: Prompt for the field to edit
            await message.reply('Which field would you like to edit? Options: "name", "location", "tupperbrackets", "imageUrl".');

            const filter = response => response.author.id === requesterId;
            const collector = new MessageCollector(message.channel, { filter, time: 60000 });
            let step = 1;
            let field;

            collector.on('collect', response => {
                const userInput = response.content.trim().toLowerCase();

                if (step === 1) {
                    // Validate the field
                    if (!['name', 'location', 'tupperbrackets', 'imageurl'].includes(userInput)) {
                        response.reply('Invalid field. Use "name", "location", "tupperbrackets", or "imageUrl".');
                        return;
                    }

                    field = userInput;
                    response.reply(`Please enter the new value for ${field}.`);
                    step = 2; // Move to the next step
                } else if (step === 2) {
                    // Update the character based on the field
                    switch (field) {
                        case 'name':
                            const nameExists = charactersData.characters.some(c => c.name.toLowerCase() === userInput.toLowerCase());
                            if (nameExists) {
                                response.reply(`Character name "${userInput}" already exists. Please choose a different name.`);
                                return collector.stop();
                            }
                            character.name = userInput;
                            break;
                        case 'location':
                            character.location = userInput;
                            break;
                        case 'tupperbrackets':
                            character.tupperBrackets = userInput;
                            break;
                        case 'imageurl':
                            character.imageUrl = userInput;
                            break;
                    }

                    // Save the updated data
                    fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 2), 'utf8');
                    response.reply(`Character ${characterName} updated successfully.`);
                    collector.stop(); // Stop collector after successful update
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    message.reply('You did not provide a response in time.');
                }
            });

        } catch (error) {
            console.error('Error reading or updating characters file:', error);
            message.reply('An error occurred while updating character information.');
        }
    },
};
