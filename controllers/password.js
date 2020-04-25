const User = require("../models/user");
const Token = require("../models/token");
const Op = require("sequelize");

const bcrypt = require("bcrypt");
const { tokenGenerator, tokenExpirationDate, passwordMessages } = require("../helper/handlers");

const updatePassword = (req, res, next) => {
  const requestUserId = req.body.id;
  const userId = req.body.id2;
  const pwd = req.body.password;

  User.findByPk(requestUserId)
    .then((user) => {
      return user;
    }).then((reqUser) => {
      bcrypt.hash(pwd, 10, (err, hash) => {
        if (reqUser.role == "1") {
          // if requesting user is admin
          User.findByPk(userId) // find user to update password
            .then((user) => {
              if (user) { //user exists
                user.password = hash;
                user.save();
                // mail handling
                passwordMessages(res, 2, `password was successfully updated`,201 );
              } else { // user does not exist
                passwordMessages(res, 1, `unauthorized user`, 400);
              }
            }).catch((err) => console.log(err));
        } else {
          passwordMessages(res, 1, `unauthorized user`, 400);
        }
      });
    }).catch((err) => console.log(err));
};

const generatKey = (req, res, next) => {
  const email = req.body.email;
  const newToken = tokenGenerator();
  const date = tokenExpirationDate();
  Token.findOne({ where: { userEmail: email } })
    .then((email) => {
      if (!email) { // if email does not exist 
        bcrypt.hash(newToken, 10, (err, hash) => {
          Token.create({
            token: hash,
            expirtaionDate: date,
            userEmail: email,
          })
            .then((user) => {
              // ... mail handling
              res.status(201).send({ id: 2, msg: "token generated successfully!" });
            })
            .catch((err) => console.log(err));
        });
      } else {
        Token.findOne({ where: { userEmail: email } })
          .then((token) => {
            token.token = newToken;
            token.expirtaionDate = date;
            token.userEmail = email;
            token.save();
            // email handling
            res
              .satus(201)
              .send({ id: 2, msg: "token generated successfully!" });
          }).catch((err) => console.log(err));
      }
    }).catch((err) => console.log(err));
};

const resetPassword = (req, res, next) => {
  const email = req.body.email;

  Token.findAll({
    [Op.and]: [
      { userEmail: email }, 
      { expirtaionDate: { [Op.gt]: new Date() } }
    ]}).then(([token]) => {
      res.send(token)
      // this needs to be done
    }).catch((err) => console.log(err))
};

module.exports = {
  reset: resetPassword,
  generate: generatKey,
  update: updatePassword,
};
