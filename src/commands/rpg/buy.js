import { Command } from 'discord-akairo';
import MimitsuEmbed from '../../structures/MimitsuEmbed';

module.exports = class Buy extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy', 'shop'],
      category: 'rpg',
    });
  }

  exec(message) {
    const embed = new MimitsuEmbed("Use m!buy <fishing pole> to buy a fishing pole")
      .setTitle('Fishing Poles')
      .setImage("https://prnt.sc/rxxabr")
    message.channel.send(embed);
  }
};
