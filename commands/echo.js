module.exports = {
    name: 'echo',
    description: 'Replies with echo!',
    category: 'Admin',
    execute(message) {
        message.channel.send('echo!');
    },
};