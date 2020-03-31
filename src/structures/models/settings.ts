import db from "../Database";
import Sequelize from "sequelize";

const Settings = db.database.define("settings", {
  guildID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  settings: {
    type: Sequelize.JSONB,
    allowNull: false,
    default: {}
  }
});

export default Settings;
