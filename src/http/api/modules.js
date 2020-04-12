import Route from '../../structures/Route';

import { Router } from 'express';

module.exports = class Modules extends Route {
  constructor(client) {
    super(
      {
        name: 'modules',
      },
      client
    );
  }

  register(app) {
    const router = Router();

    router.get('/:guildID/:modName', (request, response) => {
      const { guildID, modName } = request.params
      const { defaultValue } = request.query;

      return this.client.settings.get(guildID, modName, defaultValue)
    });

    app.use(this.path, router);
  }
};
