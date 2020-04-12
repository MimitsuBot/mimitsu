import Route from '../../structures/Route';

import { Router } from 'express';

module.exports = class Bot extends Route {
  constructor(client) {
    super(
      {
        name: 'bot',
      },
      client
    );
  }

  register(app) {
    const router = Router();

    router.get('/statistics', (request, response) => {
      const guilds = this.client.guilds.cache.size
      const users = this.client.users.cache.size
      const channels  = this.client.channels.size

      return { guilds, users, channels }
    });

    app.use(this.path, router);
  }
};
