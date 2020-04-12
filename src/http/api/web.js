import Route from '../../structures/Route';
import EndpointUtils from '../../utils/EndpointUtils';

import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { Router } from 'express';
import { URLSearchParams } from 'url';

const API_URL = 'https://discordapp.com/api';

module.exports = class WebRoute extends Route {
  constructor(client) {
    super(
      {
        name: 'web',
      },
      client
    );
  }

  register(app) {
    const router = Router();

    // Login
    router.get('/login', async (req, res) => {
      const { code } = req.query;

      if (!code) {
        return res
          .status(400)
          .json({ error: 'You must provide a valid authentication code' });
      }

      try {
        const {
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          token_type: tokenType,
          scope,
        } = await this._exchangeCode(code);
        
        console.log(accessToken)

        return res.json({
          token: jwt.sign(
            {
              accessToken,
              refreshToken,
              expiresIn,
              expiresAt: Date.now() + expiresIn * 1000,
              tokenType,
              scope,
            },
            process.env.JWT_SECRET
          ),
        });
      } catch (err) {
        console.error(err);

        return res
          .status(403)
          .json({ error: "Couldn't validate authentication code." });
      }
    });

    // @me
    router.get(
      '/@me',
      EndpointUtils.authenticate(this, false, true),
      (req, res) => {
        return res.json({ user: req.user, guilds: req.guilds });
      }
    );

    app.use(this.path, router);
  }

  _request(endpoint, token) {
    if (!token) {
      throw new Error('You must provide a valid authentication token');
    }

    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());
  }

  _exchangeCode(code) {
    return this._tokenRequest({ code, grant_type: 'authorization_code' });
  }

  _refreshToken (refreshToken) {
    return this._tokenRequest({ refresh_token: refreshToken, grant_type: 'refresh_token' })
  }

  _tokenRequest(params = {}) {
    const data = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'guilds identify',
      ...params,
    });

    return fetch(`${API_URL}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data,
    }).then(res => res.ok ? res.json() : Promise.reject(res));
  }
};
