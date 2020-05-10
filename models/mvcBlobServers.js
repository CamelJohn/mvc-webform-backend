const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BLOB_SERVERS = sequelize.define('mvcBlobServers', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  serverName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  serverUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = BLOB_SERVERS;
