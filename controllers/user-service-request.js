// tables
const ASR = require("../models/azure-service-request");
const SSR = require("../models/sysaid-service-request");

const Op = require("sequelize");
const handlers = require("../helper/handlers");

const getOpenedByUser = (req, res, next) => {
  const email = req.body.email;
  SSR.findAll({ [Op.and]:[{ email_open: email }, { status: [0, 1]}] })
  .then((sr) => { 
    handlers.openSr(res, sr)
  }).catch((err) => console.log(err));
}

const getClosedByUser = (req, res, next) => {
  const email = req.body.email;
  SSR.findAll({[Op.and]: [{ status: 3 }, {email_open: email }], raw : true }) //find all with status 1 or 3
  .then((sr) => { 
      handlers.closedSr(res, sr);
    }).catch((err) => console.log(err));
};

module.exports = {
  openUser: getOpenedByUser,
  closedUser: getClosedByUser,
};
