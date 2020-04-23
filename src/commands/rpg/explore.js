import { Command } from 'discord-akairo';
import MimitsuEmbed from "../../structures/MimitsuEmbed";
const bossEmojiList = ["⚔️", "🏃"];
const exploreEmojiList = ["", "◀️"]

module.exports = class Explore extends Command {
  constructor() {
    super('explore', {
      aliases: ['explore'],
      category: 'rpg',
      cooldown: 15000,
    });
  }

  async exec(message) {
    const bosses = [
      {
        name: 'Deadeye Devious',
        image: 'https://www.tibiawiki.com.br/images/4/4f/Deadeye_Devious.gif',
        statistics: {
          life: 1450,
          exp: 500
        }
      },
      {
        name: 'Dire Penguin',
        image: 'https://www.tibiawiki.com.br/images/d/d5/Dire_Penguin.gif',
        statistics: {
          life: 173,
          exp: 119
        }
      }
    ]

    const chance = Math.random() > 0.5 ? 'fight' : 'explore';

    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];

    if (chance == "fight") {
        const embed = new MimitsuEmbed()
          .setDescription(`You've found a wild **${randomBoss.name}** while exploring, will you fight or run ?`)
          .setImage(randomBoss.image)
          .setFooter(`This boss has ${randomBoss.statistics.life}HP and rewards you ${randomBoss.statistics.exp} exp if you kill him.`);
        const msg = await message.channel.send(embed);

        for (const emoji of bossEmojiList) await msg.react(emoji);

        const filter = (reaction, user) => user.id === message.author.id;

        const collector = msg.createReactionCollector(filter, { time: 15000 });

        collector.on('collect', reaction => {
          if (msg.deletable) msg.delete()

          switch (reaction.emoji.name) {
            case bossEmojiList[0]:
              message.channel.send("You've decided to fight")
              break;
            case bossEmojiList[1]:
              message.channel.send("You've decided to run.")
              break;
          }
        })
    } else {
      const embed = new MimitsuEmbed()
        .setDescription("🗺️ | You've explored the mine and found a secret map, will you explore more or go back ?")
        .setImage("https://www.facaaspazes.com/wp-content/uploads/2018/01/mapa-do-tesouro-direto.png")
      const msg = await message.channel.send(embed)

      for (const emoji of exploreEmojiList) await msg.react(emoji)
    }
  }
};
