const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    name: 'addasset',
    description: 'Uploads an asset and stores it in the assets/misc directory.',
    category: 'Utility',
    async execute(message) {
        // Define paths for assets directory, misc subdirectory, and assets.json file
        const assetsDir = path.join(__dirname, '../assets');
        const miscDir = path.join(assetsDir, 'misc');
        const assetsJsonPath = path.join(assetsDir, 'assets.json');

        try {
            // Ensure the assets directory exists
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir);
            }

            // Ensure the misc directory exists
            if (!fs.existsSync(miscDir)) {
                fs.mkdirSync(miscDir);
            }

            // Check if an attachment is present in the message
            if (message.attachments.size === 0) {
                return message.reply('Please attach a file to upload.');
            }

            const attachment = message.attachments.first();
            const fileName = `${Date.now()}-${attachment.name}`;
            const filePath = path.join(miscDir, fileName);

            // Download and save the attached file using axios
            const response = await axios({
                url: attachment.url,
                method: 'GET',
                responseType: 'stream',
            });

            // Pipe the download stream into a file
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            // Wait for the download to finish
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Prepare the asset data to be stored in assets.json
            const assetData = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                fileName: fileName,
                filePath: `misc/${fileName}`,
                uploadedBy: message.author.username,
                uploadedAt: new Date().toISOString(),
            };

            // Read existing assets from assets.json or create a new file
            let assetsData = [];
            if (fs.existsSync(assetsJsonPath)) {
                assetsData = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8'));
            }

            // Add the new asset data
            assetsData.push(assetData);

            // Save the updated assets data back to assets.json
            fs.writeFileSync(assetsJsonPath, JSON.stringify(assetsData, null, 2), 'utf8');

            // Respond to the user confirming the upload
            message.reply(`Asset "${attachment.name}" uploaded successfully to the misc directory.`);

        } catch (error) {
            console.error('Error handling asset upload:', error);
            message.reply('An error occurred while uploading the asset.');
        }
    },
};
