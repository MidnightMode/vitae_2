const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'printstructure',
  description: 'Prints the file structure of the bot to the console, excluding node_modules.',
  category: 'Admin',
  async execute(message, args) {
    // Define the root directory (the bot's root directory)
    const rootDir = path.resolve(__dirname, '../'); // Adjust if your file structure is different

    // Function to recursively read directories and files
    function readDirectory(dirPath) {
      let result = '';
      const files = fs.readdirSync(dirPath);

      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        // Skip node_modules directory
        if (file === 'node_modules') {
          return;
        }

        if (stats.isDirectory()) {
          result += `\n${file}/`;
          result += readDirectory(filePath); // Recursively read subdirectories
        } else {
          result += `\n${file}`;
        }
      });

      return result;
    }

    // Read the root directory
    const fileStructure = readDirectory(rootDir);

    // Print the file structure to the console
    console.log(`File structure of the bot:\n${fileStructure}`);

    // Optionally, send a message to the channel confirming the operation
    message.channel.send('The file structure has been printed to the console.');
  },
};
