const USER = require('../models/user'); // user model
const TOKEN = require('../models/token');
const mail = require('../mail/massage-routelet');

const getAllUsers = async (req, res, next) => {
  try {    
    const users = await User.findAll()
    if (users) {
      res.status(200).send({ users: users})
    }
  } catch (err) {
    res.status(500).send({ message: err.message})
  }
}

const updateUser = async (req, res, next) => {
  const route = req.originalUrl;  
  // const role = req.body.role;
  const userRole = req.body.user.role;
  const userId = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.fullName;
  const active = req.body.user.isActive;
  const phone = req.body.user.phoneNumber;
  try {    
    const loggedIn = await USER.findOne({ where: { id: req.id }, raw: true });
    if (loggedIn.role === 1) { // check if user is admin or not     
      const user = await USER.findOne({ where: { id: userId }})    
          if (user) {
            user.email = email;
            user.fullName = name;
            user.isActive = active;
            user.role = userRole;
            user.phoneNumber = phone;
            await user.save()
            // mail.messageRoutelet(user, route);
            res.status(201).send({ message: `${user.fullName} successfully updated` })
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
  // const role = req.body.role;
  try {
    const loggedIn = await USER.findOne({ where: { id: req.id }, raw: true });
    if (loggedIn.role === 1) {     
        const user = await USER.findOne({ where: {id: userId}})        
        // const tokens = await Token.findAll({ where: { user_email: user.email }})
        const tokens = await TOKEN.findAll({ where: { userEmail: user.email }})
        tokens.forEach(token => {
          token.destroy();
        })
        // mail.messageRoutelet(user, route);
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