const fs = require('fs');
const path = require('path');
const threadsFile = path.join(__dirname, '..', 'data', 'threads.json');

module.exports = {
    name: 'activethreadsedit',
    description: 'Allows you to add, remove, or move your list of threads.',
    execute(message, args) {
        const userId = message.author.id;

        // Load existing thread data
        let threadsData;
        try {
            threadsData = JSON.parse(fs.readFileSync(threadsFile, 'utf8'));
        } catch (error) {
            console.error('Error reading threads file:', error);
            return message.channel.send('An error occurred editing your threads.');
        }

        // Initialize user data if not present
        if (!threadsData[userId]) {
            threadsData[userId] = { active: [], paused: [], planned: [], completed: [] };
        }

        const [action, type] = args;
        const threadContent = args.slice(2).join(' ');

        // Validate action and type
        if (!['add', 'remove', 'move'].includes(action) || !['active', 'paused', 'planned', 'completed'].includes(type)) {
            return message.channel.send('Invalid format. Use `!activethreadsedit add/remove/move type thread_content`');
        }

        // Handle the add action
        if (action === 'add') {
            if (['active', 'paused', 'planned'].includes(type)) {
                threadsData[userId][type].push(threadContent);
                message.channel.send(`Added to ${type} threads: ${threadContent}`);
            } else if (type === 'completed') {
                const [threadLink, arc] = threadContent.split(' | ');
                threadsData[userId].completed.push({ thread: threadLink.trim(), arc: arc ? arc.trim() : 'N/A' });
                message.channel.send(`Added to completed threads: ${threadLink} (Arc: ${arc || 'N/A'})`);
            }
        }

        // Handle the remove action
        if (action === 'remove') {
            if (['active', 'paused', 'planned'].includes(type)) {
                threadsData[userId][type] = threadsData[userId][type].filter(t => t !== threadContent);
                message.channel.send(`Removed from ${type} threads: ${threadContent}`);
            } else if (type === 'completed') {
                const threadLink = threadContent.split(' | ')[0].trim();
                threadsData[userId].completed = threadsData[userId].completed.filter(t => t.thread !== threadLink);
                message.channel.send(`Removed from completed threads: ${threadLink}`);
            }
        }

        // Handle the move action
        if (action === 'move' && type === 'completed') {
            // Move thread from active to completed
            threadsData[userId].active = threadsData[userId].active.filter(t => t !== threadContent);
            const [threadLink, arc] = threadContent.split(' | ');
            threadsData[userId].completed.push({ thread: threadLink.trim(), arc: arc ? arc.trim() : 'N/A' });
            message.channel.send(`Moved to completed threads: ${threadLink} (Arc: ${arc || 'N/A'})`);
        }

        // Save updated data
        try {
            fs.writeFileSync(threadsFile, JSON.stringify(threadsData, null, 2));
            console.log('Updated threads data saved.');
        } catch (error) {
            console.error('Error saving threads data:', error);
            return message.channel.send('An error occurred while saving your thread data.');
        }
    },
};
