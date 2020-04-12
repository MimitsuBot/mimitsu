import Route from '../../structures/Route';

import { Router } from 'express';

module.exports = class Guilds extends Route {
  constructor(client) {
    super(
      {
        name: 'commands',
      },
      client
    );
  }

  register(app) {
    const router = Router();

    router.get('/', (request, response) => {
      const categories = this.client.commandHandler.categories.map(c => {
        return {
          name: c.categoryID,
          commands: c.category,
        };
      });

      return response.status(200).json({ categories });
    });

    app.use(this.path, router);
  }
};
