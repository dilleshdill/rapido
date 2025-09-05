import User from "../models/userModel.js";
import generateUserToken from "../utils/user.util.js";

async function addUser(req, res) {
  const { email,firstName,lastName } = req.body;
  try {
    const user = await User.createUser(email,firstName,lastName);
    
    return generateUserToken(user)
    // res.status(200).json(user);
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
