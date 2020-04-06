import { Command } from 'discord-akairo';

export default class Fish extends Command {
  constructor() {
    super('fish', {
      aliases: ['fish'],
      category: 'rpg',
      cooldown: 15000,
    });
  }

  exec(message) {
    const fishes = ['Dory', 'Nemo', 'Lenny', 'Mrs.Puff', 'Ariel', 'Salmon'];
    const selectedFish = fishes[Math.floor(Math.random() * fishes.length)];

    const choosenSide = Math.random() > 0.5 ? 'won' : 'lose';
    const rightMessage =
      choosenSide === 'won'
        ? `🎣 | You caught a **${selectedFish}** while fisinhg.`
        : 'Apparently the sea was not for fish today! You did not find any fish while fishing.';

    message.channel.send(rightMessage);
  }
}
