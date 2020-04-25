const Sequelize = require("sequelize/index").Sequelize;

const sequelize = new Sequelize("srdb", "srdbadmin", "p2B96ytMKT95TkVj", {
  host: "sysaidintegration.database.windows.net",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
      useUTC: false,
      trustServerCertificate: true,
      enableArithAbort: false,
    },
  },
});

module.exports = sequelize;
