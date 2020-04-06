import db from '../Database';
import { STRING, JSONB } from 'sequelize';

const Settings = db.database.define('settings', {
  guildID: {
    type: STRING,
    primaryKey: true,
    allowNull: false,
  },
  settings: {
    type: JSONB,
    allowNull: false,
  },
});

export default Settings;
