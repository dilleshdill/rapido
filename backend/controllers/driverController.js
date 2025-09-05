import express from "express";
import Driver from "../models/driverModel.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

async function addDriver(req, res) {
    // console.log(req.body);
  const {city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType} = req.body;
  try {
    const user = await Driver.createDriver(city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType);
    // return generateUserToken(res, user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




const driverLogin = async (req, res) => {
  const { email, password, latitude,longitude } = req.body;
  
  try {
    // 1. Get driver
    const user = await pool.query(
      "SELECT * FROM drivers WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Driver Not Found" });
    }

    const driver = user.rows[0];
    console.log(driver.driver_id)
    // 2. Check password
    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // 3. Insert ride/location info
    await pool.query(
      "INSERT INTO drivers_rides (driver_id, lat, lng, city, is_available) VALUES ($1, $2, $3, $4, $5)",
      [driver.driver_id, latitude, longitude, null, false]
    );

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { addDriver,driverLogin };