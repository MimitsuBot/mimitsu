import Database from './structures/Database';
import SettingsProvider from './structures/SettingsProvider';
import Setting from './structures/models/settings';

import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { init } from '@sentry/node';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    settings: any;
    setup: any;
  }
}

export default class MimitsuClient extends AkairoClient {
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: './src/commands/',
    prefix: message =>
      this.settings.get(message.guild.id, 'prefix', ['m!', 'mimitsu ']),
    allowMention: true,
    fetchMembers: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    commandUtilSweepInterval: 9e5,
    handleEdits: true,
  });

  public inhibitorHandler = new InhibitorHandler(this, {
    directory: './src/inhibitors',
  });

  public listenerHandler = new ListenerHandler(this, {
    directory: './src/listeners',
  });

  public constructor() {
    super(
      {
        ownerID: ['532294395655880705'],
      },
      {
        messageCacheMaxSize: 50,
        messageCacheLifetime: 300,
        messageSweepInterval: 900,
        partials: ['MESSAGE'],
      },
    );

    this.settings = new SettingsProvider(Setting);

    this._init();

    if (process.env.SENTRY) {
      init({ dsn: process.env.SENTRY });
    }
  }

  private async _init() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(token: string = process.env.DISCORD_TOKEN) {
    await Database.authenticate();
    await this.settings.init();
    return this.login(token);
  }
}
