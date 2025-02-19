const fs = require('fs');
const path = require('path');

let sentBatPictures = []; // Array to track sent bat pictures

module.exports = {
    name: 'bat',
    description: 'Posts a random picture of a cute bat.',
    category: 'Misc',
    execute(message, args) {
        const dataPath = path.join(__dirname, '../data/batPictures.json');
        let batData;
        try {
            batData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } catch (error) {
            console.error('Error reading bat pictures file:', error);
            return message.reply('An error occurred while reading the bat pictures file.');
        }

        const batPictures = batData.batPictures;

        // Filter out already sent bat pictures
        let availableBatPictures = batPictures.filter(picture => !sentBatPictures.includes(picture));

        // If all bat pictures have been sent, reset the sentBatPictures array
        if (availableBatPictures.length === 0) {
            sentBatPictures = [];
            availableBatPictures = batPictures;
        }

        // Select a random bat picture from available ones
        const randomIndex = Math.floor(Math.random() * availableBatPictures.length);
        const randomBatPicture = availableBatPictures[randomIndex];

        // Send the random bat picture
        message.channel.send(randomBatPicture);

        // Record the sent bat picture
        sentBatPictures.push(randomBatPicture);
    },
};
