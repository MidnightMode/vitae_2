const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create client with necessary intents and partials for DM handling
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages, // Intent to receive DMs
    ],
    partials: ['CHANNEL'], // Needed to receive DMs
});

client.commands = new Collection();
client.behaviors = new Collection();

// Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load behavior files
const behaviorFiles = fs.readdirSync(path.join(__dirname, 'behaviors')).filter(file => file.endsWith('.js'));
for (const file of behaviorFiles) {
    const behavior = require(`./behaviors/${file}`);
    client.behaviors.set(behavior.name, behavior);
}

// Log when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Start behaviors
    client.behaviors.forEach(behavior => {
        try {
            if (typeof behavior.start === 'function') {
                behavior.start(client);
                console.log(`Started behavior: ${behavior.name}`);
            } else {
                console.error(`Behavior ${behavior.name} does not have a start function.`);
            }
        } catch (error) {
            console.error(`Failed to start behavior: ${behavior.name}`, error);
        }
    });
});

// Handle messages
client.on('messageCreate', async message => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Handle commands
    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (client.commands.has(commandName)) {
            const command = client.commands.get(commandName);

            // Log command usage details
            const userRoles = message.member?.roles?.cache?.map(role => role.name).join(', ') || 'No roles';
            console.log(`Command received: !${commandName} by ${message.author.tag}`);
            console.log(`User ID: ${message.author.id}`);
            console.log(`Roles: ${userRoles}`);
            console.log(`Command: !${commandName} ${args.join(' ')}`);

            try {
                await command.execute(message, args, client);
                console.log(`Successfully executed command: !${commandName} by ${message.author.tag}`);
            } catch (error) {
                console.error('Error executing command:', error);
                message.reply('There was an error trying to execute that command!');
            }
        } else {
            message.channel.send(`Invalid command: ${commandName}. Use !help to see the list of available commands.`);
        }
    }

    // Handle DMs
    if (message.channel.type === 'DM') {
        console.log(`Received DM from ${message.author.tag}: ${message.content}`);
        try {
            await message.channel.send('Hi! You are DMing me now!');
            console.log(`Replied with 'Hi! You are DMing me now!' to ${message.author.tag}`);
        } catch (error) {
            console.error('Error sending DM response:', error);
        }
    }
});



// Login to Discord with the bot token
client.login(process.env.BOT_TOKEN);

