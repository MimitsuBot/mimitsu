import Route from '../structures/Route';
import FileUtils from '../utils/FileUtils';
import chalk from 'chalk';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

module.exports = class HTTPLoader {
  constructor(client) {
    this.client = client;

    this.httpServer = null;
    this.httpRoutes = [];
  }

  async load() {
    try {
      await this.initializeHTTPServer();
      this.client.httpServer = this.app;
      this.client.httpRoutes = this.httpRoutes;
    } catch (err) {
      console.error(err);
    }
  }

  initializeHTTPServer(port = process.env.PORT || 3333) {
    this.app = express();
    
    this.app.use(cors())
    this.app.use(express.json());

    this.app.use(
      morgan(
        `${chalk.cyan('[HTTP]')} ${chalk.green(
          ':method :url - IP :remote-addr - Code :status - Size :res[content-length] B - Handled in :response-time ms'
        )}`
      )
    );

    this.app.listen(port, () => {
      this.client.log(`Service is now running on port ${port}`, {
        tags: ['HTTP'],
        color: 'green',
      });
    });

    this.initializeRoutes();
  }

  // Routes

  /**
   * Initialize all HTTP routes
   * @param {string} dirPath - Path to routes directory
   */
  initializeRoutes(dirPath = 'src/http/api') {
    let success = 0;
    let failed = 0;
    return FileUtils.requireDirectory(dirPath, NewRoute => {
      if (Object.getPrototypeOf(NewRoute) !== Route) return;

      this.addRoute(new NewRoute(this.client)) ? success++ : failed++;
    }).then(() => {
      if (failed)
        this.client.error(`${success} HTTP routes loaded, ${failed} failed.`);
      else
        this.client.log(`All ${success} HTTP routes loaded without errors.`, {
          tags: ['HTTP'],
          color: 'green',
        });
    });
  }

  /**
   * Add a new Route
   * @param {Route} route - Route to be added
   */
  addRoute(route) {
    if (!(route instanceof Route)) {
      console.error(`${route} failed to load. Not an intance of Route.`);
      return false;
    }

    route._register(this.app);
    this.httpRoutes.push(route);
    return true;
  }
};
