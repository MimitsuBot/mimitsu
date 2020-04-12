import { Command } from 'discord-akairo';

module.exports = class Explore extends Command {
  constructor() {
    super('explore', {
      aliases: ['explore'],
      category: 'rpg',
      cooldown: 15000,
    });
  }

  exec(message) {
    const bosses = ['Gule', 'Hjue', 'Freston'];
    const randomBoss = bosses[Math.random()];

    message.channel.send(randomBoss);
  }
};
