import Sequelize from 'sequelize';

const database = new Sequelize(
  'postgres://zwgwqjaz:fkSRl_5YbsdOcShdVTEejqOOXf8-Q5u5@tuffi.db.elephantsql.com:5432/zwgwqjaz',
  { logging: false },
);

export default class Database {
  static get database() {
    return database;
  }

  public static async authenticate() {
    try {
      await database.authenticate();
      console.log(
        '[Postgres] Connection to database has been established successfully.',
      );
    } catch (err) {
      console.error('[Postgres] Unable to connect to the database:');
      console.error(`[Postgres] ${err}`);
    }
  }
}
