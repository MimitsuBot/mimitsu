import { Command } from 'discord-akairo';

module.exports = class Fish extends Command {
  constructor() {
    super('fish', {
      aliases: ['fish'],
      category: 'rpg',
      cooldown: 15000,
    });
  }

  exec(message) {
    const fishes = ['Dory - 13XP', 'Nemo - 24XP', 'Lenny - 14XP', 'Mrs.Puff - 7XP', 'Ariel - 31XP', 'Salmon - 27XP', 'Pufferfish - 29XP', 'Tuna - 26XP', 'Sardine - 13XP', 'Anchovy - 13XP'];
    const selectedFish = fishes[Math.floor(Math.random() * fishes.length)];

    const choosenSide = Math.random() > 0.5 ? 'won' : 'lose';
    const rightMessage =
      choosenSide === 'won'
        ? `🎣 | You caught a **${selectedFish}** while fisinhg.`
        : 'Apparently the sea was not for fish today! You did not find any fish while fishing.';

    message.channel.send(
      rightMessage
    );
  }
};
