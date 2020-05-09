const SSR = require('../models/sysaid-service-request');

const Op = require('sequelize');
const { getAllClosedSr, getAllOpenSr, getAllUserSr } = require('../helpers/getSrHandlers');

const getAllOpen = async (req, res, next) => {
  try {
    const ssr = await SSR.findAll({ where: { status: [0, 1] }, raw: true }); //find all with status 1 or 3
    getAllOpenSr(res, ssr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllClosed = async (req, res, next) => {
  try {
    const ssr = await SSR.findAll({ where: { status: 3 }, raw: true }); //find all with status 1 or 3
    getAllClosedSr(res, ssr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    const [ssr] = await SSR.findAll({
      [Op.and]: [{ status: [0, 1] }, { email_open: email }],
    });
    getAllUserSr(res, ssr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllOpen, getAllClosed, getAllByUser };
