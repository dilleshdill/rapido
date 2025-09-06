import pool from "../config/db.js";
import User from "../models/userModel.js";
import generateUserToken from "../utils/user.util.js";
import bcrypt from 'bcrypt'

async function addUser(req, res) {
  const { email,firstName,lastName,password } = req.body;
  try {
    const hashedpassword = await bcrypt.hash(password,10)
    const user = await User.createUser(email,firstName,lastName,hashedpassword);
    
    return generateUserToken(res,user)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getUserRides = async(req,res) =>{
  const {id,email} = req.user
  const data = await pool.query(
    `SELECT * FROM rides WHERE $1 = user_id`,[id]
  ) 
  res.status(200).json(data.rows)
}

async function listUsers(req, res) {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { addUser, listUsers,getUserRides };
