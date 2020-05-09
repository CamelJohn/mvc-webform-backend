const Sequelize = require('sequelize/index').Sequelize;

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWOD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        useUTC: false,
        dateFirst: 1,
        trustServerCertificate: true,
        enableArithAbort: false,
      },
    },
  }
);

module.exports = sequelize;
