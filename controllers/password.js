const User = require('../models/user');
const Token = require('../models/token');
const Op = require('sequelize');

const bcrypt = require('bcryptjs');
const {
  tokenGenerator,
  tokenExpirationDate,
  passwordMessages,
} = require('../helper/handlers');
const mail = require('../mail/massage-routelet');

const updatePassword = async (req, res, next) => {
  const requestUserId = req.body.id;
  const userId = req.body.id2;
  const pwd = req.body.password;
  const route = req.originalUrl;

  try {
    const reqUser = await User.findByPk(requestUserId);
    const hash = await bcrypt.hash(pwd, 12);
    if (reqUser.role === 1) {
      // if requesting user is admin
      const user = await User.findByPk(userId); // find user to update password
      if (user) {
        //user exists
        user.password = hash;
        await user.save();
        // mail.messageRoutelet(user, route, pwd);
        passwordMessages(res, 2, `password was successfully updated`, 201);
      } else {
        // user does not exist
        passwordMessages(res, 1, `unauthorized user`, 400);
      }
    } else {
      passwordMessages(res, 1, `unauthorized user`, 400);
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const generatKey = async (req, res, next) => {
  const route = req.originalUrl;
  const email = req.body.email;
  const newToken = tokenGenerator();
  const date = tokenExpirationDate();

  try {
    const token = await Token.findOne({ where: { userEmail: email } });
    if (!token) {
      // if email does not exist
      const hash = await bcrypt.hash(newToken, 12);
      const createdToken = await Token.create({
        token: hash,
        expirtaionDate: date,
        userEmail: email,
      });
      // mail.messageRoutelet(user, route, newToken);
      res.status(201).send({ id: 2, msg: 'token generated successfully!' });
      // res.status(201).send({ id: 2, msg: 'token generated successfully!', key: createdToken });
    } else {
      token.token = newToken;
      token.expirtaionDate = date;
      token.userEmail = email;
      await token.save();
      // mail.messageRoutelet(user, route, newToken);
      res.status(201).send({ id: 2, msg: 'token generated successfully!' });
      // res.status(201).send({ id: 2, msg: 'token generated successfully!', token: token });
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const resetPassword = async (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;
  const token = req.body.token;
  const route = req.originalUrl;
  try {
    const tokenData = await Token.findOne({ [Op.and]: [ { userEmail: email }, { expirtaionDate: { [Op.gt]: new Date() } }]});
    if (tokenData) {
      if (tokenData.token === token) {
        const hash = await bcrypt.hash(pwd, 12);
        const user = await User.findOne({ where: { email: email } });
        user.password = hash;
        await user.save();
        // mail.messageRoutelet(user, route, pwd, 'success');
        res.send({ id: 2, msg: 'password updated' });
      } else {
        // mail.messageRoutelet({ email: email }, route, pwd, 'fail');
        res.send({ id: 1, msg: 'could not update password with this token' });
      }
    } else {
      // mail.messageRoutelet({ email: email }, route, pwd, 'fail');
      res.send({ id: 1, msg: 'could not update password with this token' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

module.exports = {
  reset: resetPassword,
  generate: generatKey,
  update: updatePassword,
};
