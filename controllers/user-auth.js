const User = require("../models/user"); // user model
const Token = require("../models/token");

const bcrypt = require("bcrypt");

const { loginJWTToken, tokenExpirationDate, tokenGenerator} = require("../helper/handlers");

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user && user.isActive == "1") {
        // check if user exists and is active
        bcrypt.compare(pwd, user.password) // compare passwords
          .then((existingUser) => {
            if (existingUser) { // user exists
              let token = loginJWTToken(existingUser);
              res.status(200).send({ auth: true, token: token, user: user }); // send token to front
            } else {
              res.status(401).send({ auth: false, token: null, msg: { id: 3, text: "incorrect password" } });
            }
          }).catch((err) => console.log(err));
      } else {
        // what to do if user does not exist or not active
        res.send({ msg: { id: 2, text: "the user is not active or does not exist" } });
      }
    }).catch((err) => console.log(err));
};

const postRegister = (req, res, next) => {
  const pwd = req.body.password;
  const email = req.body.email;
  const name = req.body.name;
  const phone = req.body.phoneNumber;
  bcrypt.hash(pwd, 10, function (err, hash) {
    // hash the password
    User.findOne({ where: { email: email } }) // check if user exists already
      .then((user) => {
        if (!user) { // if user does not exist
          User.create({
            email: email,
            password: hash,
            fullName: name,
            isActive: 0, // not active by default
            role: 3, /** @param { what is the status here ? } */
            phoneNumber: phone,
          }).then(user => {
            const expirationDate = tokenExpirationDate();
            const newToken = tokenGenerator();
            Token.create({
            token: newToken,
            expirationDate: expirationDate,
            userEmail: email,
            mvcUserId: user.id // update the userId in the token table
          });
          res.status(201).send({ msg: { id: 2, text: "user created successfuly" } });
          })
        } else {
          // if user exists already
          res.status(401).send({ msg: { id: 1, text: "user already exists" } });
        }
      }).catch((err) => console.log(err));
  });
};

module.exports = {
  login: postLogin,
  signup: postRegister,
};
