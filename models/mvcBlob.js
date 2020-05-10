const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BLOB = sequelize.define('mvcBlob', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  srId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  sysId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  azureId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  blobName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  containerName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  blobServer: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = BLOB;
