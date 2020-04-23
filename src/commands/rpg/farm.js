import { Command } from 'discord-akairo';
import MimitsuEmbed from '../../structures/MimitsuEmbed';
const emojiList = ["📝"]

export default class Farm extends Command {
  constructor() {
    super('farm', {
      aliases: ['farm', 'resources'],
      category: 'rpg',
    });
  }

  async exec(message) {
    const embed = new MimitsuEmbed(message.author)
      .setImage("https://imgur.com/ayTtQNS")
    const embedMessage = await message.channel.send(embed)

    for (const emoji of emojiList) await embedMessage.react(emoji);
  }
}
