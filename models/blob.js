const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Blob = sequelize.define('mvcBlob', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  srId: {
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
  }
});

module.exports = Blob;
