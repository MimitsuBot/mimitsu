import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client',
    });
  }

  exec() {
    this.client.log('Connection between discord has been estabilished.', {
      tags: ['Discord'],
      color: 'blueBright',
    });

    const presences = [
      {
        name: '@Mimitsu help',
        type: 'LISTENING',
      },
      {
        name: `I have a lot of cows to take care of.`,
        type: 'LISTENING',
      },
      {
        name: `With my hamsters`,
        type: 'PLAYING',
      },
    ];

    setInterval(() => {
      const presence = presences[Math.floor(Math.random() * presences.length)];

      this.client.user?.setPresence({
        activity: { name: presence.name, type: presence.type },
        status: 'dnd',
      });
    }, 60 * 1000);
  }
}
