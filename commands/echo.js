module.exports = {
    name: 'echo',
    description: 'Replies with echo!',
    execute(message) {
        message.channel.send('echo!');
    },
};