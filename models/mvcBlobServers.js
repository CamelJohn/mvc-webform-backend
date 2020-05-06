const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BlobServers = sequelize.define('mvcBlobServers', {
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

module.exports = BlobServers;
