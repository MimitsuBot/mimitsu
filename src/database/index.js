import { Sequelize } from 'sequelize';
import 'dotenv/config';
import chalk from 'chalk';

if (!process.env.DATABASE_URL) {
  return console.error(
    `${chalk.cyan(['Postgres'])} ${chalk.red(
      'No enviroment variable "DATABASE_URL" was found. Set it in order to enable postgres connection'
    )}`
  );
}

const database = new Sequelize(process.env.DATABASE_URL, { logging: false });

export default class Database {
  static get database() {
    return database;
  }

  static async authenticate() {
    try {
      await database.authenticate();

      console.log(
        `${chalk.cyan('[Postgres]')} ${chalk.blueBright(
          'Connection to database has been established successfully'
        )}`
      );
    } catch (err) {
      console.error('[Postgres] Unable to connect to the database:');
      console.error(`[Postgres] ${err}`);
    }
  }
}
