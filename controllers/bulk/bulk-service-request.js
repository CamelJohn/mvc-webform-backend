const SSR = require("../../models/sysaid-service-request");

const Op = require("sequelize");
const { mergeBlobAndServiceReq } = require("./helpers");
const { findAllBlobs } = require("../../shared/querries");

const getAllOpen = async (req, res, next) => {
  try {
    let ssr = await SSR.findAll({ where: { status: [0, 1] } });
    res.status(200).json({
      serviceReq: mergeBlobAndServiceReq(
        ssr.filter((sr) => sr.status !== 3),
        await findAllBlobs()
      ),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllClosed = async (req, res, next) => {
  try {
    let ssr = await SSR.findAll({ where: { status: 3 } });
    res.status(200).json({
      serviceReq: mergeBlobAndServiceReq(
        ssr.filter((sr) => sr.status !== 3),
        await findAllBlobs()
      ),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({
      [Op.and]: [{ status: [0, 1] }, { email_open: email }],
    });
    res.status(200).json({ serviceReq: mergeBlobAndServiceReq(ssr, await findAllBlobs()) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllOpen, getAllClosed, getAllByUser };
