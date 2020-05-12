const TOKEN = require('../../models/token');
const mail = require('../../mail/massage-routelet');
const USER = require('../../models/user');
const { findUserById } = require('../../shared/querries');
const { updateThisUser } = require('./helpers');

const getAllUsers = async (req, res, next) => {
  try {    
    const users = await USER.findAll()
    if (users) {
      res.status(200).send({ users: users})
    }
  } catch (err) {
    res.status(500).send({ message: err.message})
  }
}

const updateUser = async (req, res, next) => {
  
  const route = req.originalUrl;  
  const userRole = req.body.user.role;
  const userId = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.fullName;
  const active = req.body.user.isActive;
  const phone = req.body.user.phoneNumber;
  try {    
    const loggedIn = await findUserById(req.id);
    if (loggedIn.role === 1) { // check if user is admin or not     
      const user = await findUserById(userId)    
          if (user) {
            await updateThisUser(email, name, active, userRole, phone);
            if (active === 1)  {
              mail.messageRoutelet({ name: name, email: email }, route, 'accepted');
            }
            res.status(201).send({ message: `${name} successfully updated` })
          } else {
            res.status(422).send({ message: 'unauthorized user' })
          }
     } else {
      res.status(422).send({ message: 'unauthorized user' })
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

const deleteUser = async (req, res, next) => { 
  const route = req.originalUrl;  
  const userId = req.body.user;
  try {
    const loggedIn = await findUserById(req.id);
    if (loggedIn.role === 1) {     
        const user = await findUserById(userId);        
        const tokens = await TOKEN.findAll({ where: { userEmail: user.email }})
        tokens.forEach(token => {
          token.destroy();
        })
        await user.destroy();
        res.status(201).send({ message:`user deleted successfully`})
    } else {
      res.status(422).send({id: 1, msg: 'unauthorized user'})
    }
  } catch (err) {
    res.status(500).send({ message: err.message})
  }
}

module.exports = { updateUser, deleteUser, getAllUsers }