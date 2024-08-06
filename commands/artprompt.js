const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'artprompt',
    description: 'Generates a random art prompt for inspiration',
    execute(message) {
        console.log('artprompt command executed');

        try {
            // Load prompts from the JSON file
            const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/artprompts.json'), 'utf-8'));
            console.log('Prompts loaded:', prompts.length);

            // Load characters from the JSON file
            const charactersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/characters.json'), 'utf-8'));
            const characters = charactersData.characters;
            console.log('Characters loaded:', characters.length);

            // Select a random prompt
            let prompt = prompts[Math.floor(Math.random() * prompts.length)];
            console.log('Selected prompt:', prompt);

            // Replace placeholders in the prompt with random characters
            const characterPlaceholders = prompt.match(/\[character\d*\]/g) || [];
            console.log('Character placeholders:', characterPlaceholders);

            characterPlaceholders.forEach((placeholder, index) => {
                const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
                prompt = prompt.replace(placeholder, randomCharacter.name);
            });

            console.log('Final prompt:', prompt);
            message.channel.send(prompt);
        } catch (error) {
            console.error('Error generating art prompt: ', error);
            message.channel.send('Failed to generate art prompt. Please try again later.');
        }
    },
};
