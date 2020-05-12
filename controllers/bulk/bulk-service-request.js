const SSR = require('../../models/sysaid-service-request');

const Op = require('sequelize');
const handlers = require('./helpers');
const { findAllBlobs } = require('../../shared/querries');

const getAllOpen = async (req, res, next) => {
  try {
    let ssr = await SSR.findAll({ where: { status: [0, 1] }, raw: true }); //find all with status 1 or 3
    const blob = await findAllBlobs();

    ssr = ssr.filter((sr) => sr.status !== 3);

    let merged = handlers.mergeBlobAndServiceReq(ssr, blob);
    res.status(200).json({ serviceReq: merged }) 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllClosed = async (req, res, next) => {
  try {
    let ssr = await SSR.findAll({ where: { status: 3 }, raw: true }); //find all with status 1 or 3
    const blob = await findAllBlobs();

    ssr = ssr.filter((sr) => sr.status !== 3);

    let merged = handlers.mergeBlobAndServiceReq(ssr, blob);
    res.status(200).json({ serviceReq: merged })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({ [Op.and]: [{ status: [0, 1] }, { email_open: email }], raw: true });
    const blob = await findAllBlobs();

    let merged = handlers.mergeBlobAndServiceReq(ssr, blob);
    res.status(200).json({ serviceReq: merged }) 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllOpen, getAllClosed, getAllByUser };
