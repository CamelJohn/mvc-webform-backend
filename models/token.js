const DataType = require('sequelize');

const sequelize = require('../util/database');

const Token = sequelize.define('mvcToken', {
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
  mvcUserId: {
    type: DataType.INTEGER,
    allowNull: true
  }
});

module.exports = Token;
