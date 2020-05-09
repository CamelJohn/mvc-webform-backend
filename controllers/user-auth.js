const User = require('../models/user'); // user model
const Token = require('../models/token');

const bcrypt = require('bcryptjs');

const {
  loginJWTToken,
  tokenExpirationDate,
  tokenGenerator,
} = require('../helpers/tokenHandlers');

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user && user.isActive === true) {
      // check if user exists and is active
      const isEqual = await bcrypt.compare(pwd, user.password); // compare passwords
      if (isEqual) {
        // user exists
        let token = loginJWTToken(user);
        res.status(201).send({ auth: true, token: token, user: user }); // send token to front
      } else {
        res.status(401).send({
          auth: false,
          token: null,
          message: 'incorrect password',
        });
      }
    } else {
      // what to do if user does not exist or not active
      res.status(404).send({
        message: 'the user is not active or does not exist',
      });
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

  try {
    const hash = await bcrypt.hash(pwd, 12);
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      // if user does not exist
      const createdUser = await User.create({
        email: email,
        password: hash,
        fullName: name,
        isActive: 0, // not active by default
        role: 3,
        phoneNumber: phone,
      });
      const expirationDate = tokenExpirationDate();
      const newToken = tokenGenerator();
      await Token.create({
        token: newToken,
        expirationDate: expirationDate,
        userEmail: email,
        // update the userId in the token table
      });
      return res.status(201).send({ message: 'user created successfuly' });
    } else {
      return res.status(401).send({ message: 'user already exists' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { postLogin, postRegister };
