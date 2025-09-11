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



const userDetailes = async(req,res) => {
  const {email} = req.user
  console.log("user email",email)

  const data = await pool.query(
    `SELECT * FROM users WHERE email = $1`,[email]
  )

  console.log(data.rows[0])
  if (!data){
    res.status(400).json({message:"No User Found"})
  }

  res.status(200).json({data:data.rows[0]})
}

const ratingSubmited = async(req,res) => {
    const { id, rating } = req.body;
    console.log("ride id ", id);

    
    const driverRes = await pool.query(
      `SELECT driver_id FROM rides WHERE id = $1`,
      [id]
    );

    if (driverRes.rows.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const driverId = driverRes.rows[0].driver_id;

    
    await pool.query(
      `UPDATE drivers 
      SET sum_rating = COALESCE(sum_rating, 0) + $1, 
          no_review = COALESCE(no_review, 0) + 1
      WHERE driver_id = $2`,
      [rating, driverId]
    );

    const newData = await pool.query(
      `SELECT sum_rating, no_review FROM drivers WHERE driver_id = $1`,
      [driverId]
    );

    const { sum_rating, no_review } = newData.rows[0];
    const newRating = sum_rating / no_review;

    await pool.query(
      `UPDATE drivers SET rating = $1 WHERE driver_id = $2`,
      [newRating, driverId]
    );

    res.status(200).json({
      message: "Rating submitted successfully",
      driverId,
      newRating: newRating.toFixed(1),
});

}

export { addUser, listUsers,getUserRides,userDetailes,ratingSubmited };
