const SSR = require('../../models/sysaid-service-request');

const Op = require('sequelize');
const handlers = require('../../helpers/getSrHandlers');
const { findAllBlobs } = require('../../shared/querries');

const getOpenedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({ [Op.and]: [{ email_open: email }, { status: [0, 1] }], raw: true });
    const blob = await findAllBlobs();

    ssr = ssr.filter((sr) => sr.status !== 3);

    let merged = handlers.mergeBlobAndServiceReq(ssr, blob);
    res.status(200).json({ serviceReq: merged })    
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const getClosedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({ [Op.and]: [{ status: 3 }, { email_open: email }], raw: true }); 
    const blob = await findAllBlobs();

    ssr = ssr.filter((sr) => sr.status === 3);

    let merged = handlers.mergeBlobAndServiceReq(ssr, blob);
    res.status(200).json({ serviceReq: merged })    

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

module.exports = { getOpenedByUser, getClosedByUser };
