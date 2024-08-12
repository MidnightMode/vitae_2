const db = require('../data/db');
const { MessageAttachment, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bat',
  description: 'Manage your pet bat!',
  async execute(message, args) {
    const userId = message.author.id;

    if (args[0] === 'start') {
      const batName = args.slice(1).join(' ') || 'Unnamed Bat';
      const existingBat = db.getBatByUserId(userId);

      if (existingBat) {
        return message.channel.send(`You already have a bat named ${existingBat.name}.`);
      }

      db.insertBat(userId, batName, 100, 0, 1, Date.now(), null);
      return message.channel.send(`You have adopted a new bat named ${batName}!`);
    }

    if (args[0] === 'status') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      const statusEmbed = new EmbedBuilder()
        .setTitle(`${bat.name}'s Status`)
        .setColor('#00FF00')
        .setTimestamp()
        .setImage(bat.image_url || 'https://via.placeholder.com/150')
        .addFields(
          { name: 'Health', value: bat.health.toString(), inline: true },
          { name: 'XP', value: bat.xp.toString(), inline: true },
          { name: 'Evolution Stage', value: bat.evolution_stage.toString(), inline: true }
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

      return message.channel.send(`You fed ${bat.name}. Health: ${healthGain}, XP: ${xpGain}`);
    }

    if (args[0] === 'evolve') {
      const bat = db.getBatByUserId(userId);

      if (!bat) {
        return message.channel.send("You don't have a bat yet. Use `!bat start [name]` to adopt one.");
      }

      if (bat.xp >= 100) { // Example threshold for evolution
        const newEvolutionStage = bat.evolution_stage + 1;
        db.updateBatEvolutionStage(userId, newEvolutionStage);
        db.updateBatXp(userId, 0); // Reset XP after evolution
        return message.channel.send(`${bat.name} has evolved to stage ${newEvolutionStage}!`);
      } else {
        return message.channel.send(`${bat.name} needs more XP to evolve.`);
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
  },
};
