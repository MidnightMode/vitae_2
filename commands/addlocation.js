const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addlocation',
    description: 'Update the location of a character.',
    execute(message, args) {
        // Combine args back into a single string to handle quotes
        const input = args.join(' ');

        // Extract the character name from quotes
        const nameMatch = input.match(/"(.*?)"/);
        if (!nameMatch) {
            return message.reply('Please provide a character name in quotes. Usage: !addlocation "[character name]" ![new location]');
        }

        const characterName = nameMatch[1];

        // Extract the new location from the input
        const locationMatch = input.match(/!(.+)$/);
        if (!locationMatch) {
            return message.reply('Please provide the new location prefixed with v!. Usage: !addlocation "[character name]" ![new location]');
        }

        const newLocation = locationMatch[1].trim();

        if (!characterName || !newLocation) {
            return message.reply('Please provide both the character name and the new location. Usage: !addlocation "[character name]" ![new location]');
        }

        const charactersPath = path.join(__dirname, '../data/characters.json');

        let charactersData;

        try {
            charactersData = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
        } catch (error) {
            console.error('Error reading characters file:', error);
            return message.reply('An error occurred while reading the characters file.');
        }

        const character = charactersData.characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());

        if (!character) {
            console.log('Character names in JSON:', charactersData.characters.map(c => c.name)); // Debugging line
            return message.reply(`Character "${characterName}" not found.`);
        }

        if (character.playerId !== message.author.id) {
            return message.reply(`You do not have permission to update the location for "${characterName}".`);
        }

        character.location = newLocation;

        try {
            fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 2), 'utf8');
            message.reply(`The location for ${characterName} has been updated to ${newLocation}.`);
        } catch (error) {
            console.error('Error writing characters file:', error);
            message.reply('An error occurred while updating the characters file.');
        }
    }
};

