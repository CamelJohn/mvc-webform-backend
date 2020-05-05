const User = require('../models/user'); // user model
const Token = require('../models/token');

const bcrypt = require('bcryptjs');

const {
  loginJWTToken,
  tokenExpirationDate,
  tokenGenerator,
} = require('../helper/handlers');

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user && user.isActive == '1') {
      // check if user exists and is active
      const existingUser = await bcrypt.compare(pwd, user.password); // compare passwords
      if (existingUser) {
        // user exists
        let token = loginJWTToken(existingUser);
        res.status(200).send({ auth: true, token: token, user: user }); // send token to front
      } else {
        res
          .status(401)
          .send({
            auth: false,
            token: null,
            msg: { id: 3, text: 'incorrect password' },
          });
      }
    } else {
      // what to do if user does not exist or not active
      res.send({
        msg: { id: 2, text: 'the user is not active or does not exist' },
      });
    }
  } catch (err) {
    console.log(err);
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
        role: 3 /** @param { what is the status here ? } */,
        phoneNumber: phone,
      });
      const expirationDate = tokenExpirationDate();
      const newToken = tokenGenerator();
      await Token.create({
        token: newToken,
        expirationDate: expirationDate,
        userEmail: email,
        // mvcUserId: createdUser.id, // update the userId in the token table
      });
      return res.status(201).send({ msg: { id: 2, text: 'user created successfuly' } });
    } else {
      return res.status(401).send({ msg: { id: 1, text: 'user already exists' } });
    }
  } catch (err) {
    console.log(err)
  }
};

module.exports = {
  login: postLogin,
  signup: postRegister,
};
