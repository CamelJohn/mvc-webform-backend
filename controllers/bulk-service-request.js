// tables
const SSR = require("../models/sysaid-service-request");
// const ASR = require("../models/azure-service-request");

const Op = require("sequelize");
const handlers = require("../helper/handlers");

const getAllOpen = (req, res, next) => {
  SSR.findAll({where: { status: [0, 1] }, raw : true }) //find all with status 1 or 3
  .then(([sr]) => { 
      handlers.openSr(res, sr);
    }).catch((err) => console.log(err));
};

const getAllClosed = (req, res, next) => {
  SSR.findAll({where: { status: 3 }, raw : true }) //find all with status 1 or 3
  .then(([sr]) => { 
      handlers.closedSr(res, sr);
    }).catch((err) => console.log(err));
};

const getAllByUser = (req, res, next) => {
  const email = req.body.email;
  SSR.findAll({ [Op.and]: [{ statu: [0, 1]}, { email_open: email}]})
  .then((sr) => { 
    handlers.userAllSr(res, sr)
  }).catch(err => console.log(err))
}

module.exports = {
  allOpen: getAllOpen,
  allClosed: getAllClosed,
  allUser: getAllByUser,
};
