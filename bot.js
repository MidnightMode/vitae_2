const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');

// Create express app for Cloud Run
const app = express();

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
const behaviorPath = path.join(__dirname, 'behaviors');
if (fs.existsSync(behaviorPath)) {
    const behaviorFiles = fs.readdirSync(behaviorPath).filter(file => file.endsWith('.js'));
    for (const file of behaviorFiles) {
        const behavior = require(`./behaviors/${file}`);
        client.behaviors.set(behavior.name, behavior);
    }
}

// Log when the bot is ready
client.once('ready', () => {
    // Start behaviors
    client.behaviors.forEach(behavior => {
        try {
            if (typeof behavior.start === 'function') {
                behavior.start(client);
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
    // Handle commands
    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (client.commands.has(commandName)) {
            const command = client.commands.get(commandName);

            try {
                await command.execute(message, args, client);
            } catch (error) {
                console.error('Error executing command:', error);
                message.reply('There was an error trying to execute that command!');
            }
        }
    }

    // Handle DMs
    if (message.channel.type === 'DM') {
        try {
            await message.channel.send('Hi! You are DMing me now!');
        } catch (error) {
            console.error('Error sending DM response:', error);
        }
    }
});

// Create a health check route for Cloud Run to ensure the service is alive
app.get('/', (req, res) => {
    res.status(200).send('Bot is running!');
});

// Start listening on the port specified by Cloud Run (or default to 8080)
const port = process.env.PORT || 8080;
app.listen(port, () => {
    // Log in to Discord once the server is up
    if (process.env.NODE_ENV !== 'production') {
        client.login(process.env.BOT_TOKEN).catch(err => {
            console.error('Error logging in:', err);
        });
    }
});
