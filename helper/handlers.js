const TokenGenerator = require('uuid-token-generator');
const jwt = require('jsonwebtoken');
const config = require('../util/config');
const SSR = require('../models/sysaid-service-request');
// const ASR = require('../models/azure-service-request');

exports.cellHandler = (cell) => {
  let res;
  if (cell !== '' || cell !== 'undefined' || cell != null) {
    if (cell.includes('+972')) {
      res = cell.replace('+972', '0');
      res = res.replace('-', '');
      res = res.replace('!', '');
    }
  }
  return res;
}; // handlers 'noise' in phone numbers

exports.tokenExpirationDate = () => {
  let d = new Date();
  let d2 = new Date(d);
  d2.setMinutes(d.getMinutes() + 210); // add 30 minutes to token creation time
  let date = `${d2.toISOString().split('T')[0]} ${d2.toISOString().split('T')[1].slice(0, 8)}`; // set token expiration time
  return date;
}; // generates an expiration date for tokens

exports.tokenGenerator = () => {
  const newToken = new TokenGenerator(256, TokenGenerator.BASE62).generate();
  return newToken;
}; // generates a token to be sent to user by email to reset password

exports.loginJWTToken = (existingUser) => {
  let token = jwt.sign({ id: existingUser.id }, config.secret, {
    expiresIn: 43200,
  }); // generate token for user
  return token;
}; // JWT token generation

exports.passwordMessages = (res, id, msg, stat) => {
  res.status(stat).send({ id: id, msg: msg });
}; // message generator for password controller

exports.openSr = (res, sr) => {
  const allSr = sr.filter((sr) => sr.status !== 3); // all sr's with status other than 3 => open only
  if (allSr.length !== 0) {
    res.status(201).send({ id: 2, data: allSr });
  } else {
    res.status(400).send({ id: 1, text: 'no service requests' });
  }
}; // refactored open service requests (all, specific user)

exports.closedSr = (res, sr) => {
  const allSr = sr.filter((sr) => sr.status === 3); // all sr's with status other than 3 => closed only
  if (allSr.length !== 0) {
    res.status(201).send({ id: 2, data: allSr });
  } else {
    res.status(400).send({ id: 1, text: 'no service requests' });
  }
}; // refactored closed service requests (all, specific user)

exports.userAllSr = (res, sr) => {
  if (sr.length !== 0) {
    res.status(201).send({ id: 2, data: sr });
  } else {
    res.status(400).send({ id: 1, text: 'no service requests' });
  }
}; // refactored all service requests (specific user)

exports.removeSr = async (res, srId) => {
  try {
    const sr = await SSR.findOne({ where: { id: srId } });
    if (!sr) {
      res.status(400).send({ id: 1, text: 'there is no sr with that id' });
    } else {
      await sr.destroy();
      res.status(200).send({ id: 2, text: 'success' });
    }
  } catch (err) {
    res.status(400).send({ id: 1, text: err.message });
  }
}; // not in user at the moment
