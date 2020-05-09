const TokenGenerator = require('uuid-token-generator');
const jwt = require('jsonwebtoken');

const setTokenExpirationDate = () => {
  let d = new Date();
  let d2 = new Date(d);
  d2.setMinutes(d.getMinutes() + 210); // add 30 minutes to token creation time
  let date = `${d2.toISOString().split('T')[0]} ${d2.toISOString().split('T')[1].slice(0, 8)}`; // set token expiration time
  return date;
}; // generates an expiration date for tokens

const tokenGenerator = () => {
  const newToken = new TokenGenerator(256, TokenGenerator.BASE62).generate();
  return newToken;
}; // generates a token to be sent to user by email to reset password

const loginJWTToken = (user) => { 
  let token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: 43200,
  }); // generate token for user
  return token;
}; // JWT token generation

module.exports = { setTokenExpirationDate, tokenGenerator, loginJWTToken };