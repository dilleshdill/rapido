import express from "express";
import Driver from "../models/driverModel.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import generateUserToken from "../utils/user.util.js";


async function addDriver(req, res) {
  const {city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType} = req.body;
  try {
    const user = await Driver.createDriver(city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType);
    console.log(user)
    return generateUserToken(res,user)
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const driverLogin = async (req, res) => {
  const { email, password, latitude,longitude } = req.body;
  
  try {
    
    const user = await pool.query(
      "SELECT * FROM drivers WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Driver Not Found" });
    }

    const driver = user.rows[0];

    
    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    
    await pool.query(
      "INSERT INTO drivers_rides (driver_id, lat, lng, city, is_available) VALUES ($1, $2, $3, $4, $5)",
      [driver.driver_id, latitude, longitude, null, false]
    );

    return generateUserToken(res,user.rows[0])

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const driverRides = async(req,res) => {
  
  const {email} = req.user
  console.log("driver Rides",email)
  const rides = await pool.query(
    `SELECT * FROM drivers WHERE email = $1`,[email]
  )

  const id = rides.rows[0].driver_id
  const data = await pool.query(
    `SELECT * FROM rides WHERE driver_id = $1`,[id]
  )
  console.log("rides data",data.rows[0])


  if (!data){
    return res.status(404).json({message:"Driver Not Foudn"})
  }

  res.status(200).json({data:data.rows[0]})

}



export { addDriver,driverLogin,driverRides };