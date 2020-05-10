const DataType = require('sequelize');

const sequelize = require('../util/database');

const TOKEN = sequelize.define('mvcToken', {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  token: {
    type: DataType.STRING,
    allowNull: true,
  },
  expirationDate: {
    type: DataType.DATE,
    allowNull: true,
  },
  userEmail: {
    type: DataType.STRING,
    allowNull: true,
  },
});

module.exports = TOKEN;
