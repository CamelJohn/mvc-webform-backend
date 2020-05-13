const TOKEN = require("../../models/token");
const USER = require("../../models/user");
const { findUserById } = require("../../shared/querries");
const { updateThisUser } = require("./helpers");

const getAllUsers = async (req, res, next) => {
  try {
    res.status(200).send({ users: await USER.findAll() });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateUser = async (req, res, next) => {
  const userRole = req.body.user.role;
  const userId = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.fullName;
  const active = req.body.user.isActive;
  const phone = req.body.user.phoneNumber;
  try {
    const loggedIn = await findUserById(req.id);
    if (loggedIn.role === 1) {
      // check if user is admin or not
      const user = await findUserById(userId);
      if (user) {
        await updateThisUser(user, email, name, active, userRole, phone);
        res.status(201).send({ message: `${name} successfully updated` });
      } else {
        res.status(404).send({ message: "user does not exist" });
      }
    } else {
      res.status(422).send({ message: "unauthorized user" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const loggedIn = await findUserById(req.id);
    if (loggedIn.role === 1) {
      const user = await findUserById(userId);      
      const tokens = await TOKEN.findAll({ where: { userEmail: user.email } });
      tokens.forEach((token) => {
        token.destroy();
      });
      await user.destroy();
      res.status(201).send({ message: `user deleted successfully` });
    } else {
      res.status(422).send({ message: "unauthorized user" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { updateUser, deleteUser, getAllUsers };
