import { Inhibitor } from 'discord-akairo';

export default class SendMessagesInhibitor extends Inhibitor {
  constructor() {
    super('sendMessages', { reason: 'sendMessages' });
  }

  exec(message) {
    if (!message.guild) return false;

    return !message.channel
      .permissionsFor(this.client.user)
      .has('SEND_MESSAGES');
  }
}
