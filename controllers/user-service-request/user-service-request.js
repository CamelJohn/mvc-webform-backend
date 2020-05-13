const SSR = require("../../models/sysaid-service-request");

const Op = require("sequelize");
const { mergeBlobAndServiceReq } = require("../../helpers/getSrHandlers");
const { findAllBlobs } = require("../../shared/querries");

const getOpenedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({
      [Op.and]: [{ email_open: email }, { status: [0, 1] }],
      raw: true,
    });
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

const getClosedByUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    let ssr = await SSR.findAll({
      [Op.and]: [{ status: 3 }, { email_open: email }],
      raw: true,
    });

    res.status(200).json({
      serviceReq: mergeBlobAndServiceReq(
        ssr.filter((sr) => sr.status === 3),
        await findAllBlobs()
      ),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOpenedByUser, getClosedByUser };
