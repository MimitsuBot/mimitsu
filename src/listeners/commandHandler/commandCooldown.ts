import { Listener } from "discord-akairo";
import moment from "moment";

export default class CooldownListener extends Listener {
  public constructor() {
    super("commandCooldown", {
      event: "commandCooldown",
      emitter: "commandHandler",
      category: "commandHandler"
    });
  }

  public exec(message, command, remaining) {
    const formattedCooldown = (moment.duration(remaining) as any).format(
      "s[s]"
    );

    return message.channel.send(
      `<:time:691720402803753011> Calm down buddy! You need to wait **${formattedCooldown}** before using this command again.`
    );
  }
}
