const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../config.json'); // Ensure this path is correct

module.exports = {
    name: 'movienight',
    description: 'Generates a poll for selecting vampire movies',
    async execute(message, args) {
        // Ensure command is used in the correct channel
        if (message.channel.id !== config.modBotsChannelId) {
            console.log(`Command !movienight issued in wrong channel: ${message.channel.id}`);
            return message.reply('This command can only be used in the mod-bots channel.');
        }

        // Fetch vampire movies from TMDb API
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    query: 'vampire',
                    language: 'en-US',
                    page: 1,
                    include_adult: false
                }
            });
            const movies = response.data.results;

            // Filter movies to include only those with cover art
            const moviesWithCoverArt = movies.filter(movie => movie.poster_path);

            if (moviesWithCoverArt.length < 3) {
                console.log('Not enough movies with cover art found.');
                return message.reply('Not enough vampire movies with cover art found.');
            }

            // Select 3 unique movies
            const selectedMovies = [];
            while (selectedMovies.length < 3) {
                const randomIndex = Math.floor(Math.random() * moviesWithCoverArt.length);
                const randomMovie = moviesWithCoverArt[randomIndex];
                if (!selectedMovies.includes(randomMovie)) {
                    selectedMovies.push(randomMovie);
                }
            }

            const pollChannel = message.client.channels.cache.get(config.pollChannelId);

            if (!pollChannel) {
                console.log('Poll channel not found.');
                return message.reply('Poll channel not found.');
            }

            const movieMessages = [];
            for (let i = 0; i < selectedMovies.length; i++) {
                const movie = selectedMovies[i];
                const embed = new EmbedBuilder()
                    .setTitle(`${i + 1}️⃣ ${movie.title}`)
                    .setDescription(movie.overview || 'No description available.')
                    .setImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
                    .setColor('#00FF00')
                    .setFooter({ text: 'React with the corresponding number to vote' });

                const msg = await pollChannel.send({ embeds: [embed] });
                movieMessages.push(msg);
                await msg.react(`${i + 1}️⃣`);
            }

            console.log('Poll created! React to vote.');

            // Default poll duration in seconds (1 minute here)
            let pollDuration = parseInt(args[0]) || 60;
            const closingNotificationTime = 10; // Notify 10 seconds before closing

            // Countdown logic
            const countdown = setInterval(() => {
                console.log(`Poll closing in ${pollDuration} seconds...`);
                pollDuration--;

                if (pollDuration === closingNotificationTime) {
                    pollChannel.send(`Poll will close in ${closingNotificationTime} seconds!`);
                }

                if (pollDuration <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);

            // Collect reactions for each movie card
            const collectors = movieMessages.map(msg => {
                const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && !user.bot;
                return msg.createReactionCollector({ filter, time: pollDuration * 1000 });
            });

            const votes = {
                '1️⃣': 0,
                '2️⃣': 0,
                '3️⃣': 0
            };

            const updateVotes = () => {
                movieMessages.forEach(msg => {
                    msg.reactions.cache.forEach(reaction => {
                        if (votes[reaction.emoji.name] !== undefined) {
                            votes[reaction.emoji.name] = (votes[reaction.emoji.name] || 0) + reaction.count - 1; // Subtract bot's reaction
                        }
                    });
                });
                console.log('Votes updated:', votes);
            };

            // Use a single collector to manage the end of all individual collectors
            const allCollectors = Promise.all(collectors.map(collector => new Promise(resolve => {
                collector.on('collect', (reaction, user) => {
                    console.log(`${user.tag} reacted with ${reaction.emoji.name}`);
                    updateVotes(); // Update votes on each reaction
                });

                collector.on('remove', (reaction, user) => {
                    console.log(`${user.tag} removed their reaction ${reaction.emoji.name}`);
                    updateVotes(); // Update votes when a reaction is removed
                });

                collector.on('end', () => {
                    resolve(); // Resolve the promise when this collector ends
                })
            })));

            allCollectors.then(() => {
                console.log('All collectors ended.');

                let winner = null;
                let maxVotes = 0;

                // Determine the movie with the most votes
                for (const [emoji, count] of Object.entries(votes)) {
                    if (count > maxVotes) {
                        maxVotes = count;
                        winner = selectedMovies[['1️⃣', '2️⃣', '3️⃣'].indexOf(emoji)];
                    }
                }

                if (winner) {
                    // Create a simple embed with the winning movie's title and cover art
                    const resultsEmbed = new EmbedBuilder()
                        .setTitle('The selected movie is:')
                        .setDescription(winner.title)
                        .setImage(`https://image.tmdb.org/t/p/w500${winner.poster_path}`)
                        .setColor('#00FF00');

                    pollChannel.send({ embeds: [resultsEmbed] });
                    console.log('Poll results sent!');
                } else {
                    pollChannel.send('No votes were cast or there was an issue determining the winner.');
                }
            }).catch(error => {
                console.error('Error in finalizing results:', error);
                message.reply('An error occurred while finalizing the poll results.');
            });

        } catch (error) {
            console.error('Error fetching movie information:', error);
            message.reply('An error occurred while fetching movie information.');
        }
    },
};



// 