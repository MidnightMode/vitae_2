const db = require('../data/db');
const reactionsItemsDb = require('../data/reactions-items-db'); 
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bat',
  description: 'Manage your pet bat!',
  category: 'Virtual Pet Bat',
  detailedDescription: `
**!bat start [name]**: Adopt a new bat".

**!bat status**: Check the current status of your bat. \`!bat start [name]\`.

**!bat feed**: Feed your bat to restore health and gain XP.

**!bat evolve** or **!bat levelup**: Evolve your bat to the next level if it has enough XP.

**!bat rename [new name]**: Give your bat a new name. 

**!bat setimage [url]**: Set a new image for your bat using the provided URL.

**!bat pet**: Increase the friendship level of your bat by petting it.

**!bat checkin**: Check-in your bat after an adventure, and receive random reactions and items.
  `,
  async execute(message, args) {
    const userId = message.author.id;

    if (args[0] === 'start') {
      const batName = args.slice(1).join(' ') || 'Unnamed Bat';
      const existingBat = db.getBatByUserId(userId);

      if (existingBat) {
        return message.channel.send(`You already have a bat named ${existingBat.name}.`);
      }

      db.insertBat(userId, batName, 100, 0, 1, Date.now(), null, 0);
      return message.channel.send(`You have adopted a new bat named ${batName}!`);
    }

    if (args[0] === 'status') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      const xpForNextLevel = (bat.level * 500);
      const remainingXp = xpForNextLevel - bat.xp;

      const statusEmbed = new EmbedBuilder()
        .setTitle(`${bat.name}'s Status`)
        .setColor('#00FF00')
        .setTimestamp()
        .setImage(bat.image_url || 'https://via.placeholder.com/150')
        .addFields(
          { name: 'Health', value: bat.health.toString(), inline: true },
          { name: 'XP', value: `${bat.xp} / ${xpForNextLevel} XP (Next Level in ${remainingXp} XP)`, inline: true },
          { name: 'Level', value: bat.level.toString(), inline: true },
          { name: 'Friendship Level', value: bat.friendship_level.toString(), inline: true }
        );

      return message.channel.send({ embeds: [statusEmbed] });
    }

    if (args[0] === 'feed') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      const timeSinceLastInteraction = Date.now() - bat.last_interaction;
      const healthGain = Math.min(100, bat.health + 10);
      const xpGain = bat.xp + Math.floor(timeSinceLastInteraction / 1000);

      db.updateBatHealth(userId, healthGain);
      db.updateBatXp(userId, xpGain);
      db.updateLastInteraction(userId, Date.now());

      return message.channel.send(`You fed ${bat.name}. Health: ${healthGain}, XP: ${xpGain}`);
    }

    if (args[0] === 'evolve' || args[0] === 'levelup') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      const xpForNextLevel = (bat.level * 500);

      if (bat.xp >= xpForNextLevel) {
        const newLevel = bat.level + 1;
        const remainingXp = bat.xp - xpForNextLevel;

        db.updateBatLevel(userId, newLevel);
        db.updateBatXp(userId, remainingXp); // Carry over remaining XP
        return message.channel.send(`${bat.name} has leveled up to ${newLevel}!`);
      } else {
        const remainingXp = xpForNextLevel - bat.xp;
        return message.channel.send(`${bat.name} needs ${remainingXp} more XP to level up.`);
      }
    }

    if (args[0] === 'rename') {
      const newName = args.slice(1).join(' ');
      if (!newName) {
        return message.channel.send('Please provide a new name for your bat.');
      }

      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      db.updateBatName(userId, newName);

      return message.channel.send(`Your bat has been renamed to ${newName}!`);
    }

    if (args[0] === 'setimage') {
      const imageUrl = args[1];
      if (!imageUrl) {
        return message.channel.send('Please provide a URL for the bat image.');
      }

      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      db.updateBatImage(userId, imageUrl);

      return message.channel.send(`Your bat's image has been updated.`);
    }

    if (args[0] === 'pet') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      const friendshipGain = bat.friendship_level + 1;
      db.updateBatFriendship(userId, friendshipGain);
      db.updateLastInteraction(userId, Date.now());

      return message.channel.send(`You petted ${bat.name}. Friendship Level: ${friendshipGain}`);
    }

    if (args[0] === 'checkin') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      // Get a random reaction and item
      const reactions = reactionsItemsDb.getReactions();
      const items = reactionsItemsDb.getItems();

      // Check if reactions and items are not empty
      if (reactions.length === 0 || items.length === 0) {
        return message.channel.send("No reactions or items available.");
      }

      // Get a random reaction and item
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];

      // Create the embed
      const checkinEmbed = new EmbedBuilder()
        .setTitle(`${bat.name} Check-In`)
        .setColor('#00FF00')
        .setDescription(`Your bat has returned from its adventures!`)
        .addFields(
          { name: 'Reaction', value: randomReaction, inline: true },
          { name: 'Item', value: randomItem.item_name, inline: true },
          { name: 'Item Description', value: randomItem.item_description || 'No description', inline: false }
        )
        .setTimestamp();

      return message.channel.send({ embeds: [checkinEmbed] });
    }
  },
};

