const fs = require('fs');
const path = require('path');
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all commands or info about a specific command.',
    execute(message, args) {
        const helpFilePath = path.join(__dirname, '../data/help.json');

        fs.readFile(helpFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading help file:', err);
                return message.channel.send('There was an error retrieving the help information.');
            }

            try {
                const helpData = JSON.parse(data);
                let helpMessage = '';

                if (!args.length) {
                    // If no specific category is provided, list all categories
                    helpMessage = 'Here are the available categories:\n\n';
                    helpData.categories.forEach(category => {
                        helpMessage += `**${prefix}help !${category.name.toLowerCase()}**: ${category.description}\n\n`;
                    });
                } else {
                    // Find the category based on the argument
                    const categoryArg = args[0].toLowerCase().substring(1); // Remove the '!' prefix
                    const category = helpData.categories.find(cat => cat.name.toLowerCase() === categoryArg);

                    if (!category) {
                        return message.channel.send(`Category ${args[0]} not found.`);
                    }

                    helpMessage = `**${category.name} Commands**\n\n`;

                    category.commands.forEach(command => {
                        helpMessage += `**${command.name}**: ${command.description}\n`;
                        helpMessage += `  Usage: \`${command.usage}\`\n`;
                        helpMessage += `  Example: \`${command.example.replace('!!', prefix)}\`\n\n`;
                    });
                }

                message.channel.send(helpMessage);
            } catch (error) {
                console.error('Error parsing help file:', error);
                message.channel.send('There was an error parsing the help information.');
            }
        });
    },
};
