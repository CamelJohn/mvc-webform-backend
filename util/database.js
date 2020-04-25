const Sequelize = require('sequelize/index').Sequelize;

// Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
//   return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
// };

const sequelize = new Sequelize('srdb', 'srdbadmin', 'p2B96ytMKT95TkVj', {
    host: 'sysaidintegration.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        // freezeTableName: true,
        useUTC: false,
        // useISO: true,
        // dateFirst: 1,
        trustServerCertificate: true,
        enableArithAbort: false 
      }
    },
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // },
  })

module.exports = sequelize;