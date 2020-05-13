const TOKEN = require('../../models/token');
const bcrypt = require('bcryptjs');
const mail = require('../../mail/massage-routelet');

const { loginJWTToken, tokenGenerator, setTokenExpirationDate } = require('../../helpers/tokenHandlers');
const  { createUser } = require('./helpers');
const { findUserByEmail } = require('../../shared/querries');

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  try {
    const user = await findUserByEmail(email);
    if (user && user.isActive === true) {
      // check if user exists and is active
      const isEqual = await bcrypt.compare(pwd, user.password); // compare passwords
      if (isEqual) {
        let token = loginJWTToken(user);
        res.status(201).send({ auth: true, token: token, user: user }); // send token to front
      } else {
        res.status(401).send({ auth: false, token: null, message: 'incorrect password'});
      }
    } else {
      // what to do if user does not exist or not active
      res.status(404).send({ message: 'user not active or does not exist' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const postRegister = async (req, res, next) => {
  const pwd = req.body.password;
  const email = req.body.email;
  const name = req.body.name;
  const phone = req.body.phoneNumber;
  const route = req.originalUrl;

  try {
    const hash = await bcrypt.hash(pwd, 12);
    const user = await findUserByEmail(email);
    if (!user) {
      // if user does not exist
      const createdUser = await createUser(email, hash, name, phone);
      mail.messageRoutelet({ name: name, email: email }, route, null, 'waiting');
      const expirationDate = setTokenExpirationDate();
      const newToken = tokenGenerator();
      await TOKEN.create({ token: newToken, expirationDate: expirationDate, userEmail: email });
      return res.status(201).send({ message: 'user created successfuly' });
    } else {
      return res.status(401).send({ message: 'user already exists' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { postLogin, postRegister };
