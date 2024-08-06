const fs = require('fs');
const path = require('path');

// Load the configuration file
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8'));

const charactersFilePath = path.join(__dirname, '../data/characters.json');

module.exports = {
    name: 'mary',
    description: 'Pick three random characters from the list.',
    execute(message, args) {
        // Set a 6-second delay before executing the command
        setTimeout(() => {
            // Check if the command is being run in the allowed channels
            if (!config.allowedChannels.mary.includes(message.channel.id)) {
                return;
                // return message.reply('This command can only be used in the designated channels.');
            }

            // Read characters from file
            let charactersData;
            try {
                charactersData = JSON.parse(fs.readFileSync(charactersFilePath, 'utf8'));
            } catch (error) {
                console.error('Error reading characters file:', error);
                return message.reply('There was an error reading the characters list.');
            }

            if (charactersData.characters.length < 3) {
                return message.reply('Not enough characters available in the list.');
            }

            // Pick three unique random characters
            const randomCharacters = [];
            while (randomCharacters.length < 3) {
                const randomIndex = Math.floor(Math.random() * charactersData.characters.length);
                const randomCharacter = charactersData.characters[randomIndex];
                if (!randomCharacters.includes(randomCharacter)) {
                    randomCharacters.push(randomCharacter);
                }
            }

            // Send the selected characters
            const characterNames = randomCharacters.map(character => character.name).join(', ');
            message.channel.send(`Would you fuck, marry, or kill **${characterNames}?**`);
        }, 2000); // 6000 milliseconds = 6 seconds
    },
};
