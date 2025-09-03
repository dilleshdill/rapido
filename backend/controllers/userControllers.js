const User = require("../models/userModel.js");

async function addUser(req, res) {
  const { email,firstName,lastName } = req.body;
  console.log(email,firstName,lastName);
  try {
    const user = await User.createUser(email,firstName,lastName);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addUser, listUsers };
