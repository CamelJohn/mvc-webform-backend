const Sequelize = require('sequelize/index');

const sequelize = require('../util/database');

const USER = sequelize.define('mvcUser', {
  id: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = USER;
