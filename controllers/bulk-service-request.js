// tables
const SSR = require("../models/sysaid-service-request");
// const ASR = require("../models/azure-service-request");

const Op = require("sequelize");
const handlers = require("../helper/handlers");

const getAllOpen = async (req, res, next) => {
  try {
    const [ssr] = await SSR.findAll({where: { status: [0, 1] }, raw : true }) //find all with status 1 or 3
    handlers.openSr(res, ssr);
  } catch (err) {
    console.log(err); 
  }
};

const getAllClosed = async (req, res, next) => {
  try {
    const [ssr] = await   SSR.findAll({where: { status: 3 }, raw : true }) //find all with status 1 or 3
    handlers.closedSr(res, ssr);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const getAllByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    const [ssr] = await SSR.findAll({ [Op.and]: [{ status: [0, 1]}, { email_open: email}]});
    handlers.userAllSr(res, ssr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  allOpen: getAllOpen,
  allClosed: getAllClosed,
  allUser: getAllByUser,
};
