export default function initialize(app, client) {
  // Statistics
  app.get('/statistics', (_, res) => {
    res.status(200).json({
      serverCount: client.guilds.cache.size,
      userCount: client.users.cache.size,
      uptime: process.uptime() * 1000,
    });
  });

  // Specific Guild Information

  app.get('/guild_info/:id', async (req, res) => {
    const guild = client.guilds.cache.get(req.params.id);

    if (guild) {
      const { id, name, icon, members } = guild;

      return res.status(200).json({
        id,
        icon,
        name,
        totalMembers: members.cache.size,
      });
    } else {
      res.status(400).json({ error: 'Guild not found' });
    }
  });
}
