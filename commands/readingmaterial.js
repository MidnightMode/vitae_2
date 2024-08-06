const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY; // Store your API key in an environment variable

let lastRecommendedBookId = null; // Variable to store the ID of the last recommended book

module.exports = {
    name: 'readingmaterial',
    description: 'Displays a book about or featuring vampires.',
    async execute(message) {
        const query = 'vampire';

        try {
            // Fetch books from Google Books API
            const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: query,
                    key: GOOGLE_BOOKS_API_KEY,
                    maxResults: 10 // Increase the number of results to reduce the chance of duplicates
                }
            });

            const books = data.items;

            if (!books || books.length === 0) {
                return message.reply('No vampire-related books found.');
            }

            // Filter out the last recommended book if it exists in the new list
            const filteredBooks = books.filter(book => book.id !== lastRecommendedBookId);

            if (filteredBooks.length === 0) {
                // If all books are filtered out, just use the original list
                filteredBooks.push(...books);
            }

            // Select a random book from the filtered list
            const randomBook = filteredBooks[Math.floor(Math.random() * filteredBooks.length)];
            const volumeInfo = randomBook.volumeInfo;
            const title = volumeInfo.title.length > 256 ? volumeInfo.title.substring(0, 253) + '...' : volumeInfo.title;
            const description = volumeInfo.description || 'No description available.';

            // Split the description into sentences and join the first 2-3 sentences
            const sentences = description.match(/[^\.!\?]+[\.!\?]+/g);
            const shortDescription = sentences ? sentences.slice(0, 3).join(' ').trim() : description;

            // Truncate if necessary
            const truncatedDescription = shortDescription.length > 1024 ? shortDescription.substring(0, 1021) + '...' : shortDescription;

            // Create an embed message to display the book info
            const embed = new EmbedBuilder()
                .setTitle('Vampire Book Recommendation')
                .setColor('#FF0000')
                .setTimestamp()
                .addFields({
                    name: title,
                    value: `${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}\n\n${truncatedDescription}`,
                    inline: false
                });

            if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
                embed.setImage(volumeInfo.imageLinks.thumbnail);
            }

            // Send the embed message to the channel
            await message.channel.send({ embeds: [embed] });

            // Update the last recommended book ID
            lastRecommendedBookId = randomBook.id;
        } catch (error) {
            console.error('Error fetching book information:', error);
            message.reply('An error occurred while fetching book information.');
        }
    },
};

