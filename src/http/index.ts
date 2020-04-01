export default function initialize(app, client) {
  app.get('/guilds_size', (_, res) => {
    const guilds = client.guilds.cache.size;
    return res.status(200).json({ guilds });
  });

  app.get('/users_size', (_, res) => {
    const users = client.users.cache.size;
    return res.status(200).json({ users });
  });
}
