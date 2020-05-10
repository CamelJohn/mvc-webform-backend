const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const STATE = sequelize.define('mvcState', {
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
  syncStatus: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  syncStatusName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  syncUpdated: {
    type: Sequelize.DATE,
    allowNull: true,
  }
});

module.exports = STATE;
