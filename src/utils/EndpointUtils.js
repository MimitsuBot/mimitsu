import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const BASE_API_URL = 'https://discordapp.com/api';

module.exports = class EndpointUtils {
  static authenticate({ client }, adminOnly = false, fetchGuilds = false) {
    return async (req, res, next) => {
      const authorization = req.get('Authorization');

      if (authorization) {
        const [identifier, token] = authorization.split(' ');
        if (!identifier || !token)
          return res.status(400).json({ success: false });

        switch (identifier) {
          case 'User':
            if (!adminOnly) {
              try {
                const { accessToken } = jwt.verify(
                  token,
                  process.env.JWT_SECRET
                );
                req.user = await this.fetchUser(client, accessToken);
                if (fetchGuilds)
                  req.guilds = await this.fetchGuilds(client, accessToken);
                return next();
              } catch (e) {
                return res.status(401).json({ success: false });
              }
            }
            break;
          case 'Admin':
            if (token === process.env.ADMIN_TOKEN) {
              req.isAdmin = true;
              return next();
            }
        }
        return res.status(401).json({ success: false });
      }
      return res.status(400).json({ success: false });
    };
  }

  static async fetchUser(accessToken) {
    return this._request('/users/@me', accessToken);
  }

  static async fetchGuilds(client, accessToken) {
    return this._request('/users/@me/guilds', accessToken).then(gs => {
      gs.map(g => {
        g.common = client.guilds.has(g.id);
        return g;
      });
    });
  }

  static async _request(endpoint, accessToken) {
    if (!accessToken) {
      throw new Error('You need to provide a valid token.');
    }

    return fetch(`${BASE_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(res => (res.success ? res.json() : Promise.reject(res)));
  }

  static async handleUser({ client }) {
    return (req, res, next) => {
      let { userId } = req.params;

      if (!userId) {
        return res
          .status(401)
          .json({ error: 'You must provide a valid userID' });
      }

      switch (userId) {
        case '@me':
          userId = req.isAdmin ? client.user.id : req.user.id;
          break;
        default:
          if (!req.isAdmin && userId !== req.user.id) {
            return res.status(403).json({ error: 'Missing permissions' });
          }
      }

      req.userId = userId;

      return next();
    };
  }

  static async handleGuild({ client }, permissions = 'MANAGE_GUILD') {
    return async (req, res, next) => {
      const { guildId } = req.params;

      if (!guildId) {
        return res
          .status(401)
          .json({ error: 'You must provide a valid guildID' });
      }

      const guild = client.guilds.cache.get(guildId);

      if (!guild) return res.status(400).json({ success: false });

      if (!req.isAdmin) {
        const member = await guild.members.cahe.fetch(req.user.id);

        if (!member || (permissions && !member.hasPermission(permissions))) {
          return res.status(403).json({ error: 'Missing permissions' });
        }
      }

      req.guildId = guildId;

      return next();
    };
  }
};
