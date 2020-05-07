const SSR = require('../models/sysaid-service-request');

const Op = require('sequelize');
const handlers = require('../helper/handlers');

const getOpenedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    const sr = await SSR.findAll({
      [Op.and]: [{ email_open: email }, { status: [0, 1] }],
    });
    handlers.openSr(res, sr);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const getClosedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    const sr = await SSR.findAll({
      [Op.and]: [{ status: 3 }, { email_open: email }],
      raw: true,
    }); //find all with status 1 or 3
    handlers.closedSr(res, sr);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

module.exports = {
  openUser: getOpenedByUser,
  closedUser: getClosedByUser,
};
