const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions, // Add this intent
    ]
});

client.commands = new Collection();

// Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Command handling
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Log who sent the command and what the command was
        console.log(`Command received from ${message.author.username} (${message.author.id}): !${commandName} ${args.join(' ')}`);

        if (client.commands.has(commandName)) {
            const command = client.commands.get(commandName);

            try {
                await command.execute(message, args);
                console.log(`Successfully executed command: !${commandName} by ${message.author.username}`);
            } catch (error) {
                console.error('Error executing command:', error);
                message.reply('There was an error trying to execute that command!');
            }
        } else {
            message.channel.send(`Invalid command: ${commandName}. Use !help to see the list of available commands.`);
        }
    }
});

client.login(process.env.BOT_TOKEN);
