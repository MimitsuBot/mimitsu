import { Command } from 'discord-akairo';
import MimitsuEmbed from '../../structures/MimitsuEmbed';

export default class Farm extends Command {
  constructor() {
    super('farm', {
      aliases: ['farm', 'resources'],
      category: 'rpg',
    });
  }

  async exec(message) {
    const embed = new MimitsuEmbed(
      'All of your farm resources are listed here.'
    )
      .setAuthor('Resources', message.author.displayAvatarURL())
      .setDescriptionFromBlockArray([
        ['You can get more resources by executing **m!<resource>**.'],
      ])
      .addField('🎣 Fishes', '3', true)
      .addField('<:logs:691446083577970728> Logs', '0', true)
      .addField('<:rock:691447340141117451> Rocks', '3', true);
    message.channel.send(embed);
  }
}
