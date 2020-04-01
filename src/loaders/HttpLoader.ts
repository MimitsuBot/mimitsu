import { AkairoClient } from 'discord-akairo';
import Routes from '../http/';

import express from 'express';
import cors from 'cors';

interface AppInterface {
  use: Function;
  listen: Function;
}

export default class HttpLoader {
  client: AkairoClient;
  app: AppInterface;

  public constructor(client: AkairoClient) {
    this.client = client;
  }

  public async load() {
    try {
      if (process.env.INITIALIZE_HTTP === 'false') return;
      await this.initializeHTTPServer();
    } catch (err) {
      console.error(err);
    }
  }

  public async initializeHTTPServer(port = process.env.PORT) {
    if (!port) {
      return console.log(
        'Server not started. Required environment variable "PORT" is not set.',
      );
    }

    this.app = express();

    this.app.use(cors());
    this.app.use(express.json());

    this.app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });

    Routes(this.app, this.client);
  }
}
