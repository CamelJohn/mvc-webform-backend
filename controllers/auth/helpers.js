const USER = require("../../models/user"); // user model

const createUser = async (email, hash, name, phone) => {
  const createdUser = await USER.create({
    email: email,
    password: hash,
    fullName: name,
    isActive: 0, // not active by default
    role: 3,
    phoneNumber: phone,
  });
  return createdUser;
};

module.exports = { createUser }