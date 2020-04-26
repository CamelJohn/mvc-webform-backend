const User = require("../models/user");
const Token = require("../models/token");
const Op = require("sequelize");

const bcrypt = require("bcrypt");
const { tokenGenerator, tokenExpirationDate, passwordMessages } = require("../helper/handlers");
const mail = require('../mail/massage-routelet');

const updatePassword = (req, res, next) => {
  const requestUserId = req.body.id;
  const userId = req.body.id2;
  const pwd = req.body.password;
  const route = req.originalUrl;  

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
                mail.messageRoutelet(user, route, pwd);
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
  const route = req.originalUrl;  
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
              mail.messageRoutelet(user, route, newToken);
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
            mail.messageRoutelet(user, route, newToken);
            res.satus(201).send({ id: 2, msg: "token generated successfully!" });
          }).catch((err) => console.log(err));
      }
    }).catch((err) => console.log(err));
};

const resetPassword = (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;
  const token = req.body.token;
  const route = req.originalUrl;  

  Token.findOne({
    [Op.and]: [
      { userEmail: email }, 
      { expirtaionDate: { [Op.gt]: new Date() } }
    ]}).then((tokenData) => {
      if (tokenData) {
        if (tokenData.token === token) {
          bcrypt.hash(pwd, 10, (err, hash) => {
            User.findOne({ where: { email: email }})
            .then(user => { 
              user.password = hash;
              mail.messageRoutelet(user, route, pwd, 'success')
              res.send({id: 2, msg: 'password updated'});
            }).catch(err => console.log(err))
          })
        } else {
          mail.messageRoutelet({ email: email }, route, pwd, 'fail');
        res.send({ id: 1, msg: 'could not update password with this token'})
        }
      } else {
        mail.messageRoutelet({ email: email }, route, pwd, 'fail');
        res.send({ id: 1, msg: 'could not update password with this token'})
      }
      
    }).catch((err) => console.log(err))
};

module.exports = {
  reset: resetPassword,
  generate: generatKey,
  update: updatePassword,
};
