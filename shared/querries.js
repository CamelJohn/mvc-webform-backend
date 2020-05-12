const USER = require("../models/user");
const BLOB = require("../models/mvcBlob");
const STATE = require("../models/state");

const findUserByEmail = async (email) => {
  const user = await USER.findOne({ where: { email: email } });
  return user;
};

const findUserById = async (id) => {
    const user = await USER.findOne({ where: { id: id }})
    return user;
}

const findAllBlobs = async () => {
  const blob = await BLOB.findAll({ raw: true });
  return blob;
};

const findBlobById = async (id) => {
  const blob = await BLOB.findOne({ where: { sysId: id } });
  return blob;
};

const findState = async (srId) => {
  const state = await STATE.findOne({ where: { srId: srId } });
  return state;
};

const findSSRById = async (srId) => {
    const ssr = await SSR.findOne({ where: { id: srId } });
    return ssr;
}

module.exports = { findUserByEmail, findAllBlobs, findState, findBlobById, findSSRById, findUserById };
