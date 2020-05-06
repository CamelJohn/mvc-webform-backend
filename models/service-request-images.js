const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ServiceRequestImages = sequelize.define('mvcServiceRequestImages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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

module.exports = ServiceRequestImages;
