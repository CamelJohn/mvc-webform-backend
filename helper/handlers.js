const TokenGenerator = require('uuid-token-generator');
const jwt = require('jsonwebtoken');
const config = require('../util/config');

exports.cellHandler = (cell) => {
  let res;
  if (cell !== '' || cell !== 'undefined' || cell != null) {
      if (cell.includes('+972')) {
          res = cell.replace('+972','0');
          res = res.replace('-', '');
          res = res.replace('!', '');
      }
  }
  return res;
}

exports.tokenExpirationDate = () => {
  let d = new Date();
  let d2 = new Date(d);
  d2.setMinutes(d.getMinutes() + 150); // add 30 minutes to token creation time 
  let date = `${d2.toISOString().split('T')[0]} ${d2.toISOString().split('T')[1].slice(0, 8)}`; // set token expiration time
  return date;
}

exports.tokenGenerator = () => {
  const newToken = new TokenGenerator(256, TokenGenerator.BASE62).generate();
  return newToken;
}

exports.loginJWTToken = (existingUser) => {
  let token = jwt.sign({ id: existingUser.id }, config.secret, { expiresIn: 43200 }); // generate token for user
  return token;
}

exports.passwordMessages = (res, id, msg, stat) => {
  res.status(stat).send({ id:id, msg: msg});
}

