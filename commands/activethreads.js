const fs = require('fs');
const path = require('path');
const threadsFile = path.join(__dirname, '..', 'data', 'threads.json');

module.exports = {
    name: 'activethreads',
    description: 'Displays your list of threads (active, paused, planned, and completed).',
    execute(message) {
        const userId = message.author.id;
        
        // Load thread data
        let threadsData;
        try {
            threadsData = JSON.parse(fs.readFileSync(threadsFile, 'utf8'));
        } catch (error) {
            console.error('Error reading threads file:', error);
            return message.channel.send('An error occurred retrieving your threads.');
        }

        const userThreads = threadsData[userId];
        
        if (!userThreads) {
            return message.channel.send('You have no threads listed. Use `!activethreadsedit` to add some!');
        }

        // Format the message to display the user's threads
        const threadMessage = [
            '**Your Threads**',
            `**Active Threads**:\n${userThreads.active.join('\n') || 'None'}`,
            `**Paused Threads**:\n${userThreads.paused.join('\n') || 'None'}`,
            `**Planned Threads**:\n${userThreads.planned.join('\n') || 'None'}`,
            `**Completed Threads**:\n${userThreads.completed.map(t => `${t.thread} (Arc: ${t.arc || 'N/A'})`).join('\n') || 'None'}`
        ].join('\n\n');

        message.channel.send(threadMessage);
    },
};
