import Database from './structures/Database';
import SettingsProvider from './structures/SettingsProvider';
import Setting from './structures/models/settings';
import Loaders from './loaders/';

import chalk from 'chalk';

import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { init } from '@sentry/node';

export default class MimitsuClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: ['532294395655880705'],
      },
      {
        messageCacheMaxSize: 50,
        messageCacheLifetime: 300,
        messageSweepInterval: 900,
        partials: ['MESSAGE'],
      }
    );

    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands/',
      prefix: message =>
        this.settings.get(message.guild?.id, 'prefix', ['m!', 'mimitsu ']),
      allowMention: true,
      fetchMembers: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      commandUtilSweepInterval: 9e5,
      handleEdits: true,
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: './src/inhibitors',
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners',
    });

    this.settings = new SettingsProvider(Setting);

    if (process.env.SENTRY) {
      init({ dsn: process.env.SENTRY });
    }
  }

  async _init() {
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

    this.initializeLoaders();
  }

  async initializeLoaders() {
    for (let Loader in Loaders) {
      let loader = new Loaders[Loader](this);

      try {
        await loader.load();
      } catch (err) {
        console.error(err);
      }
    }
  }

  log(message, { tags, color = 'white' }) {
    console.log(...tags.map(t => chalk.cyan(`[${t}]`)), chalk[color](message));
  }

  logError(...args) {
    const tags = args.length > 1 ? args.slice(0, -1).map(t => `[${t}]`) : [];
    console.error('[Error]', ...tags, args[args.length - 1]);
  }

  async start(token = process.env.DISCORD_TOKEN) {
    await Database.authenticate();
    await this.settings.init();

    this._init();
    return this.login(token);
  }
}
