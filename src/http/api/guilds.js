import Route from '../../structures/Route';

import { Router } from 'express';

module.exports = class Guilds extends Route {
  constructor(client) {
    super(
      {
        name: 'guilds',
      },
      client
    );
  }

  register(app) {
    const router = Router();

    /* 
      app.get('/statistics', (_, res) => {
    return res.status(200).json({
      serverCount: client.guilds.cache.size,
      userCount: client.users.cache.size,
      uptime: process.uptime() * 1000,
    });
  });
    */

    // Guild Information

    router.get('/:id', async (req, res) => {
      const guild = this.client.guilds.cache.get(req.params.id);

      if (guild) {
        const { id, name, icon, members } = guild;

        return res.status(200).json({
          id,
          icon,
          name,
          totalMembers: members.cache.size,
        });
      } else {
        return res.status(400).json({ success: false });
      }
    });

    router.post('/update/:id', async (req, res) => {
      const guild = this.client.guilds.cache.get(req.params.id);

      if (guild) {
        return res.status(200).json({ modules: req.body }); // WIP
      }

      return res.status(400).json({ success: false });
    });

    app.use(this.path, router);
  }
};
