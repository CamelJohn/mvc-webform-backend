const User = require('../models/user'); // user model

const getAllUsers = (req, res, next) => {
  User.findAll()
    .then(users => res.status(200).send(users))
    .catch(err => res.status(err.status).send(err.message))
}

const updateUser = (req, res, next) => {
  const role = req.body.role;
  const userRole = req.body.user.role;
  const userId = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.fullName;
  const active = req.body.user.isActive;
  const phone = req.body.user.phoneNumber;

  if (role == '1') { // check if user is admin or not
    User.findOne({ where: { id: userId }})
      .then(user => {
        if (user) {
          user.email = email;
          user.fullName = name;
          user.isActive = active;
          user.role = userRole;
          user.phoneNumber = phone;
          return user.save()
        } else {
          res.status(400).send({ msg: { id: 1, text: 'unauthorized user' } })
        }
      }).then(user => {
        // email handling needed here
        res.status(201).send({ msg: { id: 2, text: `${user.fullName} successfully updated` } })
      }).catch(err => console.log(err))
  } else {
    res.status(400).send({ msg: { id: 1, text: 'unauthorized user' } })
  }
}

const deleteUser = (req, res, next) => {
  const userId = req.body.user;
  const role = req.body.role;

  if (role == '1') {
    User.findOne(userId)
    .then(user => {      
      // mail handling
      return user.destroy();
    })
    .then(() => res.status(201).send({id: 2, msg:`user deleted successfully`}))
    .catch(err => {
      console.log(err)
      res.status(400).send({ id: 2, msg: 'failed to delete user'})
    })
  } else {
    res.status(400).send({id: 1, msg: 'unauthorized user'})
  }
}

module.exports = {
  update: updateUser,
  delete: deleteUser,
  getAll: getAllUsers
}