import { MessageEmbed } from 'discord.js';

export default class MimitsuEmbed extends MessageEmbed {
  constructor(author = null, data = {}) {
    super(data);

    this.setColor(process.env.EMBED_COLOR).setTimestamp();
    if (author) this.setFooter(author.tag);
  }

  setDescriptionFromBlockArray(blocks) {
    this.description = blocks
      .map(lines => lines.filter(l => !!l).join('\n'))
      .filter(b => !!b.length)
      .join('\n\n');
    return this;
  }
}
