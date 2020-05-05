const User = require('../models/user'); // user model
const Token = require('../models/token');
const mail = require('../mail/massage-routelet');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()
    if (users) {
      res.status(200).send(users)
    }
  } catch (err) {
    res.status(err.status).send(err.message)
  }
}

const updateUser = async (req, res, next) => {
  const route = req.originalUrl;  
  const role = req.body.role;
  const userRole = req.body.user.role;
  const userId = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.fullName;
  const active = req.body.user.isActive;
  const phone = req.body.user.phoneNumber;
  try {
    if (role == '1') { // check if user is admin or not
      const user = await User.findOne({ where: { id: userId }})
          if (user) {
            user.email = email;
            user.fullName = name;
            user.isActive = active;
            user.role = userRole;
            user.phoneNumber = phone;
            await user.save()
            // mail.messageRoutelet(user, route);
            res.status(201).send({ msg: { id: 2, text: `${user.fullName} successfully updated` } })
          } else {
            res.status(422).send({ msg: { id: 1, text: 'unauthorized user' } })
          }
     } else {
      res.status(422).send({ msg: { id: 1, text: 'unauthorized user' } })
    }
  } catch (err) {
    res.status(500).send({ msg: { id: 1, text: 'internal server error' } })
  }
}

const deleteUser = async (req, res, next) => { 
  const route = req.originalUrl;  
  const userId = req.body.user;
  const role = req.body.role;
  try {
    if (role === 1) {     
        const user = await User.findOne({ where: {id: userId}})        
        // const tokens = await Token.findAll({ where: { user_email: user.email }})
        const tokens = await Token.findAll({ where: { userEmail: user.email }})
        tokens.forEach(token => {
          token.destroy();
        })
        // mail.messageRoutelet(user, route);
        await user.destroy();
        res.status(201).send({id: 2, msg:`user deleted successfully`})
    } else {
      res.status(400).send({id: 1, msg: 'unauthorized user'})
    }
  } catch (err) {
    res.status(500).send({ id: 2, msg: 'failed to delete user', message: err.message})
  }
}

module.exports = {
  update: updateUser,
  delete: deleteUser,
  getAll: getAllUsers
}