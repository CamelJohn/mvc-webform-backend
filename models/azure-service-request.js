const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AzureServiceRequest = sequelize.define('mvcAzureServiceRequest', {
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
  problem_type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  problem_sub_type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  third_level_category: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  assigned_group: {
    type: Sequelize.STRING,
    allowNull: true
  },
  responsibility: {
    type: Sequelize.STRING,
    allowNull: true
  },
  timer1: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  current_date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  timer_in_Days: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  status_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  insert_time: {
    type: Sequelize.DATE,
    allowNull: true
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: true
  },
  close_time: {
    type: Sequelize.DATE,
    allowNull: true
  },
  request_user: {
    type: Sequelize.STRING,
    allowNull: true
  },
  submit_user: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email_address: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cell_phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sr_cust_module: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  module_klh_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  impact: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  impact_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  name_open: {
    type: Sequelize.STRING,
    allowNull: true
  },
  phone_open: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email_open: {
    type: Sequelize.STRING,
    allowNull: true
  },
  id_open: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  solution: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  root_problem: {
    type: Sequelize.STRING,
    allowNull: true
  },

});

module.exports = AzureServiceRequest;

