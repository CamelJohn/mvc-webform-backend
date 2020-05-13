const TOKEN = require('../../models/token');
const Op = require('sequelize');

const bcrypt = require('bcryptjs');
const { tokenGenerator, setTokenExpirationDate } = require('../../helpers/tokenHandlers');
const { findUserByEmail, findUserById } = require('../../shared/querries');
const mail = require('../../mail/massage-routelet');

const updatePassword = async (req, res, next) => {
  const userId = req.body.id;
  const pwd = req.body.password;
  const route = req.originalUrl;

  try {
    const loggedIn = await findUserById(req.id);
    // const reqUser = await User.findByPk(requestUserId);
    const hash = await bcrypt.hash(pwd, 12);
    if (loggedIn.role === 1) {
      // if requesting user is admin
      const user = await findUserById(userId); // find user to update password
      if (user) {
        //user exists
        user.password = hash;
        await user.save();
        mail.messageRoutelet({ name: user.name, email: user.email }, route, pwd, '');
        res.status(201).json({message: 'password was successfully updated'})
      } else {
        // user does not exist
        res.status(404).json({ message: 'used does not exist'})
      }
    } else {
      res.status(422).json({ message: 'unauthorized user'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

const generateKey = async (req, res, next) => {
  const route = req.originalUrl;
  const email = req.body.email;
  const newToken = tokenGenerator();
  const date = setTokenExpirationDate();

  try {
    const user = await findUserByEmail(email);
    const token = await TOKEN.findOne({ where: { userEmail: email } });
    if (!token) {
      // if email does not exist
      const hash = await bcrypt.hash(newToken, 12);
      const createdToken = await TOKEN.create({
        token: hash,
        expirtaionDate: date,
        userEmail: email,
      });
      mail.messageRoutelet({ name: user.name, email: user.email }, route, newToken);
      res.status(201).send({ message: 'token generated successfully!' });
      // res.status(201).send({ id: 2, msg: 'token generated successfully!', key: createdToken });
    } else {
      token.token = newToken;
      token.expirtaionDate = date;
      token.userEmail = email;
      await token.save();
      mail.messageRoutelet({user, token }, route, newToken);
      res.status(201).send({ message: 'token generated successfully!' });
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
    const tokenData = await TOKEN.findOne({ [Op.and]: [ { userEmail: email }, { expirtaionDate: { [Op.gt]: new Date() } }]});
    if (tokenData) {
      if (tokenData.token === token) {
        const hash = await bcrypt.hash(pwd, 12);
        const user = await findUserByEmail(email);
        user.password = hash;
        await user.save();
        mail.messageRoutelet(user, route, pwd, 'password waiting');
        res.status(201).send({ message: 'password updated' });
      } else {
        // mail.messageRoutelet({ email: email }, route, pwd, 'fail');
        res.status(422).send({ message: 'could not update password with this token' });
      }
    } else {
      // mail.messageRoutelet({ email: email }, route, pwd, 'fail');
      res.status(422).send({ message: 'could not update password with this token' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

module.exports = {
  reset: resetPassword,
  generate: generateKey,
  update: updatePassword,
};
