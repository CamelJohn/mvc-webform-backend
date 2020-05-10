const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Log = sequelize.define('mvcChaneLog', {
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
  old_value: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  new_value: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  edited_by: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date_edited: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

module.exports = Log;
