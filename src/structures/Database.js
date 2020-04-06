import { Sequelize } from 'sequelize';
import 'dotenv/config';
import chalk from 'chalk';

const database = new Sequelize(process.env.POSTGRES_URL, { logging: false });

export default class Database {
  static get database() {
    return database;
  }

  static async authenticate() {
    try {
      await database.authenticate();

      console.log(
        `${chalk.cyan(['Postgres'])} ${chalk.blueBright(
          'Connection to database has been established successfully'
        )}`
      );
    } catch (err) {
      console.error('[Postgres] Unable to connect to the database:');
      console.error(`[Postgres] ${err}`);
    }
  }
}
