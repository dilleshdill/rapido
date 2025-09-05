import User from "../models/userModel.js";
import generateUserToken from "../utils/user.util.js";
import bcrypt from 'bcrypt'

async function addUser(req, res) {
  const { email,firstName,lastName,password } = req.body;
  try {
    const hashedpassword = await bcrypt.hash(password,10)
    const user = await User.createUser(email,firstName,lastName,hashedpassword);
    console.log(user)
    return generateUserToken(user)
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

export { addUser, listUsers };
